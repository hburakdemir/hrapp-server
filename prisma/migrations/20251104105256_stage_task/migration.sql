/*
  Warnings:

  - The `status` column on the `candidate_stages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `form_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StageTaskType" AS ENUM ('FILE_UPLOAD', 'DATE_SELECTION', 'CASE_ASSIGNMENT', 'MESSAGE');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- DropForeignKey
ALTER TABLE "public"."form_templates" DROP CONSTRAINT "form_templates_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_templateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_workflowId_fkey";

-- AlterTable
ALTER TABLE "candidate_stages" DROP COLUMN "status",
ADD COLUMN     "status" "StageStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "public"."form_templates";

-- DropTable
DROP TABLE "public"."forms";

-- DropEnum
DROP TYPE "public"."FormStage";

-- DropEnum
DROP TYPE "public"."FormStatus";

-- CreateTable
CREATE TABLE "candidate_stage_tasks" (
    "id" SERIAL NOT NULL,
    "candidateStageId" INTEGER NOT NULL,
    "type" "StageTaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_stage_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_stage_responses" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "responderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_stage_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "candidate_stage_tasks" ADD CONSTRAINT "candidate_stage_tasks_candidateStageId_fkey" FOREIGN KEY ("candidateStageId") REFERENCES "candidate_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_responses" ADD CONSTRAINT "candidate_stage_responses_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "candidate_stage_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
