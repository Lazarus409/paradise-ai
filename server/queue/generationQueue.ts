import { Queue } from "bullmq";

export const generationQueue = new Queue("ai-generation", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
