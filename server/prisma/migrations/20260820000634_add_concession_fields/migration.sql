-- AlterTable: discount/concession decision fields.
-- calculatedConcession is the system's auto-computed provisional figure;
-- concessionCategory / finalApprovedConcession / concessionNote / concessionDecidedAt
-- record the Trust's final decision, kept separate per the two-stage workflow.
ALTER TABLE "applications" ADD COLUMN     "calculatedConcession" INTEGER,
ADD COLUMN     "concessionCategory" TEXT,
ADD COLUMN     "finalApprovedConcession" INTEGER,
ADD COLUMN     "concessionNote" TEXT,
ADD COLUMN     "concessionDecidedAt" TIMESTAMP(3);
