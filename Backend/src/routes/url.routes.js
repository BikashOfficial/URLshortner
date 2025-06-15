import express from "express";
import jwt from 'jsonwebtoken';
import { createShortUrl, redirectToUrl, getUserUrls, getUrlStats } from "../controllers/url.controller.js";
import { protectRoute } from "../middleware/auth.js";
import User from '../models/user.model.js';

const router = express.Router();

// Mixed access route - works with or without auth
// If auth token is present, it will be processed, if not, it will work without user association
router.post("/api/create", async (req, res, next) => {
  try {
    // Try to authenticate but don't require it
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, but we'll still allow the request without user association
        console.log('Non-critical auth error:', error.message);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}, createShortUrl);
router.get("/:id", redirectToUrl);

// Protected routes
router.get("/api/urls/user", protectRoute, getUserUrls);
router.get("/api/urls/stats/:shortUrl", protectRoute, getUrlStats);

export default router;
