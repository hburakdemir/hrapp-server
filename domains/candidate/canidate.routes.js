import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { createCandidateController } from './candidate.controller.js';

const router = express.Router();

router.post('/', authenticate, createCandidateController);

export default router;
