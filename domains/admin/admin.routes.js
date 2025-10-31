import express from 'express';
import { createUserController, getAllUsersController, deleteUserController,updateUserController } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema } from './admin.validation.js';

const router = express.Router();




router.post('/users',authenticate,authorize('ADMIN'), validate(createUserSchema), createUserController);
router.get('/users',authenticate,authorize('ADMIN'), getAllUsersController);
router.delete('/users/:id',authenticate,authorize('ADMIN'),validate(createUserSchema),deleteUserController);
router.put('/users/:id',authenticate,authorize('ADMIN'), updateUserController);

export default router;