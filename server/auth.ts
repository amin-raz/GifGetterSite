import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';
import { storage } from './storage';
import { Express } from 'express';

const PostgresStore = connectPg(session);

export function setupAuth(app: Express) {
  console.log('Setting up authentication...');

  // Set up session middleware
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
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    })
  );

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Discord strategy
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.VITE_DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: '/api/auth/discord/callback',
        scope: ['identify', 'email']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        console.log('Discord authentication callback with profile:', profile.username);
        try {
          // Check if user exists
          let user = await storage.getUser(profile.id);
          console.log('Existing user found:', !!user);

          if (!user) {
            // Create new user if doesn't exist
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

  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    console.log('Serializing user:', user.username);
    done(null, user.discordId);
  });

  // Deserialize user from the session
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

  // Auth routes
  app.get('/api/auth/discord', (req, res, next) => {
    console.log('Starting Discord authentication');
    passport.authenticate('discord')(req, res, next);
  });

  app.get('/api/auth/discord/callback',
    (req, res, next) => {
      console.log('Received callback from Discord');
      passport.authenticate('discord', {
        failureRedirect: '/'
      })(req, res, next);
    },
    (req, res) => {
      console.log('Authentication successful, redirecting to:', req.session.returnTo || '/');
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

  console.log('Authentication setup complete');
}