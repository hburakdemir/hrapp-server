/*
  Warnings:

  - You are about to drop the column `type` on the `stage_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stage_tasks" DROP COLUMN "type";

-- DropEnum
DROP TYPE "public"."StageTaskType";
