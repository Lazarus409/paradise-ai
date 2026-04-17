import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUsage } from "../services/usageService";

const router = express.Router();

router.get("/", authMiddleware, async (req: any, res) => {
  const usage = await getUsage(req.user.id);

  res.json({ usage });
});

router.get("/:workspaceId/presentations", authMiddleware, async (req: any, res) => {
  const usage = await getUsage(req.user.id);

  res.json({ usage, workspaceId: req.params.workspaceId });
});

export default router;
