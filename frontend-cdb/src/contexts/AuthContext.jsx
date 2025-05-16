
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Create Context with undefined default
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await API.get('/users/me');
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function for error in dev mode
const throwIfNoProvider = () => {
  if (import.meta.env.DEV) {
    console.error('[AuthContext] No AuthProvider found around component tree.');
  }
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
