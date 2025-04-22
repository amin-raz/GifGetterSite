import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";
import { Filter } from 'bad-words';

const filter = new Filter();

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Feedback endpoints
  app.get("/api/feedback", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Must be logged in to view feedback" });
        return;
      }
      
      const user = req.user as any;
      if (user.username !== 'opisal') {
        res.status(403).json({ error: "Not authorized to view feedback" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const feedback = await storage.getFeedback(page, limit);
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

      // Check for spam and daily limits
      const { canSubmit, reason } = await storage.canUserSubmitFeedback(user.discordId);
      if (!canSubmit) {
        res.status(429).json({ error: reason });
        return;
      }

      const feedbackData = {
        ...req.body,
        userId: user.discordId,
        username: user.username
      };

      // Check for inappropriate content
      if (filter.isProfane(feedbackData.content)) {
        res.status(400).json({ error: "Feedback contains inappropriate language" });
        return;
      }

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