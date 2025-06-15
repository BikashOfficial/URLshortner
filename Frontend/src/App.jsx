import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UrlAuthProvider } from './context/UrlAuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useUrlAuth } from './context/UrlAuthContext';

const AppRoutes = () => {
  const { user } = useUrlAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <UrlAuthProvider>
      <div className="min-h-screen bg-white">
        <Toaster position="top-center" />
        <Navbar />
        <AppRoutes />
      </div>
    </UrlAuthProvider>
  );
}

export default App;