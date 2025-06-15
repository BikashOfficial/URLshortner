import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const urlService = {
  // For both authenticated and unauthenticated users
  shortenUrl: async (url, customSlug) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/create`,
        { 
          url: url.startsWith('http') ? url : `https://${url}`,
          customSlug 
        },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to shorten URL');
    }
  },

  // For authenticated users only
  getUserUrls: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/urls/user`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch URLs');
    }
  },

  // Get URL statistics (clicks, etc.)
  getUrlStats: async (shortUrl) => {
    try {
      const response = await axios.get(`${API_URL}/api/urls/stats/${shortUrl}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch URL statistics');
    }
  }
};
