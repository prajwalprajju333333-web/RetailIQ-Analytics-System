import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const hasInitialized = useRef(false);

  // Only fetch profile once on mount if token exists
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile');
      setUser(res.data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    // Set token and user immediately - no extra API call needed
    localStorage.setItem('token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};