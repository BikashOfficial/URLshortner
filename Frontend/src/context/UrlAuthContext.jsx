import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const UrlAuthContext = createContext(null);

export const useUrlAuth = () => useContext(UrlAuthContext);

export const UrlAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Check auth status on mount and token change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      checkAuthStatus();
    } else if (!token) {
      setLoading(false);
    }
  }, [user]);
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Login successful!');
        navigate('/dashboard');
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
    <UrlAuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UrlAuthContext.Provider>
  );
};
