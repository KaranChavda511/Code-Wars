import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import './PrivateRoute.css';

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner size="medium" />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;
