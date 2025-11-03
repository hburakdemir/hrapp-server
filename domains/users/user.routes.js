import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { profileStatusController } from './user.controller.js';

const router = express.Router();

router.get("/profile-status", authenticate, profileStatusController);

export default router;
