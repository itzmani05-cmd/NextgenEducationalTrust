-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "receiptNumber" TEXT,
ADD COLUMN     "receiptPath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_receiptNumber_key" ON "payments"("receiptNumber");
