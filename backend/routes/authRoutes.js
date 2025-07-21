const express = require('express');
const { signup, login, verifyEmail, resetPassword, getMe, changePassword } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getMe);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router; 