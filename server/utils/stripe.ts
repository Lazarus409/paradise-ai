import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function createCheckoutSession(userId: string) {
  const priceId = process.env.STRIPE_PRICE_ID;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is required for Stripe checkout");
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${frontendUrl}/dashboard?billing=success`,
    cancel_url: `${frontendUrl}/dashboard?billing=cancelled`,
    metadata: { userId, provider: "stripe" },
  });
}
