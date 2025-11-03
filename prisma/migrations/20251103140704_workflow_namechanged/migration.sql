/*
  Warnings:

  - You are about to drop the `CandidateWorkflow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CandidateWorkflow" DROP CONSTRAINT "CandidateWorkflow_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CandidateWorkflow" DROP CONSTRAINT "CandidateWorkflow_workflowId_fkey";

-- DropTable
DROP TABLE "public"."CandidateWorkflow";

-- CreateTable
CREATE TABLE "candidate_workflow" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "assignedBy" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_workflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_workflow_candidateId_workflowId_key" ON "candidate_workflow"("candidateId", "workflowId");

-- AddForeignKey
ALTER TABLE "candidate_workflow" ADD CONSTRAINT "candidate_workflow_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_workflow" ADD CONSTRAINT "candidate_workflow_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
