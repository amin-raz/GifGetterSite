import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import { storage } from './storage';
import { Express } from 'express';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export function setupAuth(app: Express) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  app.set('trust proxy', 1);

  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
      }
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Get the current hostname for the callback URL
  const hostname = process.env.NODE_ENV === 'production'
    ? 'https://gifgetter.replit.app'  // Update this with your production domain
    : 'http://localhost:5000';

  const callbackURL = `${hostname}/api/auth/discord/callback`;

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.VITE_DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL,
        scope: ['identify', 'email']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = {
            discordId: profile.id,
            username: profile.username,
            avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
          };

          let existingUser = await storage.getUser(user.discordId);

          if (existingUser) {
            // Update existing user in case their username or avatar changed
            existingUser = {
              ...existingUser,
              username: user.username,
              avatar: user.avatar
            };
            return done(null, existingUser);
          }

          const newUser = await storage.createUser(user);
          return done(null, newUser);
        } catch (error) {
          console.error('Error in Discord strategy:', error);
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.discordId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });

  // Auth routes
  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  let lastAuthAttempt = 0;
  const AUTH_COOLDOWN = 2000; // 2 seconds between auth attempts

  app.get('/api/auth/discord', (req, res, next) => {
    const now = Date.now();
    if (now - lastAuthAttempt < AUTH_COOLDOWN) {
      res.status(429).json({
        error: 'Too many auth attempts. Please wait a moment before trying again.'
      });
      return;
    }
    lastAuthAttempt = now;

    const state = req.query.state as string;
    if (state) {
      req.session.returnTo = state;
    }
    passport.authenticate('discord')(req, res, next);
  });

  app.get('/api/auth/discord/callback',
    (req, res, next) => {
      passport.authenticate('discord', {
        failureRedirect: '/',
        failureMessage: true
      })(req, res, next);
    },
    (req, res) => {
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    }
  );

  app.post('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Auth error:', err);
    if (err.name === 'InternalOAuthError') {
      res.status(500).json({
        error: 'Failed to authenticate with Discord. Please try again later.'
      });
    } else {
      next(err);
    }
  });
}