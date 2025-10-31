import express from 'express';
import {
  createWorkflowController,
  getAllWorkflowController,
  getWorkflowByIdController,
  updateWorkflowController,
  deleteWorkflowController,
} from './workflow.controller.js';

import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createWorkflowSchema, updateWorkflowSchema } from './workflow.validation.js';

const router = express.Router();


router.post('/add',authenticate,authorize('ADMIN', 'HR'),validate(createWorkflowSchema),createWorkflowController);

//  Tüm workflow’ları listele (sadece ADMIN veya HR)
router.get('/get',authenticate,authorize('ADMIN', 'HR'),getAllWorkflowController);

//  Belirli workflow getir (sadece ADMIN veya HR)
router.get('/get/:id',authenticate,authorize('ADMIN', 'HR'),getWorkflowByIdController
);

// Workflow güncelle (sadece ADMIN veya HR)
router.put('/update/:id',authenticate,authorize('ADMIN', 'HR'),validate(updateWorkflowSchema),updateWorkflowController);

//  Workflow sil (sadece ADMIN veya HR)
router.delete('/delete/:id',authenticate,authorize('ADMIN', 'HR'),deleteWorkflowController);

export default router;
