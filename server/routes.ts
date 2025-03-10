import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Auth endpoints
  app.get("/api/auth/me", async (req, res) => {
    console.log('GET /api/auth/me - Session:', req.session);
    // Check if user is authenticated via passport
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json(req.user);
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
        userId: user.discordId, // Use discordId from authenticated user
      });

      const feedback = await storage.createFeedback({
        ...feedbackData,
        username: user.username, // Add username to feedback
      });

      res.json(feedback);
    } catch (error) {
      console.error('Feedback submission error:', error);
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return httpServer;
}