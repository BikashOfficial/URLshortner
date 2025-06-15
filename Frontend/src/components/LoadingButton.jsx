import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const LoadingButton = ({ loading, children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    {...props}
  >
    {loading ? (
      <>
        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
        Loading...
      </>
    ) : (
      children
    )}
  </motion.button>
);
