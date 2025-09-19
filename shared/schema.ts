// Database schema for SoulArt Temple - referenced from javascript_log_in_with_replit integration
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
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
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Stripe integration fields - referenced from javascript_stripe integration
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  // Usage tracking for emotion decoder
  emotionDecoderUsage: integer("emotion_decoder_usage").default(0),
  // Usage tracking for allergy identifier
  allergyIdentifierUsage: integer("allergy_identifier_usage").default(0),
  // Usage tracking for belief decoder
  beliefDecoderUsage: integer("belief_decoder_usage").default(0),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionStatus: varchar("subscription_status"), // active, canceled, past_due, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage tracking table for detailed analytics
export const usageLog = pgTable("usage_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action").notNull(), // 'emotion_decoder_use', 'allergy_identifier_use', 'belief_decoder_use'
  timestamp: timestamp("timestamp").defaultNow(),
  emotionProcessed: varchar("emotion_processed"), // which emotion was processed
  allergenProcessed: varchar("allergen_processed"), // which allergen was processed
  beliefProcessed: varchar("belief_processed"), // which belief was processed
  metadata: jsonb("metadata"), // additional data like healing step completed
});

// Journal entries table for Sacred Reflections
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title"), // optional title for the entry
  content: varchar("content").notNull(), // the journal entry text
  mood: varchar("mood"), // optional mood tracking
  tags: varchar("tags"), // comma-separated tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Artworks table for Doodle Canvas creations
export const artworks = pgTable("artworks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title"), // optional title for the artwork
  imageDataUrl: varchar("image_data_url").notNull(), // base64 encoded image data
  canvasWidth: integer("canvas_width").default(600),
  canvasHeight: integer("canvas_height").default(450),
  toolsUsed: jsonb("tools_used"), // metadata about tools/colors used
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UsageLog = typeof usageLog.$inferSelect;
export type InsertUsageLog = typeof usageLog.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;
export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;