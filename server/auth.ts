import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';
import { storage } from './storage';
import { Express } from 'express';

const PostgresStore = connectPg(session);

export function setupAuth(app: Express) {
  // Set up session middleware
  app.use(
    session({
      store: new PostgresStore({
        pool,
        tableName: 'sessions'
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
        try {
          // Check if user exists
          let user = await storage.getUser(profile.id);

          if (!user) {
            // Create new user if doesn't exist
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
      }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.discordId);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.get('/api/auth/discord',
    passport.authenticate('discord')
  );

  app.get('/api/auth/discord/callback',
    passport.authenticate('discord', {
      failureRedirect: '/'
    }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/');
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