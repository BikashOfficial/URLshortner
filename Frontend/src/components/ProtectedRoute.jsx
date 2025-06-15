import { Navigate, useLocation } from 'react-router-dom';
import { useUrlAuth } from '../context/UrlAuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading, checkAuthStatus } = useUrlAuth();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      checkAuthStatus();
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL to redirect back after login
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  return children;
};
