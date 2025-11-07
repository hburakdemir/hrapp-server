/*
  Warnings:

  - You are about to drop the column `stages` on the `workflows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workflows" DROP COLUMN "stages";

-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
