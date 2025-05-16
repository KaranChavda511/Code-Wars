import React,{ useEffect, useState } from 'react';
import API from '../../services/api.js';
import  useSocket  from '../../hooks/useSocket.js';
import { toast } from 'react-hot-toast';
import './LiveLeaderboard.css';

const LiveLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get('/leaderboard');
        setLeaderboard(data);
      } catch (error) {
        toast.error('Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();

    if (socket) {
      socket.on('leaderboardUpdate', (updatedLeaderboard) => {
        setLeaderboard(updatedLeaderboard);
      });
    }

    return () => {
      if (socket) socket.off('leaderboardUpdate');
    };
  }, [socket]);

  return (
    <div className="leaderboard">
      <h2>Live Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Solved</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.score}</td>
              <td>{user.solvedChallenges?.length || 0}</td>
              <td>{user.accuracy || 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveLeaderboard;