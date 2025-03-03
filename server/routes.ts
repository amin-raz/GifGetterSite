import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import session from 'express-session';
import MemoryStore from 'memorystore';

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax'
    }
  }));

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Discord OAuth Strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.VITE_DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: "/api/auth/discord/callback",
    scope: ["identify"]
  }, async (_accessToken, _refreshToken, profile, done) => {
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

  passport.serializeUser((user: any, done) => {
    done(null, user.discordId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth endpoints
  app.get("/api/auth/discord", (req, res, next) => {
    // Store the return URL in the session
    req.session.returnTo = req.query.returnTo as string || '/';
    passport.authenticate('discord')(req, res, next);
  });

  app.get("/api/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/"
    }),
    (req, res) => {
      // Redirect to the stored return URL or home
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    }
  );

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
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
      const feedback = await storage.createFeedback({
        ...req.body,
        userId: (req.user as any).discordId
      });
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  return httpServer;
}