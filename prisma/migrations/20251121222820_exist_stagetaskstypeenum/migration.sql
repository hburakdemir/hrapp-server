/*
  Warnings:

  - You are about to drop the column `caseContent` on the `stage_tasks` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `stage_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stage_tasks" DROP COLUMN "caseContent",
DROP COLUMN "scheduledDate";
