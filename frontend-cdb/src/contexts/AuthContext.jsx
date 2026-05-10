import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await API.get('/users/me');
        setUser(data);
      } catch (error) {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
