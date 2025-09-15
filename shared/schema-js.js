// Database schema for SoulArt Temple (JavaScript version)
const { sql } = require('drizzle-orm');
const {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
} = require("drizzle-orm/pg-core");

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Stripe integration fields
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  // Usage tracking for emotion decoder
  emotionDecoderUsage: integer("emotion_decoder_usage").default(0),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionStatus: varchar("subscription_status"), // active, canceled, past_due, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage tracking table for detailed analytics
const usageLog = pgTable("usage_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action").notNull(), // 'emotion_decoder_use'
  timestamp: timestamp("timestamp").defaultNow(),
  emotionProcessed: varchar("emotion_processed"), // which emotion was processed
  metadata: jsonb("metadata"), // additional data like healing step completed
});

module.exports = {
  sessions,
  users,
  usageLog
};