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

  // Use a stable session store
  const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      }
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.VITE_DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: '/api/auth/discord/callback',
        scope: ['identify']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = {
            discordId: profile.id,
            username: profile.username,
            avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
          };

          const existingUser = await storage.getUser(user.discordId);
          if (existingUser) {
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
      if (!user) {
        return done(null, null);
      }
      done(null, user);
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

  app.get('/api/auth/discord', (req, res, next) => {
    const state = req.query.state as string;
    if (state) {
      req.session.returnTo = state;
    }
    passport.authenticate('discord', {
      failureRedirect: '/',
      failureMessage: true
    })(req, res, next);
  });

  app.get('/api/auth/discord/callback',
    passport.authenticate('discord', {
      failureRedirect: '/',
      failureMessage: true
    }),
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
}