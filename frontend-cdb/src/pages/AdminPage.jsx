import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import AdminDashboard from '../components/Admin/Dashboard.jsx';
import UserManager from '../components/Admin/UserManager.jsx';
import './AdminPage.css';

const AdminPage = () => {
  useDocumentTitle('Admin - CDB');
  const { user } = useAuth();

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="admin-page">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManager />} />
      </Routes>
    </div>
  );
};

export default AdminPage;