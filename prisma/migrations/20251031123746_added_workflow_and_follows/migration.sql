/*
  Warnings:

  - Added the required column `assignedBy` to the `forms` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormStage" AS ENUM ('PRE_INTERVIEW', 'CASE', 'TECH_INTERVIEW', 'FINAL_INTERVIEW', 'COMPLETED');

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "workflowId" INTEGER;

-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "assignedBy" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stage" "FormStage" NOT NULL DEFAULT 'PRE_INTERVIEW',
ADD COLUMN     "templateId" INTEGER,
ADD COLUMN     "workflowId" INTEGER;

-- CreateTable
CREATE TABLE "workflows" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stages" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_templates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_templates" ADD CONSTRAINT "form_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
