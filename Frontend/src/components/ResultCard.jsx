import { motion } from 'framer-motion';
import { copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';

export const ResultCard = ({ shortUrl }) => {
  const handleCopy = async () => {
    const copied = await copyToClipboard(shortUrl);
    if (copied) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-8 p-6 bg-gray-50 rounded-lg"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-3">Your shortened URL</h3>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          readOnly
          value={shortUrl}
          className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Copy
        </motion.button>
      </div>
    </motion.div>
  );
};
