import express from 'express';
import {registerController,loginController,refreshTokenController,logoutController } from "./auth.controller.js";
import { registerSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh', refreshTokenController);
router.post('/logout', logoutController); 

export default router;