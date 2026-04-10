import express from "express";
import crypto from "crypto";

import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { quotaMiddleware, incrementUsage } from "../middleware/quotaMiddleware";

const router = express.Router();

/* =========================
   SHARE PRESENTATION
========================= */

router.post(
  "/generate",
  authMiddleware,
  quotaMiddleware,
  async (req: any, res) => {
    const { prompt, workspaceId } = req.body;

    const presentation = await db.presentation.create({
      data: {
        title: prompt,
        userId: req.user.id,
        workspaceId,
      },
    });

    await incrementUsage(req.user.id);

    res.json(presentation);
  }
);
router.post("/:id/share", authMiddleware, async (req: any, res) => {
  try {
    const presentationId = req.params.id;

    const token = crypto.randomUUID();

    const presentation = await db.presentation.update({
      where: { id: presentationId },
      data: {
        isPublic: true,
        shareToken: token,
      },
    });

    res.json({
      shareUrl: `/share/${token}`,
      presentation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create share link",
    });
  }
});

export default router;
