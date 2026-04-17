import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PRICE_ID: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  MTN_MOMO_COLLECTION_MSISDN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
