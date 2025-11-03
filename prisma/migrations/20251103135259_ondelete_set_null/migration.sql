-- DropForeignKey
ALTER TABLE "public"."candidate_stage_attachments" DROP CONSTRAINT "candidate_stage_attachments_candidateStageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stages" DROP CONSTRAINT "candidate_stages_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stages" DROP CONSTRAINT "candidate_stages_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidates" DROP CONSTRAINT "candidates_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."form_templates" DROP CONSTRAINT "form_templates_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workflows" DROP CONSTRAINT "workflows_createdBy_fkey";

-- AlterTable
ALTER TABLE "candidate_stage_attachments" ALTER COLUMN "candidateStageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "candidate_stages" ALTER COLUMN "candidateId" DROP NOT NULL,
ALTER COLUMN "workflowId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "candidateId" DROP NOT NULL,
ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_templates" ADD CONSTRAINT "form_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_attachments" ADD CONSTRAINT "candidate_stage_attachments_candidateStageId_fkey" FOREIGN KEY ("candidateStageId") REFERENCES "candidate_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
