/*
  Warnings:

  - You are about to drop the column `taskTemplateId` on the `candidate_stage_tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."candidate_stage_tasks" DROP CONSTRAINT "candidate_stage_tasks_taskTemplateId_fkey";

-- AlterTable
ALTER TABLE "candidate_stage_tasks" DROP COLUMN "taskTemplateId",
ADD COLUMN     "stageTasksId" INTEGER;

-- AddForeignKey
ALTER TABLE "candidate_stage_tasks" ADD CONSTRAINT "candidate_stage_tasks_stageTasksId_fkey" FOREIGN KEY ("stageTasksId") REFERENCES "stage_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
