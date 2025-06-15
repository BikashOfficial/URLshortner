import shorturl from "../models/shortUrl.model.js";
import { nanoid } from 'nanoid';

export const createShortUrl = async (req, res) => {
  try {
    const { url, customSlug } = req.body;
    
    // Basic validation
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Handle custom slug
    if (customSlug) {
      // Only authenticated users can create custom slugs
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'You must be logged in to use custom URLs'
        });
      }

      // Validate custom slug format
      if (!/^[a-zA-Z0-9-_]+$/.test(customSlug)) {
        return res.status(400).json({
          success: false,
          message: 'Custom URL can only contain letters, numbers, hyphens, and underscores'
        });
      }

      // Check if slug is already taken
      const existingUrl = await shorturl.findOne({ short_url: customSlug });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: 'This custom URL is already taken. Please try another one.'
        });
      }
    }

    const shortUrl = customSlug || nanoid(7);
    const newUrl = new shorturl({
      full_url: url,
      short_url: shortUrl,
      user: req.user ? req.user._id : null
    });    await newUrl.save();

    // If user is authenticated, add URL to their urls array
    if (req.user) {
      await req.user.updateOne({ $push: { urls: newUrl._id } });
    }

    const fullShortUrl = `${process.env.APP_URL}${newUrl.short_url}`;
    
    if (req.user) {
      // Return full object for authenticated users
      res.json({
        success: true,
        url: {
          _id: newUrl._id,
          full_url: newUrl.full_url,
          short_url: newUrl.short_url,
          clicks: newUrl.clicks,
          createdAt: newUrl.createdAt
        }
      });
    } else {
      // Return simple response for non-authenticated users
      res.json({
        success: true,
        shortUrl: fullShortUrl
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const redirectToUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await shorturl.findOneAndUpdate(
      { short_url: id },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    res.redirect(url.full_url);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserUrls = async (req, res) => {
  try {
    const urls = await shorturl.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('full_url short_url clicks createdAt');

    res.json({
      success: true,
      urls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await shorturl.findOne({ short_url: shortUrl });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Check if the URL belongs to the authenticated user
    if (req.user && url.user && url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these stats'
      });
    }

    res.json({
      success: true,
      stats: {
        clicks: url.clicks,
        created: url.createdAt,
        fullUrl: url.full_url,
        shortUrl: url.short_url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
