interface UsageRecord {
  userId: string;
  count: number;
}

const usageMap = new Map<string, number>();

export function getUsage(userId: string) {
  return usageMap.get(userId) || 0;
}

export function incrementUsage(userId: string) {
  const current = getUsage(userId);
  usageMap.set(userId, current + 1);
}
