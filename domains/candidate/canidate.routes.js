import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { createCandidateController, updateCandidateController } from './candidate.controller.js';

const router = express.Router();

router.post('/', authenticate, createCandidateController);
router.put('/update',authenticate,updateCandidateController);

export default router;
