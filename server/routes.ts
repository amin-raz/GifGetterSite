import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Auth endpoints
  app.get("/api/auth/me", async (req, res) => {
    console.log('GET /api/auth/me - Session:', req.session);
    // Check if user is authenticated via session
    if (!req.session?.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json(user);
  });

  app.post("/api/auth/discord", async (req, res) => {
    console.log('POST /api/auth/discord - Body:', req.body);
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUser(userData.discordId);

      if (existingUser) {
        req.session.userId = existingUser.discordId;
        res.json(existingUser);
        return;
      }

      const newUser = await storage.createUser(userData);
      req.session.userId = newUser.discordId;
      res.json(newUser);
    } catch (error) {
      console.error('Discord auth error:', error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Feedback endpoints
  app.get("/api/feedback", async (_req, res) => {
    try {
      const feedback = await storage.getFeedback();
      res.json(feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    console.log('POST /api/feedback - Session:', req.session, 'Body:', req.body);
    // Check if user is authenticated via passport
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Must be logged in to submit feedback" });
      return;
    }

    try {
      const user = req.user as any; // Using passport's user object
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId: user.discordId // Use discordId from authenticated user
      });
      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      console.error('Feedback submission error:', error);
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return httpServer;
}