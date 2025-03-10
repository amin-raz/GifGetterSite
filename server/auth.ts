import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';
import { storage } from './storage';
import { Express } from 'express';

const PostgresStore = connectPg(session);

// Helper function to get the base URL for the application
function getBaseUrl() {
  // Check if we're running on Replit
  if (process.env.REPL_ID && process.env.REPL_SLUG) {
    return `https://cd8b2f32-42e4-4c51-bc8a-8f1cfb255c3e-00-1fk8ng1yhc5k7.janeway.replit.dev`;
  }
  // Fallback to localhost for development
  return 'http://localhost:5000';
}

export function setupAuth(app: Express) {
  console.log('Setting up authentication...');

  const baseUrl = getBaseUrl();
  console.log('Using base URL for auth:', baseUrl); // Debug log

  // Trust first proxy
  app.set('trust proxy', 1);

  // Set up session middleware with updated cookie settings
  app.use(
    session({
      store: new PostgresStore({
        pool,
        tableName: 'sessions',
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    })
  );

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Discord strategy with environment-aware callback URL
  const callbackURL = `${baseUrl}/api/auth/discord/callback`;
  console.log('Using Discord callback URL:', callbackURL);

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.VITE_DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL,
        scope: ['identify', 'email']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        console.log('Discord authentication callback with profile:', profile.username);
        try {
          let user = await storage.getUser(profile.id);
          console.log('Existing user found:', !!user);

          if (!user) {
            console.log('Creating new user for:', profile.username);
            user = await storage.createUser({
              discordId: profile.id,
              username: profile.username,
              avatar: profile.avatar
            });
          }

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
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error);
    }
  });

  // Register auth routes before any other middleware
  app.get('/api/auth/discord', (req, res, next) => {
    console.log('Starting Discord authentication, query params:', req.query);
    const state = req.query.state as string;
    if (state) {
      req.session.returnTo = state;
    }
    passport.authenticate('discord')(req, res, next);
  });

  // Explicitly register the callback route
  app.get('/api/auth/discord/callback',
    (req, res, next) => {
      console.log('Received callback from Discord, query params:', req.query);
      console.log('Session before auth:', req.session);

      passport.authenticate('discord', {
        failureRedirect: '/',
        failureMessage: true
      })(req, res, next);
    },
    (req, res) => {
      console.log('Authentication successful, session:', req.session);
      console.log('User after auth:', req.user);
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    }
  );

  app.get('/api/auth/me', (req, res) => {
    console.log('Checking authentication status:', req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  app.post('/api/auth/logout', (req, res, next) => {
    console.log('Logging out user');
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Add error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Authentication error', message: err.message });
  });

  console.log('Authentication setup complete');
}