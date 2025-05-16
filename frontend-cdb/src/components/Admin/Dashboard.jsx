import React,{ useState, useEffect } from 'react';
import API from '../../services/api.js';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load admin stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats?.usersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Challenges</h3>
          <p>{stats?.challengesCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Submissions</h3>
          <p>{stats?.submissionsCount}</p>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Submissions</h3>
        <ul>
          {stats?.recentSubmissions.map((sub, index) => (
            <li key={index}>
              <span className="user">{sub.user.username}</span>
              <span className="action">submitted solution for</span>
              <span className="challenge">{sub.challenge.title}</span>
              <span className="time">
                {new Date(sub.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;