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
const { users, usageLog, sessions, journalEntries, artworks, healingSessions } = require("../shared/schema-js.js");
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

// Cache-busting middleware to prevent browser caching after republishing
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
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

  // Usage tracking for allergy identifier
  async recordAllergyIdentifierUse(userId, allergen) {
    // Record in usage log
    await db.insert(usageLog).values({
      userId,
      action: 'allergy_identifier_use',
      allergenProcessed: allergen,
      timestamp: new Date(),
    });

    // Increment user usage counter
    await db
      .update(users)
      .set({
        allergyIdentifierUsage: sql`allergy_identifier_usage + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async canUseAllergyIdentifier(userId) {
    const user = await this.getUser(userId);
    if (!user) {
      return { canUse: false, usageCount: 0, isSubscribed: false };
    }

    const usageCount = user.allergyIdentifierUsage || 0;
    const isSubscribed = user.isSubscribed || false;
    
    // Subscribers have unlimited access
    if (isSubscribed && user.subscriptionStatus === 'active') {
      return { canUse: true, usageCount, isSubscribed: true };
    }
    
    // Non-subscribers get 3 free uses
    return { canUse: usageCount < 3, usageCount, isSubscribed: false };
  }

  // Usage tracking for belief decoder
  async recordBeliefDecoderUse(userId, belief) {
    // Record in usage log
    await db.insert(usageLog).values({
      userId,
      action: 'belief_decoder_use',
      beliefProcessed: belief,
      timestamp: new Date(),
    });

    // Increment user usage counter
    await db
      .update(users)
      .set({
        beliefDecoderUsage: sql`belief_decoder_usage + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async canUseBeliefDecoder(userId) {
    const user = await this.getUser(userId);
    if (!user) {
      return { canUse: false, usageCount: 0, isSubscribed: false };
    }

    const usageCount = user.beliefDecoderUsage || 0;
    const isSubscribed = user.isSubscribed || false;
    
    // Subscribers have unlimited access
    if (isSubscribed && user.subscriptionStatus === 'active') {
      return { canUse: true, usageCount, isSubscribed: true };
    }
    
    // Non-subscribers get 3 free uses
    return { canUse: usageCount < 3, usageCount, isSubscribed: false };
  }

  // Journal management methods
  async createJournalEntry(userId, title, content, mood, tags) {
    // Check if user has reached 200 entry limit
    const entryCount = await this.getJournalEntryCount(userId);
    
    if (entryCount >= 200) {
      // Delete oldest 20 entries to make room
      await this.deleteOldestJournalEntries(userId, 20);
    }

    // Create new entry
    const [entry] = await db.insert(journalEntries).values({
      userId,
      title: title || null,
      content,
      mood: mood || null,
      tags: tags || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return entry;
  }

  async getJournalEntries(userId, limit = 50, offset = 0) {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getJournalEntry(entryId, userId) {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ));
    return entry;
  }

  async updateJournalEntry(entryId, userId, updates) {
    const [entry] = await db
      .update(journalEntries)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ))
      .returning();
    return entry;
  }

  async deleteJournalEntry(entryId, userId) {
    await db
      .delete(journalEntries)
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ));
  }

  async getJournalEntryCount(userId) {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId));
    return parseInt(result.count) || 0;
  }

  async deleteOldestJournalEntries(userId, count) {
    const oldestEntries = await db
      .select({ id: journalEntries.id })
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(journalEntries.createdAt)
      .limit(count);
    
    if (oldestEntries.length > 0) {
      const entryIds = oldestEntries.map(entry => entry.id);
      await db
        .delete(journalEntries)
        .where(and(
          eq(journalEntries.userId, userId),
          sql`id = ANY(${entryIds})`
        ));
    }
  }

  async getAllJournalEntriesForDownload(userId) {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
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
  // Always include the custom domain for production
  if (!domains.includes('soularttemple.com')) {
    domains.push('soularttemple.com');
  }
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

// Journal entry routes
app.post('/api/journal/entries', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { title, content, mood, tags } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Journal entry content is required" });
    }

    const entry = await storage.createJournalEntry(userId, title, content, mood, tags);
    res.json(entry);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ message: "Failed to create journal entry" });
  }
});

