import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUrlAuth } from '../context/UrlAuthContext';

const Navbar = () => {
  const { user, logout } = useUrlAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              URL Shortener
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            {user ? (
              <>
                
                <button
                  onClick={logout}
                  className="text-white bg-red-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
