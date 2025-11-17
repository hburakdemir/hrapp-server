-- AddForeignKey
ALTER TABLE "candidate_workflow" ADD CONSTRAINT "candidate_workflow_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
