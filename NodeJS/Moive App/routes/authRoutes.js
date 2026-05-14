const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');
const { redirectIfAuthenticated, requireSession } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/upload');

router.get('/login', redirectIfAuthenticated, authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', redirectIfAuthenticated, authController.getSignup);
router.post('/signup', authController.postSignup);

router.post('/logout', authController.logout);

router.get('/settings', requireSession, settingsController.getSettings);
router.post('/settings/profile', requireSession, uploadAvatar.single('avatarFile'), settingsController.updateProfile);
router.post('/settings/password', requireSession, settingsController.changePassword);
router.post('/settings/delete', requireSession, settingsController.deleteAccount);

module.exports = router;