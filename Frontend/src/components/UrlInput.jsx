import { motion } from 'framer-motion';
import { LinkIcon } from '@heroicons/react/24/outline';

export const UrlInput = ({ url, setUrl, className = '' }) => (
  <div className={className}>
    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
      Enter your long URL
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <LinkIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="url"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="https://example.com/very/long/url"
      />
    </div>
  </div>
);
