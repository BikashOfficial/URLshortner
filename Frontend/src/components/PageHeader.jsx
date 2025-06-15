import { motion } from 'framer-motion';

export const PageHeader = ({ title, subtitle }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
      <span className="text-indigo-600">{title.split(' ')[0]}</span> {title.split(' ').slice(1).join(' ')}
    </h1>
    <p className="text-lg text-gray-600">{subtitle}</p>
  </motion.div>
);
