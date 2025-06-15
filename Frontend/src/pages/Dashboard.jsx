import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useUrlAuth } from '../context/UrlAuthContext';
import { PageHeader } from '../components/PageHeader';
import { UrlInput } from '../components/UrlInput';
import { LoadingButton } from '../components/LoadingButton';
import { copyToClipboard } from '../utils/helpers';
import UrlsTable from '../components/UrlsTable';

const Dashboard = () => {
  const { user } = useUrlAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [fetchingUrls, setFetchingUrls] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserUrls();
    }
  }, [user]);

  const fetchUserUrls = async () => {
    try {
      setFetchingUrls(true); const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/urls/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });      if (response.data.success) {
        setUrls(response.data.urls);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
    } finally {
      setFetchingUrls(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      toast.error('Please enter a valid URL including http:// or https://');
      return;
    }

    // Validate custom slug if provided
    if (showCustomInput && customSlug) {
      if (!/^[a-zA-Z0-9-_]+$/.test(customSlug)) {
        toast.error('Custom URL can only contain letters, numbers, hyphens, and underscores');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create`,
        {
          url: url.startsWith('http') ? url : `https://${url}`,
          customSlug: showCustomInput ? customSlug : undefined
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );      if (response.data.success) {
        setUrls(prevUrls => [response.data.url, ...prevUrls]);
        toast.success('URL shortened successfully!');
        setUrl('');
        setCustomSlug('');
        setShowCustomInput(false);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      const shortUrl = `${import.meta.env.VITE_BACKEND_URL}/${url.short_url}`;
      await copyToClipboard(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={`Welcome, ${user?.name || 'User'}`}
          subtitle="Manage your shortened URLs"
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <UrlInput url={url} setUrl={setUrl} />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="customSlug"
                checked={showCustomInput}
                onChange={(e) => setShowCustomInput(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="customSlug" className="ml-2 block text-sm text-gray-900">
                Use custom URL
              </label>
            </div>

            {showCustomInput && (
              <div>
                <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700">
                  Custom URL Slug
                </label>
                <input
                  type="text"
                  id="customSlug"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your-custom-url"
                />
              </div>
            )}

            <div className="flex justify-center">
              <LoadingButton type="submit" loading={loading}>
                Shorten URL
              </LoadingButton>
            </div>
          </form>
        </motion.div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your URLs</h2>
            <p className="text-sm text-gray-500">{urls.length} total</p>
          </div>
          <UrlsTable 
            urls={urls} 
            onCopy={handleCopy} 
            fetchingUrls={fetchingUrls} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
