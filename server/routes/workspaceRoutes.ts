import express from "express";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/share/:token", authMiddleware, async (req: any, res) => {
  const workspaces = await db.workspace.findMany({
    where: {
      OR: [
        { ownerId: req.user.id },
        {
          members: {
            some: { userId: req.user.id },
          },
        },
      ],
    },
  });

  res.json(workspaces);
});

export default router;
