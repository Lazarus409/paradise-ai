import express from "express";
import { db } from "../db";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

export default router;
