// Storage operations for SoulArt Temple - referenced from javascript_log_in_with_replit integration
import {
  users,
  usageLog,
  type User,
  type UpsertUser,
  type InsertUsageLog,
} from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Subscription management
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateSubscriptionStatus(userId: string, status: string, isSubscribed: boolean): Promise<User>;
  
  // Usage tracking for emotion decoder
  getUserUsage(userId: string): Promise<{ usage: number; isSubscribed: boolean }>;
  recordEmotionDecoderUse(userId: string, emotion?: string): Promise<void>;
  canUseEmotionDecoder(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }>;
  
  // Usage tracking for allergy identifier
  recordAllergyIdentifierUse(userId: string, allergen?: string): Promise<void>;
  canUseAllergyIdentifier(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }>;
  
  // Usage tracking for belief decoder
  recordBeliefDecoderUse(userId: string, belief?: string): Promise<void>;
  canUseBeliefDecoder(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }>;
  
  // Usage analytics
  getUserUsageHistory(userId: string, days?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - (IMPORTANT) these user operations are mandatory for Replit Auth.
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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

  // Subscription management
  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
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

  async updateSubscriptionStatus(userId: string, status: string, isSubscribed: boolean): Promise<User> {
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

  // Usage tracking for emotion decoder
  async getUserUsage(userId: string): Promise<{ usage: number; isSubscribed: boolean }> {
    const user = await this.getUser(userId);
    return {
      usage: user?.emotionDecoderUsage || 0,
      isSubscribed: user?.isSubscribed || false,
    };
  }

  async recordEmotionDecoderUse(userId: string, emotion?: string): Promise<void> {
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

  async canUseEmotionDecoder(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }> {
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

  // Usage tracking for allergy identifier
  async recordAllergyIdentifierUse(userId: string, allergen?: string): Promise<void> {
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

  async canUseAllergyIdentifier(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }> {
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
  async recordBeliefDecoderUse(userId: string, belief?: string): Promise<void> {
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

  async canUseBeliefDecoder(userId: string): Promise<{ canUse: boolean; usageCount: number; isSubscribed: boolean }> {
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

  // Usage analytics
  async getUserUsageHistory(userId: string, days: number = 30): Promise<any[]> {
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

export const storage = new DatabaseStorage();