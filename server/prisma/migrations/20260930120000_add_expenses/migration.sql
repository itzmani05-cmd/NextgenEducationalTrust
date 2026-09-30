-- CreateEnum
CREATE TYPE "ExpensePaymentMode" AS ENUM ('cash', 'upi', 'bank_transfer', 'cheque', 'card');

-- CreateTable
CREATE TABLE "expense_categories" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'other',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "paymentMode" "ExpensePaymentMode" NOT NULL,
    "paidTo" TEXT,
    "referenceNo" TEXT,
    "notes" TEXT,
    "billPath" TEXT,
    "billFileName" TEXT,
    "createdByEmail" TEXT,
    "updatedByEmail" TEXT,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_name_key" ON "expense_categories"("name");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- CreateIndex
CREATE INDEX "expenses_categoryId_idx" ON "expenses"("categoryId");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed the default categories (admins can add more from the Expenses page).
INSERT INTO "expense_categories" ("id", "name", "icon", "sortOrder") VALUES
    (gen_random_uuid()::text, 'Scholarship Disbursement', 'scholarship', 10),
    (gen_random_uuid()::text, 'Books & Education Materials', 'education_materials', 20),
    (gen_random_uuid()::text, 'Events & Programs', 'events', 30),
    (gen_random_uuid()::text, 'Salaries & Honorarium', 'salaries', 40),
    (gen_random_uuid()::text, 'Rent & Utilities', 'rent_utilities', 50),
    (gen_random_uuid()::text, 'Office Supplies', 'office_supplies', 60),
    (gen_random_uuid()::text, 'Travel & Transport', 'travel', 70),
    (gen_random_uuid()::text, 'Repairs & Maintenance', 'maintenance', 80),
    (gen_random_uuid()::text, 'Outreach & Marketing', 'marketing', 90),
    (gen_random_uuid()::text, 'Other', 'other', 1000);
