import { Navigate } from 'react-router-dom';
import { useUrlAuth } from '../context/UrlAuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUrlAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