app.get('/api/journal/entries', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const entries = await storage.getJournalEntries(userId, limit, offset);
    const totalCount = await storage.getJournalEntryCount(userId);
    
    res.json({ entries, totalCount, limit, offset });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ message: "Failed to fetch journal entries" });
  }
});

app.get('/api/journal/entries/:entryId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { entryId } = req.params;
    
    const entry = await storage.getJournalEntry(entryId, userId);
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    
    res.json(entry);
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    res.status(500).json({ message: "Failed to fetch journal entry" });
  }
});

app.put('/api/journal/entries/:entryId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { entryId } = req.params;
    const { title, content, mood, tags } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Journal entry content is required" });
    }

    const entry = await storage.updateJournalEntry(entryId, userId, { title, content, mood, tags });
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    
    res.json(entry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    res.status(500).json({ message: "Failed to update journal entry" });
  }
});

app.delete('/api/journal/entries/:entryId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { entryId } = req.params;
    
    const entry = await storage.getJournalEntry(entryId, userId);
    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    
    await storage.deleteJournalEntry(entryId, userId);
    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Failed to delete journal entry" });
  }
});

app.get('/api/journal/download', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const entries = await storage.getAllJournalEntriesForDownload(userId);
    
    // Format entries for download
    const downloadContent = entries.map(entry => ({
      id: entry.id,
      title: entry.title || 'Untitled Entry',
      content: entry.content,
      mood: entry.mood || 'Not specified',
      tags: entry.tags || 'No tags',
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }));
    
    res.json({
      totalEntries: entries.length,
      exportDate: new Date().toISOString(),
      entries: downloadContent
    });
  } catch (error) {
    console.error("Error preparing journal download:", error);
    res.status(500).json({ message: "Failed to prepare journal download" });
  }
});

// Artwork routes for Doodle Canvas
app.post('/api/artworks', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { title, imageDataUrl, canvasWidth, canvasHeight, toolsUsed } = req.body;
    
    // Validate input
    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      return res.status(400).json({ message: "Image data is required" });
    }
    
    // Check if it's a valid data URL
    if (!imageDataUrl.startsWith('data:image/')) {
      return res.status(400).json({ message: "Invalid image format" });
    }
    
    // Check size limits (10MB max)
    if (imageDataUrl.length > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "Image too large (max 10MB)" });
    }
    
    // Create artwork record
    const [artwork] = await db.insert(artworks).values({
      userId,
      title: title || `Doodle Art ${new Date().toLocaleDateString()}`,
      imageDataUrl,
      canvasWidth: canvasWidth || 600,
      canvasHeight: canvasHeight || 450,
      toolsUsed: toolsUsed || {},
    }).returning();
    
    res.json({
      id: artwork.id,
      title: artwork.title,
      createdAt: artwork.createdAt,
      message: "Artwork saved successfully!"
    });
  } catch (error) {
    console.error("Error saving artwork:", error);
    res.status(500).json({ message: "Failed to save artwork" });
  }
});

app.get('/api/artworks', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const userArtworks = await db
      .select({
        id: artworks.id,
        title: artworks.title,
        canvasWidth: artworks.canvasWidth,
        canvasHeight: artworks.canvasHeight,
        createdAt: artworks.createdAt,
        updatedAt: artworks.updatedAt,
      })
      .from(artworks)
      .where(eq(artworks.userId, userId))
      .orderBy(desc(artworks.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Get total count
    const [countResult] = await db
      .select({ count: sql`count(*)` })
      .from(artworks)
      .where(eq(artworks.userId, userId));
    
    res.json({
      artworks: userArtworks,
      totalCount: parseInt(countResult.count) || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
});

app.get('/api/artworks/:artworkId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { artworkId } = req.params;
    
    const [artwork] = await db
      .select()
      .from(artworks)
      .where(and(
        eq(artworks.id, artworkId),
        eq(artworks.userId, userId)
      ));
    
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    
    res.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    res.status(500).json({ message: "Failed to fetch artwork" });
  }
});

app.delete('/api/artworks/:artworkId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { artworkId } = req.params;
    
    // Check if artwork exists and belongs to user
    const [artwork] = await db
      .select()
      .from(artworks)
      .where(and(
        eq(artworks.id, artworkId),
        eq(artworks.userId, userId)
      ));
    
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    
    // Delete the artwork
    await db
      .delete(artworks)
      .where(and(
        eq(artworks.id, artworkId),
        eq(artworks.userId, userId)
      ));
    
    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    res.status(500).json({ message: "Failed to delete artwork" });
  }
});

