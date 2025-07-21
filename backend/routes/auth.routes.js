const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.get('/me', auth, authController.getMe);
router.post('/change-password', auth, authController.changePassword);
router.put('/update-profile', auth, authController.updateProfile);

module.exports = router; 