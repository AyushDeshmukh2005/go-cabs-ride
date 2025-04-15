
const express = require('express');
const authController = require('../controllers/authController');
const { validate, authSchemas } = require('../middleware/validation');

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

module.exports = router;