// New tiered subscription system
const SUBSCRIPTION_PLANS = {
  basic_monthly: {
    name: 'SoulArt Temple Basic Monthly',
    description: 'Emotion Decoder + Doodle Canvas + Journal',
    amount: 399, // £3.99 in pence
    currency: 'gbp',
    interval: 'month',
    tier: 'basic'
  },
  premium_monthly: {
    name: 'SoulArt Temple Premium Monthly', 
    description: 'All features including Belief Decoder + Allergy Identifier',
    amount: 599, // £5.99 in pence
    currency: 'gbp',
    interval: 'month',
    tier: 'premium'
  },
  basic_yearly: {
    name: 'SoulArt Temple Basic Yearly',
    description: 'Emotion Decoder + Doodle Canvas + Journal (25% discount)',
    amount: 3600, // £36.00 in pence (25% off £48)
    currency: 'gbp',
    interval: 'year',
    tier: 'basic'
  },
  premium_yearly: {
    name: 'SoulArt Temple Premium Yearly',
    description: 'All features (25% discount)',
    amount: 5391, // £53.91 in pence (25% off £71.88)
    currency: 'gbp',
    interval: 'year', 
    tier: 'premium'
  }
};

// Helper functions for subscription access control
function hasBasicAccess(user) {
  return user.subscriptionTier === 'basic' || user.subscriptionTier === 'premium';
}

function hasPremiumAccess(user) {
  return user.subscriptionTier === 'premium';
}

async function canStartSession(feature, user) {
  // Check subscription tier for premium features
  if (feature === 'belief_decoder' || feature === 'allergy_identifier') {
    return hasPremiumAccess(user) && user.subscriptionStatus === 'active';
  }
  
  // For emotion decoder - basic/premium subscribers get unlimited access
  if (feature === 'emotion_decoder') {
    if (hasBasicAccess(user) && user.subscriptionStatus === 'active') {
      return true;
    }
    
    // Free users get 3 sessions
    return (user.emotionDecoderSessions || 0) < 3;
  }
  
  return false;
}

// Session Management API for healing features
app.post('/api/sessions/start', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { feature } = req.body; // emotion_decoder, belief_decoder, allergy_identifier
    
    if (!['emotion_decoder', 'belief_decoder', 'allergy_identifier'].includes(feature)) {
      return res.status(400).json({ message: "Invalid feature type" });
    }
    
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check access permissions using new session-based logic
    const canStart = await canStartSession(feature, user[0]);
    
    if (!canStart) {
      if (feature === 'belief_decoder' || feature === 'allergy_identifier') {
        return res.status(403).json({ 
          message: `${feature.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())} requires Premium subscription (£5.99/month)`,
          needsSubscription: true,
          requiredTier: 'premium',
          currentTier: user[0].subscriptionTier || 'free'
        });
      }
      
      if (feature === 'emotion_decoder') {
        return res.status(403).json({
          message: "You've used all 3 free Emotion Decoder sessions. Subscribe for unlimited access!",
          needsSubscription: true,
          sessionsUsed: user[0].emotionDecoderSessions || 0,
          maxSessions: 3,
          currentTier: user[0].subscriptionTier || 'free'
        });
      }
    }
    
    // Check for existing active session
    const [activeSession] = await db
      .select()
      .from(healingSessions)
      .where(and(
        eq(healingSessions.userId, userId),
        eq(healingSessions.feature, feature),
        eq(healingSessions.status, 'active')
      ));
    
    if (activeSession) {
      return res.json({
        sessionId: activeSession.id,
        feature: activeSession.feature,
        startedAt: activeSession.startedAt,
        removalCount: activeSession.removalCount,
        status: 'active'
      });
    }
    
    // Create new session
    const [newSession] = await db.insert(healingSessions).values({
      userId,
      feature,
      status: 'active'
    }).returning();
    
    res.json({
      sessionId: newSession.id,
      feature: newSession.feature,
      startedAt: newSession.startedAt,
      removalCount: newSession.removalCount,
      status: 'active'
    });
  } catch (error) {
    console.error('Session start error:', error);
    res.status(500).json({ message: 'Error starting session' });
  }
});

