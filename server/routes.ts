import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFeedbackSchema } from "@shared/schema";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import session from 'express-session';


export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Discord OAuth Strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.VITE_DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: "/api/auth/discord/callback",
    scope: ["identify"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await storage.getUser(profile.id);

      if (!user) {
        user = await storage.createUser({
          discordId: profile.id,
          username: profile.username,
          avatar: profile.avatar
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));

  app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.discordId);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  });


  // Auth endpoints
  app.get("/api/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/"
    }),
    (req, res) => {
      // Get the stored redirect path from localStorage
      const redirectPath = req.session.redirectPath || '/';
      // Clear the stored path
      delete req.session.redirectPath;
      res.redirect(redirectPath);
    }
  );

  app.get("/api/auth/me", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Feedback endpoints
  app.get("/api/feedback", async (_req, res) => {
    const feedback = await storage.getFeedback();
    res.json(feedback);
  });

  app.post("/api/feedback", async (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Must be logged in to submit feedback" });
      return;
    }

    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return httpServer;
}