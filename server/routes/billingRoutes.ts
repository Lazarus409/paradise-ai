import express from "express";
import crypto from "crypto";
import { stripe, createCheckoutSession } from "../utils/stripe";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { buildMomoCheckout } from "../utils/momo";

const router = express.Router();

const MONTHLY_PRO_PRICE = 25;

async function upsertBillingSession(data: {
  reference: string;
  provider: "STRIPE" | "MTN_MOBILE_MONEY";
  status: "PENDING" | "ACTIVE" | "FAILED" | "EXPIRED";
  amount?: number | null;
  currency?: string | null;
  payload?: unknown;
  userId: string;
}) {
  await db.$executeRaw`
    INSERT INTO "BillingSession" (
      "id",
      "reference",
      "provider",
      "status",
      "amount",
      "currency",
      "payload",
      "createdAt",
      "updatedAt",
      "userId"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${data.reference},
      ${data.provider},
      ${data.status},
      ${data.amount ?? null},
      ${data.currency ?? null},
      ${data.payload ? JSON.stringify(data.payload) : null}::jsonb,
      NOW(),
      NOW(),
      ${data.userId}
    )
    ON CONFLICT ("reference") DO UPDATE SET
      "provider" = EXCLUDED."provider",
      "status" = EXCLUDED."status",
      "amount" = EXCLUDED."amount",
      "currency" = EXCLUDED."currency",
      "payload" = EXCLUDED."payload",
      "updatedAt" = NOW(),
      "userId" = EXCLUDED."userId";
  `;
}

async function markBillingSessionActive(reference: string, userId: string) {
  const [session] = await db.$queryRaw<any[]>`
    UPDATE "BillingSession"
    SET "status" = 'ACTIVE',
        "updatedAt" = NOW()
    WHERE "reference" = ${reference}
      AND "userId" = ${userId}
    RETURNING "id", "reference", "provider", "status", "amount", "currency", "payload", "createdAt", "updatedAt", "userId";
  `;

  return session;
}

async function getBillingSessions(userId: string) {
  return db.$queryRaw<any[]>`
    SELECT "id", "reference", "provider", "status", "amount", "currency", "payload", "createdAt", "updatedAt", "userId"
    FROM "BillingSession"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT 3;
  `;
}

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

      await upsertBillingSession({
        reference: session.id,
        provider: "STRIPE",
        status: "ACTIVE",
        amount: session.amount_total || MONTHLY_PRO_PRICE * 100,
        currency: session.currency || "usd",
        userId,
      });
    }

    res.json({ received: true });
  }
);

router.get("/status", authMiddleware, async (req: any, res) => {
  const [subscription, billingSessions] = await Promise.all([
    db.subscription.findUnique({
      where: { userId: req.user.id },
    }),
    getBillingSessions(req.user.id),
  ]);

  res.json({
    subscription,
    billingSessions,
  });
});

router.post("/checkout", authMiddleware, async (req: any, res) => {
  try {
    const { provider = "stripe", phoneNumber } = req.body || {};
    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (provider === "mtn_momo") {
      const checkout = buildMomoCheckout({
        userId: user.id,
        email: user.email,
        amount: MONTHLY_PRO_PRICE,
        currency: "GHS",
        phoneNumber,
      });

      await upsertBillingSession({
        reference: checkout.reference,
        provider: "MTN_MOBILE_MONEY",
        status: "PENDING",
        amount: checkout.amount * 100,
        currency: checkout.currency,
        payload: checkout,
        userId: user.id,
      });

      return res.json(checkout);
    }

    const session = await createCheckoutSession(user.id);

    await upsertBillingSession({
      reference: session.id,
      provider: "STRIPE",
      status: "PENDING",
      amount: session.amount_total || MONTHLY_PRO_PRICE * 100,
      currency: session.currency || "usd",
      userId: user.id,
    });

    res.json({
      provider: "stripe",
      url: session.url,
      reference: session.id,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Unable to create checkout session",
    });
  }
});

router.post("/mtn-momo/confirm", authMiddleware, async (req: any, res) => {
  const { reference } = req.body || {};

  if (!reference) {
    return res.status(400).json({ error: "Reference is required" });
  }

  const [session] = await db.$queryRaw<any[]>`
    SELECT "id", "reference", "provider", "status", "amount", "currency", "payload", "createdAt", "updatedAt", "userId"
    FROM "BillingSession"
    WHERE "reference" = ${reference}
      AND "userId" = ${req.user.id}
    LIMIT 1;
  `;

  if (!session) {
    return res.status(404).json({ error: "Payment reference not found" });
  }

  const updatedSession = await markBillingSessionActive(reference, req.user.id);

  const subscription = await db.subscription.upsert({
    where: { userId: req.user.id },
    update: { plan: "PRO", status: "ACTIVE" },
    create: {
      userId: req.user.id,
      plan: "PRO",
      status: "ACTIVE",
    },
  });

  res.json({
    session: updatedSession,
    subscription,
  });
});

export default router;
