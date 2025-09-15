// Main server entry point for SoulArt Temple (JavaScript version for quick deployment)
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const memoize = require("memoizee");
const connectPg = require("connect-pg-simple");
const client = require("openid-client");
const { Strategy } = require("openid-client/passport");
const Stripe = require("stripe");
const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const { users, usageLog, sessions } = require("../shared/schema-js.js");
const { eq, and, gte, desc, sql } = require("drizzle-orm");

const app = express();
const port = process.env.PORT || 5000;

// Database setup
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
const dbClient = postgres(process.env.DATABASE_URL);
const db = drizzle(dbClient);

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  ttl: sessionTtl,
  tableName: "sessions",
});

app.set("trust proxy", 1);
// For development, use a fallback secret, but require it in production
const sessionSecret = process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? 
  (() => { throw new Error("SESSION_SECRET environment variable is required in production"); })() : 
  'development-secret-change-in-production');

app.use(session({
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionTtl,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Storage operations
class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId, stripeCustomerId, stripeSubscriptionId) {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        isSubscribed: true,
        subscriptionStatus: 'active',
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateSubscriptionStatus(userId, status, isSubscribed) {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        isSubscribed,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserUsage(userId) {
    const user = await this.getUser(userId);
    return {
      usage: user?.emotionDecoderUsage || 0,
      isSubscribed: user?.isSubscribed || false,
    };
  }

  async recordEmotionDecoderUse(userId, emotion) {
    // Record in usage log
    await db.insert(usageLog).values({
      userId,
      action: 'emotion_decoder_use',
      emotionProcessed: emotion,
      timestamp: new Date(),
    });

    // Increment user usage counter
    await db
      .update(users)
      .set({
        emotionDecoderUsage: sql`emotion_decoder_usage + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async canUseEmotionDecoder(userId) {
    const user = await this.getUser(userId);
    if (!user) {
      return { canUse: false, usageCount: 0, isSubscribed: false };
    }

    const usageCount = user.emotionDecoderUsage || 0;
    const isSubscribed = user.isSubscribed || false;
    
    // Subscribers have unlimited access
    if (isSubscribed && user.subscriptionStatus === 'active') {
      return { canUse: true, usageCount, isSubscribed: true };
    }
    
    // Non-subscribers get 3 free uses
    const canUse = usageCount < 3;
    return { canUse, usageCount, isSubscribed: false };
  }

  async getUserUsageHistory(userId, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return await db
      .select()
      .from(usageLog)
      .where(and(
        eq(usageLog.userId, userId),
        gte(usageLog.timestamp, since)
      ))
      .orderBy(desc(usageLog.timestamp));
  }
}

const storage = new DatabaseStorage();

// Auth setup
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

async function setupAuth() {
  const config = await getOidcConfig();

  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const domains = process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",") : ['localhost'];
  for (const domain of domains) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
}

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
  const user = req.user;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Initialize auth
setupAuth().catch(console.error);

// Auth routes
app.get("/api/login", (req, res, next) => {
  const hostname = req.hostname || req.headers.host?.split(':')[0] || 'localhost';
  passport.authenticate(`replitauth:${hostname}`, {
    prompt: "login consent",
    scope: ["openid", "email", "profile", "offline_access"],
  })(req, res, next);
});

app.get("/api/callback", (req, res, next) => {
  const hostname = req.hostname || req.headers.host?.split(':')[0] || 'localhost';
  passport.authenticate(`replitauth:${hostname}`, {
    successReturnToOrRedirect: "/",
    failureRedirect: "/api/login",
  })(req, res, next);
});

app.get("/api/logout", async (req, res) => {
  const config = await getOidcConfig();
  req.logout(() => {
    res.redirect(
      client.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID,
        post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
      }).href
    );
  });
});

app.get('/api/auth/user', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Emotion decoder routes
app.get('/api/emotion-decoder/can-use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const usage = await storage.canUseEmotionDecoder(userId);
    res.json(usage);
  } catch (error) {
    console.error("Error checking usage:", error);
    res.status(500).json({ message: "Failed to check usage" });
  }
});

app.post('/api/emotion-decoder/use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { emotion } = req.body;
    
    // Check if user can use the decoder
    const canUse = await storage.canUseEmotionDecoder(userId);
    if (!canUse.canUse) {
      return res.status(403).json({ 
        message: "Usage limit reached. Please subscribe for unlimited access.",
        needsSubscription: true 
      });
    }

    // Record the usage
    await storage.recordEmotionDecoderUse(userId, emotion);
    
    // Return updated usage info
    const updatedUsage = await storage.canUseEmotionDecoder(userId);
    res.json(updatedUsage);
  } catch (error) {
    console.error("Error recording usage:", error);
    res.status(500).json({ message: "Failed to record usage" });
  }
});

// Allergy identifier routes
app.get('/api/allergy-identifier/can-use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const usage = await storage.canUseAllergyIdentifier(userId);
    res.json(usage);
  } catch (error) {
    console.error("Error checking usage:", error);
    res.status(500).json({ message: "Failed to check usage" });
  }
});

app.post('/api/allergy-identifier/use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { allergen } = req.body;
    
    // Check if user can use the identifier
    const canUse = await storage.canUseAllergyIdentifier(userId);
    if (!canUse.canUse) {
      return res.status(403).json({ 
        message: "Usage limit reached. Please subscribe for unlimited access.",
        needsSubscription: true 
      });
    }

    // Record the usage
    await storage.recordAllergyIdentifierUse(userId, allergen);
    
    // Return updated usage info
    const updatedUsage = await storage.canUseAllergyIdentifier(userId);
    res.json(updatedUsage);
  } catch (error) {
    console.error("Error recording usage:", error);
    res.status(500).json({ message: "Failed to record usage" });
  }
});

// Belief decoder routes
app.get('/api/belief-decoder/can-use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const usage = await storage.canUseBeliefDecoder(userId);
    res.json(usage);
  } catch (error) {
    console.error("Error checking usage:", error);
    res.status(500).json({ message: "Failed to check usage" });
  }
});

app.post('/api/belief-decoder/use', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { belief } = req.body;
    
    // Check if user can use the decoder
    const canUse = await storage.canUseBeliefDecoder(userId);
    if (!canUse.canUse) {
      return res.status(403).json({ 
        message: "Usage limit reached. Please subscribe for unlimited access.",
        needsSubscription: true 
      });
    }

    // Record the usage
    await storage.recordBeliefDecoderUse(userId, belief);
    
    // Return updated usage info
    const updatedUsage = await storage.canUseBeliefDecoder(userId);
    res.json(updatedUsage);
  } catch (error) {
    console.error("Error recording usage:", error);
    res.status(500).json({ message: "Failed to record usage" });
  }
});

app.get('/api/usage/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const usage = await storage.getUserUsage(userId);
    const history = await storage.getUserUsageHistory(userId, 30);
    res.json({ ...usage, history });
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    res.status(500).json({ message: "Failed to fetch usage stats" });
  }
});

// Stripe subscription routes
app.post('/api/get-or-create-subscription', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    let user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user already has an active subscription
    if (user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Update local subscription status
      await storage.updateSubscriptionStatus(
        userId, 
        subscription.status, 
        subscription.status === 'active'
      );

      let clientSecret = null;
      if (subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
        const invoice = subscription.latest_invoice;
        if (invoice.payment_intent && typeof invoice.payment_intent === 'object') {
          clientSecret = invoice.payment_intent.client_secret;
        }
      }

      return res.json({
        subscriptionId: subscription.id,
        clientSecret,
        status: subscription.status
      });
    }
    
    if (!user.email) {
      return res.status(400).json({ message: 'No user email on file' });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
    });

    // Create subscription for $3.99/month
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'SoulArt Temple Unlimited Access',
          },
          unit_amount: 399, // £3.99 in pence
          recurring: {
            interval: 'month',
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user with Stripe info
    await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

    let clientSecret = null;
    if (subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
      const invoice = subscription.latest_invoice;
      if (invoice.payment_intent && typeof invoice.payment_intent === 'object') {
        clientSecret = invoice.payment_intent.client_secret;
      }
    }

    res.json({
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(400).json({ error: { message: error.message } });
  }
});

app.post('/api/cancel-subscription', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user?.stripeSubscriptionId) {
      return res.status(404).json({ message: "No subscription found" });
    }

    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await storage.updateSubscriptionStatus(userId, subscription.status, false);

    res.json({ message: "Subscription will be canceled at period end", subscription });
  } catch (error) {
    console.error("Cancellation error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
});

// Stripe webhook endpoint
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!endpointSecret) {
      console.log('Webhook secret not configured, skipping signature verification');
      // In development, you might want to skip verification
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).send('Webhook secret required in production');
      }
    }

    let event;
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // Parse the event for development
      event = JSON.parse(req.body);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (session.subscription) {
          // Find user by subscription ID and update status
          const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, session.subscription));
          if (user) {
            await storage.updateSubscriptionStatus(user.id, 'active', true);
          }
        }
        break;
        
      case 'invoice.paid':
        const paidInvoice = event.data.object;
        if (paidInvoice.subscription) {
          const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, paidInvoice.subscription));
          if (user) {
            await storage.updateSubscriptionStatus(user.id, 'active', true);
          }
        }
        break;
        
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        if (failedInvoice.subscription) {
          const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, failedInvoice.subscription));
          if (user) {
            await storage.updateSubscriptionStatus(user.id, 'past_due', false);
          }
        }
        break;
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, subscription.id));
        if (user) {
          const isActive = subscription.status === 'active';
          await storage.updateSubscriptionStatus(user.id, subscription.status, isActive);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Static files (for the existing frontend)
app.use(express.static("."));

// Start server
app.listen(port, () => {
  console.log(`SoulArt Temple server running on port ${port}`);
});