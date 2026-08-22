-- Extend the application status flow with the payment/certificate stages.
ALTER TYPE "ApplicationStatus" ADD VALUE 'payment_submitted';
ALTER TYPE "ApplicationStatus" ADD VALUE 'payment_approved';
ALTER TYPE "ApplicationStatus" ADD VALUE 'payment_rejected';
ALTER TYPE "ApplicationStatus" ADD VALUE 'certificate_issued';

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'submitted', 'approved', 'rejected');

-- AlterTable: course fee (Trust-confirmed alongside the concession decision)
-- and who approved the concession, for audit purposes.
ALTER TABLE "applications" ADD COLUMN     "courseFee" INTEGER,
ADD COLUMN     "concessionApprovedByEmail" TEXT;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amountDue" INTEGER,
    "amountPaid" INTEGER,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "paymentDate" TIMESTAMP(3),
    "paymentProofPath" TEXT,
    "submittedAt" TIMESTAMP(3),
    "verifiedByEmail" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "adminRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "certificateType" TEXT NOT NULL DEFAULT 'Scholarship Concession',
    "studentName" TEXT NOT NULL,
    "courseName" TEXT,
    "concessionPercentage" INTEGER NOT NULL,
    "certificatePath" TEXT,
    "issuedByEmail" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminEmail" TEXT,
    "applicationId" TEXT,
    "paymentId" TEXT,
    "action" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_applicationId_key" ON "payments"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_applicationId_key" ON "certificates"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
-- CASCADE (not RESTRICT) so the existing admin "Remove application" action
-- keeps working end-to-end once a payment/certificate row exists for it.
ALTER TABLE "payments" ADD CONSTRAINT "payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
