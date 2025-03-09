import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import { storage } from './storage';
import { Express } from 'express';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export function setupAuth(app: Express) {
  // Force development mode if not set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  console.log('Setting up auth in environment:', process.env.NODE_ENV);

  // Trust first proxy for Replit environment
  app.set('trust proxy', 1);

  // Set up session middleware with MemoryStore
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
        secure: false, // Allow non-HTTPS in development
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/'
      }
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Use the exact callback URL registered in Discord Developer Portal
  const callbackURL = 'https://cd8b2f32-42e4-4c51-bc8a-8f1cfb255c3e-00-1fk8ng1yhc5k7.janeway.replit.dev/api/auth/discord/callback';

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
          console.log('Discord auth callback received profile:', profile.username);
          const user = {
            discordId: profile.id,
            username: profile.username,
            avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          };
          return done(null, user);
        } catch (error) {
          console.error('Error in Discord strategy:', error);
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    console.log('Serializing user:', user.username);
    done(null, user.discordId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('Deserializing user ID:', id);
      const user = await storage.getUser(id);
      if (!user) {
        const basicUser = {
          discordId: id,
          username: id,
          avatar: null
        };
        console.log('Created basic user:', basicUser.username);
        done(null, basicUser);
      } else {
        console.log('Found existing user:', user.username);
        done(null, user);
      }
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });

  // Auth routes
  app.get('/api/auth/me', (req, res) => {
    console.log('GET /api/auth/me - Session:', req.session);
    console.log('User authenticated:', req.isAuthenticated());
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
    passport.authenticate('discord')(req, res, next);
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