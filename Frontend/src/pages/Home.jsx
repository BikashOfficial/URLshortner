import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { urlService } from '../api/urlService';
import { validateUrl } from '../utils/helpers';
import { PageHeader } from '../components/PageHeader';
import { UrlInput } from '../components/UrlInput';
import { LoadingButton } from '../components/LoadingButton';
import { ResultCard } from '../components/ResultCard';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }    try {
      setLoading(true);
      const response = await urlService.shortenUrl(url);
      if (response.success && response.shortUrl) {
        setShortUrl(response.shortUrl);
        toast.success('URL shortened successfully!');
      } else {
        toast.error('Error: Invalid response from server');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="URL Shortener"
          subtitle="Make your long URLs short and sweet"
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <UrlInput url={url} setUrl={setUrl} />
            
            <div className="flex justify-center">
              <LoadingButton type="submit" loading={loading}>
                Shorten URL
              </LoadingButton>
            </div>
          </form>

          {shortUrl && <ResultCard shortUrl={shortUrl} />}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
