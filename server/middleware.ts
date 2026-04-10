import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth";
import { db } from "./db";

/* =========================
   AUTH MIDDLEWARE
========================= */

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}

/* =========================
   QUOTA ENFORCEMENT
========================= */

export async function enforceQuota(
  req: any,
  res: Response,
  next: NextFunction
) {
  const month = new Date().toISOString().slice(0, 7);

  const usage = await db.usageLog.findFirst({
    where: {
      userId: req.user.id,
      month,
    },
  });

  const FREE_LIMIT = 3;

  if (usage && usage.count >= FREE_LIMIT) {
    return res.status(403).json({
      detail: "Monthly quota reached. Upgrade required.",
    });
  }

  next();
}
