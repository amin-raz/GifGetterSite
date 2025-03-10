import express from "express";
import cookieParser from "cookie-parser";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

(async () => {
  setupAuth(app);
  const server = await registerRoutes(app);

  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
    server.listen(5000, "0.0.0.0", () => {
      log("Server started in development mode on port 5000");
    });
  } else {
    try {
      serveStatic(app);
      server.listen(5000, "0.0.0.0", () => {
        log("Server started in production mode on port 5000");
      });
    } catch (error) {
      console.error("Failed to start server in production mode:", error);
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