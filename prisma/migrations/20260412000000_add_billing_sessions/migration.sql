-- CreateEnum
CREATE TYPE "BillingProvider" AS ENUM ('STRIPE', 'MTN_MOBILE_MONEY');

-- CreateEnum
CREATE TYPE "BillingSessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "BillingSession" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "provider" "BillingProvider" NOT NULL,
    "status" "BillingSessionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BillingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingSession_reference_key" ON "BillingSession"("reference");

-- AddForeignKey
ALTER TABLE "BillingSession" ADD CONSTRAINT "BillingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
