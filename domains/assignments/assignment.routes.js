import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { getAllAssignmentsController,getAssignmentByIdController,getCandidateAssignmentForOwnController } from './assignment.controller.js';
import { authorize } from '../../middleware/authorize.js';


const router = express.Router();

// id ile olanı en alta koy çünkü üsttekinin paramtetresi alt endpointe geçiyor parametre istiyor istekte

router.get('/all', authenticate, authorize("ADMIN","HR"), getAllAssignmentsController);
router.get("/test",authenticate, authorize("CANDIDATE"), getCandidateAssignmentForOwnController);
router.get('/:id', authenticate, authorize("ADMIN","HR"), getAssignmentByIdController);





export default router;