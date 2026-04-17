import express from "express";
import crypto from "crypto";

import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { quotaMiddleware, incrementUsage } from "../middleware/quotaMiddleware";
import { buildPresentationDeck, ensureDeckShape } from "../utils/presentation";

const router = express.Router();

async function resolveWorkspace(userId: string, workspaceId?: string) {
  if (workspaceId) {
    return workspaceId;
  }

  const ownedWorkspace = await db.workspace.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
  });

  if (ownedWorkspace) {
    return ownedWorkspace.id;
  }

  const membership = await db.teamMember.findFirst({
    where: { userId },
    include: { workspace: true },
  });

  if (membership?.workspaceId) {
    return membership.workspaceId;
  }

  const workspace = await db.workspace.create({
    data: {
      name: "My Workspace",
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return workspace.id;
}

router.get("/", authMiddleware, async (req: any, res) => {
  const presentations = await db.presentation.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(
    presentations.map(presentation => ({
      ...presentation,
      content: ensureDeckShape(presentation.content, presentation.title) as any,
    }))
  );
});

router.get("/share/:token", async (req, res) => {
  const presentation = await db.presentation.findUnique({
    where: { shareToken: req.params.token },
  });

  if (!presentation || !presentation.isPublic) {
    return res.status(404).json({ error: "Shared presentation not found" });
  }

  return res.json({
    ...presentation,
    content: ensureDeckShape(presentation.content, presentation.title) as any,
  });
});

router.get("/:id", authMiddleware, async (req: any, res) => {
  const presentation = await db.presentation.findFirst({
    where: {
      id: req.params.id,
      OR: [{ userId: req.user.id }, { workspace: { ownerId: req.user.id } }],
    },
  });

  if (!presentation) {
    return res.status(404).json({ error: "Presentation not found" });
  }

  return res.json({
    ...presentation,
    content: ensureDeckShape(presentation.content, presentation.title) as any,
  });
});

router.post(
  "/generate",
  authMiddleware,
  quotaMiddleware,
  async (req: any, res) => {
    const { prompt, workspaceId } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const resolvedWorkspaceId = await resolveWorkspace(req.user.id, workspaceId);
    const deck = buildPresentationDeck(prompt);

    const presentation = await db.presentation.create({
      data: {
        title: deck.title,
        content: deck as any,
        userId: req.user.id,
        workspaceId: resolvedWorkspaceId,
      },
    });

    await incrementUsage(req.user.id);

    res.json({
      ...presentation,
      content: deck,
    });
  }
);

router.put("/:id", authMiddleware, async (req: any, res) => {
  const existing = await db.presentation.findFirst({
    where: {
      id: req.params.id,
      OR: [{ userId: req.user.id }, { workspace: { ownerId: req.user.id } }],
    },
  });

  if (!existing) {
    return res.status(404).json({ error: "Presentation not found" });
  }

  const nextTitle = req.body.title || existing.title;
  const nextContent = ensureDeckShape(
    req.body.content ?? existing.content,
    nextTitle
  );

  const presentation = await db.presentation.update({
    where: { id: existing.id },
    data: {
      title: nextTitle,
      content: nextContent as any,
      isPublic: Boolean(req.body.isPublic ?? existing.isPublic),
    },
  });

  res.json({
    ...presentation,
    content: nextContent as any,
  });
});

router.delete("/:id", authMiddleware, async (req: any, res) => {
  const existing = await db.presentation.findFirst({
    where: {
      id: req.params.id,
      OR: [{ userId: req.user.id }, { workspace: { ownerId: req.user.id } }],
    },
  });

  if (!existing) {
    return res.status(404).json({ error: "Presentation not found" });
  }

  await db.presentation.delete({
    where: { id: existing.id },
  });

  res.json({ success: true });
});

router.post("/:id/share", authMiddleware, async (req: any, res) => {
  try {
    const presentationId = req.params.id;

    const presentation = await db.presentation.findFirst({
      where: {
        id: presentationId,
        OR: [{ userId: req.user.id }, { workspace: { ownerId: req.user.id } }],
      },
    });

    if (!presentation) {
      return res.status(404).json({ error: "Presentation not found" });
    }

    const token = presentation.shareToken || crypto.randomUUID();

    const updated = await db.presentation.update({
      where: { id: presentationId },
      data: {
        isPublic: true,
        shareToken: token,
      },
    });

    res.json({
      shareUrl: `/share/${token}`,
      presentation: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create share link",
    });
  }
});

export default router;
