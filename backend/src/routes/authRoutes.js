import express from 'express';
import {
  registerUser,
  loginUser,
  getMyProfile,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getMyProfile);

export default router;