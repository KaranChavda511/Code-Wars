import React,{ useEffect, useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import LiveLeaderboard from '../components/Leaderboard/LiveLeaderboard.jsx';
import UserStats from '../components/Leaderboard/UserStats.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import API from '../services/api.js';
import { toast } from 'react-hot-toast';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  useDocumentTitle('Leaderboard - CDB');
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get('/leaderboard');
        setTopUsers(data);
      } catch (error) {
        toast.error('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      {isLoading ? (
        <div className="loading">Loading leaderboard...</div>
      ) : (
        <>
          <LiveLeaderboard users={topUsers} />
          {user && <UserStats userId={user._id} />}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;