import express from "express";
import { stripe } from "../utils/stripe";
import { db } from "../db";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;

      const userId = session.metadata.userId;

      await db.subscription.upsert({
        where: { userId },
        update: {
          status: "ACTIVE",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        },
        create: {
          userId,
          plan: "PRO",
          status: "ACTIVE",
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        },
      });
    }

    res.json({ received: true });
  }
);

export default router;
