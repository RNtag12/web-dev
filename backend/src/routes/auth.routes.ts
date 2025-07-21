const express = require('express');
const { signup, login, verifyEmail, resetPassword } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router; 