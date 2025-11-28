import express from "express";
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { deleteStageController, getAllStagesController,getStageByIdController, updateStageController } from "./stage.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize("ADMIN", "HR"), getAllStagesController);
router.get("/:stageId", authenticate, authorize("ADMIN", "HR"), getStageByIdController);
router.put("/:stageId", authenticate, authorize("ADMIN", "HR"), updateStageController);
router.delete("/:stageId", authenticate, authorize("ADMIN", "HR"), deleteStageController);
export default router;
