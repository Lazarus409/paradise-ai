import crypto from "crypto";
import { db } from "../db";

export async function createInvite(email: string, workspaceId: string) {
  const token = crypto.randomUUID();

  const invite = await db.invite.create({
    data: {
      email,
      token,
      workspaceId,
    },
  });

  return invite;
}
