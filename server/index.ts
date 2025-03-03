import express from "express";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());

// Simplified server just for serving the frontend
(async () => {
  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  app.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();