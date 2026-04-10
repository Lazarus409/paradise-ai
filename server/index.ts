import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.ts";
import presentationRoutes from "./routes/presentationRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import billingRoutes from "./routes/billingRoutes";
import usageRoutes from "./routes/usageRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import morgan from "morgan";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/healthRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(express.json());

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/presentations", presentationRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(morgan("dev")); // request logging
app.use("/api", apiLimiter); // rate limit API
app.use(errorHandler); // global error handler
app.use("/api/health", healthRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet()); // security headers

app.use("/api/auth", authRoutes);

/* ======================
   STATIC FRONTEND
====================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

app.use(express.static(staticPath));

/* ======================
   CLIENT ROUTING
====================== */

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

/* ======================
   SERVER START
====================== */

const port = 3000;

createServer(app).listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
