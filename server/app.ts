import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/authRoutes.ts";
import presentationRoutes from "./routes/presentationRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import usageRoutes from "./routes/usageRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import healthRoutes from "./routes/healthRoutes";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./utils/swagger";
import path from "path";
import { fileURLToPath } from "url";

export function createApp(options: { serveStatic?: boolean } = {}) {
  const { serveStatic = true } = options;
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(morgan("dev"));
  app.use("/api", apiLimiter);

  app.use("/api/auth", authRoutes);
  app.use("/api/presentations", presentationRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/invites", inviteRoutes);
  app.use("/api/usage", usageRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  if (serveStatic) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const staticPath =
      process.env.NODE_ENV === "production"
        ? path.resolve(__dirname, "public")
        : path.resolve(__dirname, "..", "dist", "public");

    app.use(express.static(staticPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
