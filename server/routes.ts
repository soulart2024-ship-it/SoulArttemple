// Routes for SoulArt Temple with auth and subscription management
import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - referenced from javascript_log_in_with_replit integration
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Emotion decoder usage check
  app.get('/api/emotion-decoder/can-use', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const usage = await storage.canUseEmotionDecoder(userId);
      res.json(usage);
    } catch (error) {
      console.error("Error checking usage:", error);
      res.status(500).json({ message: "Failed to check usage" });
    }
  });

  // Record emotion decoder usage
  app.post('/api/emotion-decoder/use', isAuthenticated, async (req: any, res) => {
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

  // Get user usage statistics
  app.get('/api/usage/stats', isAuthenticated, async (req: any, res) => {
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

  // Stripe subscription routes - referenced from javascript_stripe integration
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
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
            currency: 'usd',
            product: {
              name: 'SoulArt Temple Unlimited Access',
            },
            unit_amount: 399, // $3.99 in cents
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
    } catch (error: any) {
      console.error("Subscription error:", error);
      return res.status(400).json({ error: { message: error.message } });
    }
  });

  // Cancel subscription
  app.post('/api/cancel-subscription', isAuthenticated, async (req: any, res) => {
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
    } catch (error: any) {
      console.error("Cancellation error:", error);
      res.status(500).json({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}