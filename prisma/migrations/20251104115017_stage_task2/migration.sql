-- AlterEnum
ALTER TYPE "StageTaskType" ADD VALUE 'IMAGE_UPLOAD';

-- AlterTable
ALTER TABLE "candidate_stage_responses" ADD COLUMN     "selectedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "candidate_stage_tasks" ADD COLUMN     "caseContent" TEXT,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scheduledDate" TIMESTAMP(3);
