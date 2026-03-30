const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Auth routes (public)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Profile & StudentDetail (protected)
router.get('/profile', protect, getProfile);   // dùng cho StudentDetailPage.jsx

module.exports = router;