import express from "express";
import crypto from "crypto";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/* =========================
   CREATE INVITE
========================= */
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { email, workspaceId } = req.body;

    const token = crypto.randomUUID();

    const invite = await db.invite.create({
      data: {
        email,
        token,
        workspaceId,
      },
    });

    res.json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invite" });
  }
});

/* =========================
   ACCEPT INVITE
========================= */

router.post("/accept", authMiddleware, async (req: any, res) => {
  try {
    const { token } = req.body;

    const invite = await db.invite.findUnique({
      where: { token },
    });

    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    await db.teamMember.create({
      data: {
        userId: req.user.id,
        workspaceId: invite.workspaceId,
        role: "EDITOR",
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invite accept failed" });
  }
});

export default router;
