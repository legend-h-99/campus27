-- AlterTable audit_logs
-- Make userId optional (for unauthenticated failed attempts)
ALTER TABLE "audit_logs" ALTER COLUMN "user_id" DROP NOT NULL;

-- Make entityId optional
ALTER TABLE "audit_logs" ALTER COLUMN "entity_id" DROP NOT NULL;

-- Add new columns
ALTER TABLE "audit_logs" ADD COLUMN     "user_role" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "audit_logs" ADD COLUMN     "description" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN     "metadata" JSONB;

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "audit_logs"("success");
CREATE INDEX "audit_logs_user_role_idx" ON "audit_logs"("user_role");
