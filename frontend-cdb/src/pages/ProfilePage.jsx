import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileView from '../components/Profile/ProfileView.jsx';
import ProfileForm from '../components/Profile/ProfileForm.jsx';
import './ProfilePage.css'

const ProfilePage = () => {
  useDocumentTitle('Profile - CDB');
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="profile-page">
      <Routes>
        <Route path="/" element={<ProfileView />} />
        <Route path="/edit" element={<ProfileForm />} />
      </Routes>
    </div>
  );
};

export default ProfilePage;