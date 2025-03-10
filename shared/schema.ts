import { z } from 'zod';

// User types
export const insertUserSchema = z.object({
  discordId: z.string(),
  username: z.string(),
  avatar: z.string().nullable(),
});

export type User = {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  createdAt: Date | null;
};

export type InsertUser = z.infer<typeof insertUserSchema>;

// Feedback types
export const insertFeedbackSchema = z.object({
  userId: z.string(),
  content: z.string(),
  type: z.string(),
  username: z.string(), // Add username field
});

export type Feedback = {
  id: string;
  userId: string | null;
  content: string;
  type: string;
  username: string; // Add username field
  createdAt: Date | null;
};

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;