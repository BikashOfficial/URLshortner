import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protectRoute, getProfile);

export default router;