app.post('/api/sessions/:sessionId/record-removal', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { sessionId } = req.params;
    const { emotion, belief, allergen } = req.body;
    
    // Find the session and verify ownership
    const [session] = await db
      .select()
      .from(healingSessions)
      .where(and(
        eq(healingSessions.id, sessionId),
        eq(healingSessions.userId, userId),
        eq(healingSessions.status, 'active')
      ));
    
    if (!session) {
      return res.status(404).json({ message: "Session not found or not active" });
    }
    
    // Increment removal count
    const [updatedSession] = await db
      .update(healingSessions)
      .set({ 
        removalCount: session.removalCount + 1,
        updatedAt: new Date()
      })
      .where(eq(healingSessions.id, sessionId))
      .returning();
    
    // Log the usage for analytics
    await db.insert(usageLog).values({
      userId,
      action: `${session.feature}_use`,
      emotionProcessed: emotion,
      beliefProcessed: belief,
      allergenProcessed: allergen,
      metadata: { 
        sessionId: sessionId,
        removalNumber: updatedSession.removalCount 
      }
    });
    
    res.json({
      sessionId: updatedSession.id,
      removalCount: updatedSession.removalCount,
      message: "Removal recorded successfully"
    });
  } catch (error) {
    console.error('Record removal error:', error);
    res.status(500).json({ message: 'Error recording removal' });
  }
});

