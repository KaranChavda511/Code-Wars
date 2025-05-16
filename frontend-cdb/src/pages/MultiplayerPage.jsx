import React,{ useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import MultiplayerLobby from '../components/Multiplayer/Lobby.jsx';
import GameRoom from '../components/Multiplayer/GameRoom.jsx';
import './multiplayerPage.css';

const MultiplayerPage = () => {
  useDocumentTitle('Multiplayer - CDB');
  const { user } = useAuth();
  const [activeRooms, setActiveRooms] = useState([]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="multiplayer-page">
      <Routes>
        <Route 
          path="/" 
          element={<MultiplayerLobby activeRooms={activeRooms} />} 
        />
        <Route path="/:roomId" element={<GameRoom />} />
      </Routes>
    </div>
  );
};

export default MultiplayerPage;