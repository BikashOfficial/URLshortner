import { motion } from 'framer-motion';
import { ClipboardIcon } from '@heroicons/react/24/outline';

const UrlsTable = ({ urls, onCopy, fetchingUrls }) => {
  if (fetchingUrls) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm"
      >
        <div className="max-w-sm mx-auto">
          <p className="text-gray-500 mb-4">No URLs created yet. Create your first shortened URL above!</p>
          <div className="w-24 h-1 bg-indigo-100 mx-auto rounded-full"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[768px]">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 px-6 py-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...urls].reverse().map((url) => (
              <motion.div
                key={url._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 items-center"
              >
                <div className="truncate text-sm text-gray-900">{url.full_url}</div>
                <div>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${url.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm hover:underline truncate block"
                  >                            {`${new URL(import.meta.env.VITE_BACKEND_URL).host}/${url.short_url}`}
                  </a>
                </div>
                <div className="text-sm whitespace-nowrap">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full inline-block">
                    {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
                  </span>
                </div>
                <div className="whitespace-nowrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCopy(url)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none shadow-sm"
                  >
                    <ClipboardIcon className="h-4 w-4 mr-1" />
                    Copy URL
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlsTable;
