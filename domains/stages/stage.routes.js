import express from "express";
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { getAllStagesController,getStageByIdController, } from "./stage.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize("ADMIN", "HR"), getAllStagesController);
router.get("/:stageId",authenticate,authorize("ADMIN", "HR", "CANDIDATE"),getStageByIdController);
export default router;
