/*
  Warnings:

  - You are about to drop the column `workflowId` on the `candidates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."candidates" DROP CONSTRAINT "candidates_workflowId_fkey";

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "workflowId";

-- CreateTable
CREATE TABLE "CandidateWorkflow" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "assignedBy" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateWorkflow_candidateId_workflowId_key" ON "CandidateWorkflow"("candidateId", "workflowId");

-- AddForeignKey
ALTER TABLE "CandidateWorkflow" ADD CONSTRAINT "CandidateWorkflow_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateWorkflow" ADD CONSTRAINT "CandidateWorkflow_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
