import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logoDiv">
        <NavLink to="/" className="logo">CDB</NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/challenges" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Challenges</NavLink>
        <NavLink to="/multiplayer" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Multiplayer</NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Leaderboard</NavLink>
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="score">{user.score} pts</span>
            </div>
            <NavLink to="/profile" className="profile-link">Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className="admin-link">Admin</NavLink>}
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="login-btn">Login</NavLink>
            <NavLink to="/signup" className="signupBtn">SignUp</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
