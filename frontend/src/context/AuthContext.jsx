import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

function formatApiError(detail, fallback) {
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(' ');
  }
  return fallback;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const token = localStorage.getItem('ideaforge_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Session validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('ideaforge_token', access_token);
      
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      throw formatApiError(error.response?.data?.detail, 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, skills = [], domain = '') => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password,
        skills,
        domain,
      });
      const { access_token } = response.data;
      localStorage.setItem('ideaforge_token', access_token);
      
      const userResponse = await api.get('/api/auth/me');
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      throw formatApiError(error.response?.data?.detail, 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ideaforge_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
