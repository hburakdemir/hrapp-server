/*
  Warnings:

  - You are about to drop the `candidate_stage_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_stage_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_stage_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `candidate_stages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StageTaskStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- DropForeignKey
ALTER TABLE "public"."candidate_stage_attachments" DROP CONSTRAINT "candidate_stage_attachments_candidateStageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stage_responses" DROP CONSTRAINT "candidate_stage_responses_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stage_tasks" DROP CONSTRAINT "candidate_stage_tasks_candidateStageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stages" DROP CONSTRAINT "candidate_stages_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."candidate_stages" DROP CONSTRAINT "candidate_stages_workflowId_fkey";

-- DropTable
DROP TABLE "public"."candidate_stage_attachments";

-- DropTable
DROP TABLE "public"."candidate_stage_responses";

-- DropTable
DROP TABLE "public"."candidate_stage_tasks";

-- DropTable
DROP TABLE "public"."candidate_stages";

-- DropEnum
DROP TYPE "public"."AttachmentType";

-- DropEnum
DROP TYPE "public"."StageStatus";

-- CreateTable
CREATE TABLE "StageTask" (
    "id" SERIAL NOT NULL,
    "stageId" INTEGER NOT NULL,
    "type" "StageTaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "caseContent" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" "StageTaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageTaskResponse" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "responderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "fileUrl" TEXT,
    "selectedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageTaskResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StageTask" ADD CONSTRAINT "StageTask_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageTaskResponse" ADD CONSTRAINT "StageTaskResponse_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "StageTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
