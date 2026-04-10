import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: 6379,
});

redis.on("error", err => {
  console.error("Redis error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});
