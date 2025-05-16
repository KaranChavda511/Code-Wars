import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api.js';
import { toast } from 'react-hot-toast';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get(`/leaderboard/user/${userId}`);
        setStats(data);
      } catch (error) {
        toast.error('Failed to load user stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  if (isLoading) return <div>Loading stats...</div>;
  if (!stats) return <div>Stats not available</div>;

  return (
    <div className="user-stats">
      <h3>{stats.username}'s Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Rank</h4>
          <p>{stats.rank || 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h4>Score</h4>
          <p>{stats.score}</p>
        </div>
        <div className="stat-card">
          <h4>Challenges Solved</h4>
          <p>{stats.totalSolved}</p>
        </div>
        <div className="stat-card">
          <h4>Accuracy</h4>
          <p>{stats.accuracy}%</p>
        </div>
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <ul>
          {stats.recentActivity.map((activity, index) => (
            <li key={index}>
              <span className="challenge-name">{activity.challengeTitle}</span>
              <span className="status">
                {activity.solved ? '✓ Solved' : '❌ Failed'}
              </span>
              <span className="date">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserStats;