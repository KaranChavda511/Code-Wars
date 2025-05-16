import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

const ProfileView = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="profile-view">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <div className="info-item">
          <span className="label">Username:</span>
          <span className="value">{user.username}</span>
        </div>
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="info-item">
          <span className="label">Score:</span>
          <span className="value">{user.score}</span>
        </div>
        <div className="info-item">
          <span className="label">Rank:</span>
          <span className="value">{user.rank || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="label">Challenges Solved:</span>
          <span className="value">{user.solvedChallenges?.length || 0}</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/profile/edit" className="edit-btn">
          Edit Profile
        </Link>
      </div>

      {user.badges?.length > 0 && (
        <div className="badges-section">
          <h3>Your Badges</h3>
          <div className="badges-grid">
            {user.badges.map((badge, index) => (
              <div key={index} className="badge">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;