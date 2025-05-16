import React,{ useEffect } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext.jsx';
import API from '../services/api.js';

// Extended auth hook with additional functionality
const useAuth = () => {
  const context = useAuthContext();
  
  // Auto-refresh token logic
  useEffect(() => {
    if (context.user) {
      const refreshInterval = setInterval(async () => {
        try {
          const { data } = await API.post('/users/refresh-token');
          context.login(data.token, data.user);
        } catch (error) {
          context.logout();
        }
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [context.user]);

  return {
    ...context,
    isAdmin: context.user?.role === 'admin'
  };
};

export default useAuth;