import { Navigate } from 'react-router-dom';
import { useUrlAuth } from '../context/UrlAuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUrlAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
