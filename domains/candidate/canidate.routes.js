import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { createCandidateController, getCandidatesController, updateCandidateController } from './candidate.controller.js';
import { authorize } from '../../middleware/authorize.js';

const router = express.Router();

router.get('/all',authenticate,authorize("ADMIN","HR"), getCandidatesController);
router.post('/', authenticate, createCandidateController);
router.put('/update',authenticate,updateCandidateController);

export default router;
