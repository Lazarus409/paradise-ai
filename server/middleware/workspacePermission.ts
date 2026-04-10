import { db } from "../db";

export async function workspacePermission(req: any, res: any, next: any) {
  const workspaceId = req.params.workspaceId || req.body.workspaceId;
  const userId = req.user.id;

  if (!workspaceId) {
    return res.status(400).json({ error: "Workspace required" });
  }

  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: { userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    return res.status(403).json({
      error: "Access denied to workspace",
    });
  }

  next();
}
