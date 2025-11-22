-- AlterTable
ALTER TABLE "stage_tasks" ADD COLUMN     "status" "StageTaskStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "stages" ADD COLUMN     "status" "StageStatus" NOT NULL DEFAULT 'PENDING';
