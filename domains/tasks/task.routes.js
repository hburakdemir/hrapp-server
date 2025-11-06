import express from 'express';
import {
  createTaskController,
  getTasksByStageController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController
} from './task.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from './task.validation.js';

const router = express.Router();

// Task oluşturma (sadece HR ve ADMIN)
router.post('/stages/:stageId/tasks', authenticate, authorize('ADMIN', 'HR'), validate(createTaskSchema), createTaskController);

// Stage'e ait task'ları listeleme
router.get('/stages/:stageId/tasks', authenticate, authorize('ADMIN', 'HR', 'CANDIDATE'), getTasksByStageController);

// Task detayı getirme
router.get('/tasks/:taskId', authenticate, authorize('ADMIN', 'HR', 'CANDIDATE'), getTaskByIdController);

// Task güncelleme (sadece HR ve ADMIN)
router.put('/tasks/:taskId', authenticate, authorize('ADMIN', 'HR'), validate(updateTaskSchema), updateTaskController);

// Task silme (sadece HR ve ADMIN)
router.delete('/tasks/:taskId', authenticate, authorize('ADMIN', 'HR'), deleteTaskController);

export default router;