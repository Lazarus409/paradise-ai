import express from "express";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req: any, res) => {
  const userId = req.user.id;

  const presentations = await db.presentation.count({
    where: { userId },
  });

  const workspaces = await db.workspace.count({
    where: { ownerId: userId },
  });

  const usage = await db.usageLog.findMany({
    where: { userId },
  });

  res.json({
    presentations,
    workspaces,
    usage,
  });
});

export default router;
