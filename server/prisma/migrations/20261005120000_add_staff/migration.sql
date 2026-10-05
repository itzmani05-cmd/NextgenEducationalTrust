-- CreateEnum
CREATE TYPE "StaffWorkLogStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "hourlyRate" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "sessionVersion" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMP(3),
    "createdByEmail" TEXT,
    "dob" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "qualification" TEXT,
    "degree" TEXT,
    "institution" TEXT,
    "passingYear" INTEGER,
    "experienceYears" INTEGER,
    "subjects" TEXT,
    "bankAccountName" TEXT,
    "bankAccountNumber" TEXT,
    "bankIfsc" TEXT,
    "bankName" TEXT,
    "pan" TEXT,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_documents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staffId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "staff_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_work_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "minutes" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StaffWorkLogStatus" NOT NULL DEFAULT 'pending',
    "hourlyRate" INTEGER,
    "amount" INTEGER,
    "reviewedByEmail" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "payoutId" TEXT,

    CONSTRAINT "staff_work_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_payouts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staffId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "paidOn" DATE NOT NULL,
    "paymentMode" "ExpensePaymentMode" NOT NULL,
    "referenceNo" TEXT,
    "expenseId" TEXT,
    "createdByEmail" TEXT,

    CONSTRAINT "staff_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_staffCode_key" ON "staff"("staffCode");

-- CreateIndex
CREATE INDEX "staff_documents_staffId_idx" ON "staff_documents"("staffId");

-- CreateIndex
CREATE INDEX "staff_work_logs_staffId_date_idx" ON "staff_work_logs"("staffId", "date");

-- CreateIndex
CREATE INDEX "staff_work_logs_status_idx" ON "staff_work_logs"("status");

-- CreateIndex
CREATE INDEX "staff_payouts_staffId_idx" ON "staff_payouts"("staffId");

-- AddForeignKey
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_work_logs" ADD CONSTRAINT "staff_work_logs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_work_logs" ADD CONSTRAINT "staff_work_logs_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "staff_payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_payouts" ADD CONSTRAINT "staff_payouts_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

