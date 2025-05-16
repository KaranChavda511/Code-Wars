import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast'; // updated import
import './Layout.css';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Navbar user={user} />
      <main className="main-content">
        <Outlet />
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default Layout;
