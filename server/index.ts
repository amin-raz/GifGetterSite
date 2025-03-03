import express from "express";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IIFE to allow async/await
(async () => {
  // Register API routes first
  const server = await registerRoutes(app);

  if (process.env.NODE_ENV === "development") {
    // In development, set up Vite middleware
    await setupVite(app, server);
    server.listen(5000, "0.0.0.0", () => {
      log("Server started in development mode on port 5000");
    });
  } else {
    // In production, serve static files
    serveStatic(app);
    app.listen(5000, "0.0.0.0", () => {
      log("Server started in production mode on port 5000");
    });
  }
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});