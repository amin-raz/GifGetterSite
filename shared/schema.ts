import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  discordId: text('discord_id').notNull().unique(),
  username: text('username').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Create insert schema for users
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Export feedback types and schema
export const feedback = pgTable('feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({ id: true, createdAt: true });
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;