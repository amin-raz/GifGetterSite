import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import { storage } from './storage';
import { Express } from 'express';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export function setupAuth(app: Express) {
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/'
      }
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Get the correct callback URL based on environment
  const replId = process.env.REPL_ID;
  const replSlug = process.env.REPL_SLUG;
  const baseUrl = replId && replSlug 
    ? `https://${replSlug}.${replId}.repl.co`
    : 'http://localhost:5000';
  const callbackURL = `${baseUrl}/api/auth/discord/callback`;

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
            avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          };
          return done(null, user);
        } catch (error) {
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
        // If user not found in database, create a basic user object
        const basicUser = {
          discordId: id,
          username: id,
          avatar: null
        };
        done(null, basicUser);
      } else {
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
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

  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  app.post('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
}