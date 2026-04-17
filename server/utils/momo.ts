import crypto from "crypto";

export interface MomoCheckoutInput {
  userId: string;
  email: string;
  amount: number;
  currency?: string;
  phoneNumber?: string;
}

export function createMomoReference(userId: string) {
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `MOMO-${userId.slice(0, 6).toUpperCase()}-${suffix}`;
}

export function buildMomoCheckout(input: MomoCheckoutInput) {
  const reference = createMomoReference(input.userId);

  return {
    provider: "MTN Mobile Money",
    providerKey: "mtn_momo",
    status: "PENDING",
    reference,
    amount: input.amount,
    currency: input.currency || "GHS",
    phoneNumber: input.phoneNumber || process.env.MTN_MOMO_COLLECTION_MSISDN || "",
    instructions: [
      "Approve the payment request on your MTN Mobile Money phone.",
      "Use the reference code when prompted.",
      "Once approved, your workspace access will activate automatically.",
    ],
    checkoutUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?provider=mtn_momo&reference=${reference}`,
  };
}
