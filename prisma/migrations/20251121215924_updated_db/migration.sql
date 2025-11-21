/*
  Warnings:

  - You are about to drop the `StageTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StageTaskResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- DropForeignKey
ALTER TABLE "public"."StageTask" DROP CONSTRAINT "StageTask_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StageTaskResponse" DROP CONSTRAINT "StageTaskResponse_taskId_fkey";

-- DropTable
DROP TABLE "public"."StageTask";

-- DropTable
DROP TABLE "public"."StageTaskResponse";

-- CreateTable
CREATE TABLE "stage_tasks" (
    "id" SERIAL NOT NULL,
    "stageId" INTEGER NOT NULL,
    "type" "StageTaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "caseContent" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stage_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_stages" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "candidateWorkflowId" INTEGER,
    "workflowId" INTEGER NOT NULL,
    "stageName" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_stage_tasks" (
    "id" SERIAL NOT NULL,
    "candidateStageId" INTEGER NOT NULL,
    "taskTemplateId" INTEGER NOT NULL,
    "status" "StageTaskStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
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
    "selectedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_stage_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stage_tasks" ADD CONSTRAINT "stage_tasks_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_candidateWorkflowId_fkey" FOREIGN KEY ("candidateWorkflowId") REFERENCES "candidate_workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_tasks" ADD CONSTRAINT "candidate_stage_tasks_candidateStageId_fkey" FOREIGN KEY ("candidateStageId") REFERENCES "candidate_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_tasks" ADD CONSTRAINT "candidate_stage_tasks_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "stage_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_responses" ADD CONSTRAINT "candidate_stage_responses_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "candidate_stage_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
