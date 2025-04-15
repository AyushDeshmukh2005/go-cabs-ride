
import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate, authSchemas } from '../middleware/validation.js';

const router = express.Router();

// Register a new user
router.post('/register', validate(authSchemas.register), authController.register);

// Login a user
router.post('/login', validate(authSchemas.login), authController.login);

// Verify token
router.get('/verify', authController.verifyToken);

// Reset password request
router.post('/reset-password-request', authController.resetPasswordRequest);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

export default router;
