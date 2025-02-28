import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  discordId: true,
  username: true,
  avatar: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  userId: true,
  content: true,
  type: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
