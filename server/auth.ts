import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Express } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

const MemoryStoreSession = MemoryStore(session);

// Get domain from environment variables
const domain = process.env.NODE_ENV === 'production' 
  ? process.env.APP_DOMAIN // AWS Amplify domain
  : 'localhost:5000';

const protocol = domain?.includes('localhost') ? 'http' : 'https';
const callbackURL = `${protocol}://${domain}/api/auth/discord/callback`;

export function setupAuth(app: Express) {
  // Session configuration
  app.use(session({
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // Prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'development-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user.discordId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Discord OAuth strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.VITE_DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL,
    scope: ['identify']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await storage.getUser(profile.id);

      if (!user) {
        user = await storage.createUser({
          discordId: profile.id,
          username: profile.username,
          avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  // Discord OAuth routes
  app.get('/api/auth/discord', passport.authenticate('discord'));

  app.get('/api/auth/discord/callback', 
    passport.authenticate('discord', {
      failureRedirect: '/'
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.sendStatus(200);
    });
  });
}