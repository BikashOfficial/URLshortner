import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const UrlAuthContext = createContext(null);

export const useUrlAuth = () => useContext(UrlAuthContext);

export const UrlAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return false;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      } else {
        setUser(null);
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('token');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Login successful!');
        
        // Handle redirect after login
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('returnTo');
        navigate(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, userData);
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UrlAuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      checkAuthStatus 
    }}>
      {children}
    </UrlAuthContext.Provider>
  );
};
