-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "receiptNumber" TEXT,
ADD COLUMN     "receiptPath" TEXT,
ADD COLUMN     "receiptEmailSentAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "donations_receiptNumber_key" ON "donations"("receiptNumber");