app.post('/api/sessions/:sessionId/complete', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { sessionId } = req.params;
    
    // Find the session and verify ownership
    const [session] = await db
      .select()
      .from(healingSessions)
      .where(and(
        eq(healingSessions.id, sessionId),
        eq(healingSessions.userId, userId),
        eq(healingSessions.status, 'active')
      ));
    
    if (!session) {
      return res.status(404).json({ message: "Session not found or not active" });
    }
    
    // Complete the session
    const [completedSession] = await db
      .update(healingSessions)
      .set({ 
        status: 'completed',
        completedAt: new Date()
      })
      .where(eq(healingSessions.id, sessionId))
      .returning();
    
    // If this is an emotion decoder session for a non-subscriber, increment their session count
    if (session.feature === 'emotion_decoder') {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (user[0] && !hasBasicAccess(user[0])) {
        await db
          .update(users)
          .set({ 
            emotionDecoderSessions: (user[0].emotionDecoderSessions || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      }
    }
    
    res.json({
      sessionId: completedSession.id,
      completedAt: completedSession.completedAt,
      totalRemovals: completedSession.removalCount,
      message: "Session completed successfully"
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Error completing session' });
  }
});

app.get('/api/sessions/active', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { feature } = req.query;
    
    if (!feature || !['emotion_decoder', 'belief_decoder', 'allergy_identifier'].includes(feature)) {
      return res.status(400).json({ message: "Valid feature parameter required" });
    }
    
    const [activeSession] = await db
      .select()
      .from(healingSessions)
      .where(and(
        eq(healingSessions.userId, userId),
        eq(healingSessions.feature, feature),
        eq(healingSessions.status, 'active')
      ));
    
    if (!activeSession) {
      return res.json({ activeSession: null });
    }
    
    res.json({
      activeSession: {
        sessionId: activeSession.id,
        feature: activeSession.feature,
        startedAt: activeSession.startedAt,
        removalCount: activeSession.removalCount,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({ message: 'Error fetching active session' });
  }
});

// New checkout endpoint for tiered subscriptions
app.post('/api/checkout/start', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { plan } = req.query; // basic_monthly, premium_monthly, basic_yearly, premium_yearly
    
    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }
    
    let user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.email) {
      return res.status(400).json({ message: 'No user email on file' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
      });
      customerId = customer.id;
      await storage.updateUserStripeInfo(userId, customerId, null);
    }

    const planConfig = SUBSCRIPTION_PLANS[plan];
    
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: planConfig.currency,
          product_data: {
            name: planConfig.name,
            description: planConfig.description,
          },
          unit_amount: planConfig.amount,
          recurring: {
            interval: planConfig.interval,
          },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin || 'https://soularttemple.com'}/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://soularttemple.com'}/membership`,
      metadata: {
        userId: userId,
        plan: plan,
        tier: planConfig.tier,
        interval: planConfig.interval
      }
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
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
        status: subscription.status,
        tier: user.subscriptionTier || 'basic',
        interval: user.subscriptionInterval || 'month',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd
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

    // Redirect to new checkout system (default to basic monthly)
    return res.json({
      message: "Please use the new checkout system",
      redirectTo: "/api/checkout/start?plan=basic_monthly",
      hasSubscription: false
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
        console.log('Checkout session completed:', session.metadata);
        
        if (session.subscription && session.metadata?.userId) {
          const userId = session.metadata.userId;
          const tier = session.metadata.tier || 'basic';
          const interval = session.metadata.interval || 'month';
          const plan = session.metadata.plan;
          
          // Get the subscription to extract period end and price details
          let currentPeriodEnd = null;
          let stripePriceId = null;
          
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            currentPeriodEnd = new Date(subscription.current_period_end * 1000);
            stripePriceId = subscription.items.data[0]?.price?.id || null;
          } catch (error) {
            console.error('Error retrieving subscription details:', error);
          }
          
          // Update user with complete subscription details
          await db.update(users)
            .set({
              stripeSubscriptionId: session.subscription,
              subscriptionStatus: 'active',
              isSubscribed: true,
              subscriptionTier: tier,
              subscriptionInterval: interval,
              subscriptionCurrentPeriodEnd: currentPeriodEnd,
              stripePriceId: stripePriceId,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));
            
          console.log(`User ${userId} subscription updated: ${tier} ${interval}, ends: ${currentPeriodEnd}`);
        }
        break;
        
      case 'invoice.paid':
        const paidInvoice = event.data.object;
        if (paidInvoice.subscription) {
          const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, paidInvoice.subscription));
          if (user) {
            await db.update(users)
              .set({
                subscriptionStatus: 'active',
                isSubscribed: true,
                updatedAt: new Date()
              })
              .where(eq(users.id, user.id));
          }
        }
        break;
        
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        if (failedInvoice.subscription) {
          const [user] = await db.select().from(users).where(eq(users.stripeSubscriptionId, failedInvoice.subscription));
          if (user) {
            await db.update(users)
              .set({
                subscriptionStatus: 'past_due',
                isSubscribed: false,
                updatedAt: new Date()
              })
              .where(eq(users.id, user.id));
          }
        }
        break;
        
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        const [subscriptionUser] = await db.select().from(users).where(eq(users.stripeSubscriptionId, updatedSubscription.id));
        
        if (subscriptionUser) {
          // Extract price details to determine tier and interval
          let tier = subscriptionUser.subscriptionTier || 'basic';
          let interval = subscriptionUser.subscriptionInterval || 'month';
          let stripePriceId = null;
          
          if (updatedSubscription.items?.data?.[0]?.price) {
            const priceAmount = updatedSubscription.items.data[0].price.unit_amount;
            const priceInterval = updatedSubscription.items.data[0].price.recurring?.interval;
            stripePriceId = updatedSubscription.items.data[0].price.id;
            
            // Map price to tier based on amount and interval
            if (priceInterval === 'month') {
              tier = priceAmount >= 599 ? 'premium' : 'basic'; // £5.99+ = premium
              interval = 'month';
            } else if (priceInterval === 'year') {
              tier = priceAmount >= 5391 ? 'premium' : 'basic'; // £53.91+ = premium
              interval = 'year';
            }
          }
          
          // Update subscription details
          await db.update(users)
            .set({
              subscriptionStatus: updatedSubscription.status,
              isSubscribed: updatedSubscription.status === 'active',
              subscriptionTier: tier,
              subscriptionInterval: interval,
              subscriptionCurrentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
              stripePriceId: stripePriceId,
              updatedAt: new Date()
            })
            .where(eq(users.id, subscriptionUser.id));
            
          console.log(`Subscription updated for user ${subscriptionUser.id}: ${tier} ${interval}, status: ${updatedSubscription.status}`);
        }
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const [canceledUser] = await db.select().from(users).where(eq(users.stripeSubscriptionId, deletedSubscription.id));
        
        if (canceledUser) {
          await db.update(users)
            .set({
              subscriptionStatus: 'canceled',
              isSubscribed: false,
              subscriptionTier: null,
              subscriptionInterval: null,
              subscriptionCurrentPeriodEnd: null,
              updatedAt: new Date()
            })
            .where(eq(users.id, canceledUser.id));
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