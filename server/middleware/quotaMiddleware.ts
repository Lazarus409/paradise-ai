import { db } from "../db";

export const quotaMiddleware = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const month = new Date().toISOString().slice(0, 7); // e.g. "2026-03"

    const usage = await db.usageLog.findUnique({
      where: {
        userId_month: {
          userId,
          month,
        },
      },
    });

    const quota = 3;

    if (usage && usage.count >= quota) {
      return res.status(403).json({
        error: "Monthly quota exceeded",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Quota check failed",
    });
  }
};

export const incrementUsage = async (userId: string) => {
  const month = new Date().toISOString().slice(0, 7);

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
