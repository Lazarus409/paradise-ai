import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getUsage } from "../services/usageService";

const router = express.Router();

router.get(
  "/:workspaceId/presentations",
  authMiddleware,
  async (req: any, res) => {
    const usage = await getUsage(req.user.id);
    res.json({ usage });
  }
);

export default router;
