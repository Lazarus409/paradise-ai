import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function createCheckoutSession(userId: string) {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/dashboard`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
    metadata: { userId },
  });
}

export { stripe };
