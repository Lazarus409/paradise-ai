import { Worker } from "bullmq";
import { db } from "server/db";

new Worker(
  "ai-generation",
  async job => {
    const { prompt, userId, workspaceId } = job.data;

    const presentation = await db.presentation.create({
      data: {
        title: prompt,
        userId,
        workspaceId,
      },
    });

    return presentation;
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
