-- AlterTable: one application per Supabase Auth user (Google account).
-- Postgres allows multiple NULLs through a unique index, so pre-auth rows are unaffected.
CREATE UNIQUE INDEX "applications_authUserId_key" ON "applications"("authUserId");
