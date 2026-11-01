-- CreateTable
CREATE TABLE "student_attendance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "present" BOOLEAN NOT NULL,
    "markedById" TEXT,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_attendance_date_idx" ON "student_attendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "student_attendance_applicationId_date_key" ON "student_attendance"("applicationId", "date");

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
