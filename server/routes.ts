import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

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
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Must be logged in to submit feedback" });
      return;
    }

    try {
      const user = req.user as any;
      const feedbackData = {
        ...req.body,
        userId: user.discordId,
        username: user.username
      };

      const validatedData = insertFeedbackSchema.parse(feedbackData);
      const feedback = await storage.createFeedback(validatedData);
      res.json(feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return httpServer;
}