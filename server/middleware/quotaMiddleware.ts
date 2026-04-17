import { db } from "../db";

export const quotaMiddleware = async (req: any, res: any, next: any) => {
  next();
};

export const incrementUsage = async (userId: string) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  await db.usageLog.upsert({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      userId,
      month,
      count: 1,
    },
  });
};
