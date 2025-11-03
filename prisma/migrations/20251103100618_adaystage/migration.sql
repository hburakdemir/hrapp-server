-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('NOTE', 'FILE', 'TEXT');

-- CreateTable
CREATE TABLE "candidate_stages" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "stageName" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_stage_attachments" (
    "id" SERIAL NOT NULL,
    "candidateStageId" INTEGER NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_stage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_stages_candidateId_workflowId_order_key" ON "candidate_stages"("candidateId", "workflowId", "order");

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stages" ADD CONSTRAINT "candidate_stages_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_stage_attachments" ADD CONSTRAINT "candidate_stage_attachments_candidateStageId_fkey" FOREIGN KEY ("candidateStageId") REFERENCES "candidate_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
