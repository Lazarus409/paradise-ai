import { db } from "../db";

export function requireRole(roles: string[]) {
  return async (req: any, res: any, next: any) => {
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId;

    const member = await db.teamMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!member || !roles.includes(member.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    next();
  };
}
