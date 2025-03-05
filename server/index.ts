import express from "express";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";

// Force development mode for local testing
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IIFE to allow async/await
(async () => {
  console.log('Starting server initialization...');
  console.log('Environment:', process.env.NODE_ENV);

  // Set up authentication first
  console.log('Setting up authentication...');
  setupAuth(app);

  // Register API routes before Vite middleware
  console.log('Setting up API routes...');
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  });

  if (process.env.NODE_ENV === "development") {
    // In development, set up Vite middleware AFTER auth and API routes
    console.log('Setting up Vite middleware for development...');
    await setupVite(app, server);
    server.listen(5000, "0.0.0.0", () => {
      log("Server started in development mode on port 5000");
    });
  } else {
    // In production, serve static files AFTER API routes
    console.log('Setting up static file serving for production...');
    try {
      serveStatic(app);
      server.listen(5000, "0.0.0.0", () => {
        log("Server started in production mode on port 5000");
      });
    } catch (error) {
      console.error("Failed to start server in production mode:", error);
      console.log("Falling back to development mode...");
      process.env.NODE_ENV = "development";
      await setupVite(app, server);
      server.listen(5000, "0.0.0.0", () => {
        log("Server started in development mode (fallback) on port 5000");
      });
    }
  }
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});