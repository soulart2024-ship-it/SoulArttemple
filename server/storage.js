// Storage operations for SoulArt Temple - referenced from javascript_log_in_with_replit integration
import { users, usageLog, } from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";
export class DatabaseStorage {
    // User operations - (IMPORTANT) these user operations are mandatory for Replit Auth.
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
    // Subscription management
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
    // Usage tracking for emotion decoder
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
            emotionDecoderUsage: sql `emotion_decoder_usage + 1`,
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
    // Usage analytics
    async getUserUsageHistory(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return await db
            .select()
            .from(usageLog)
            .where(and(eq(usageLog.userId, userId), gte(usageLog.timestamp, since)))
            .orderBy(desc(usageLog.timestamp));
    }
}
export const storage = new DatabaseStorage();
