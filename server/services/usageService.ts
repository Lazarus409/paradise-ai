import { db } from "../db";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function getUsage(userId: string) {
  const month = currentMonth();

  const usage = await db.usageLog.findUnique({
    where: {
      userId_month: {
        userId,
        month,
      },
    },
  });

  return usage?.count || 0;
}

export async function incrementUsage(userId: string) {
  const month = currentMonth();

  const usage = await db.usageLog.upsert({
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

  return usage.count;
}
