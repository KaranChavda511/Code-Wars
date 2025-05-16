import React,{ useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  useSocket  from '../../hooks/useSocket.js';
import { toast } from 'react-hot-toast';
import ChallengeEditor from '../Challenges/ChallengeEditor.jsx';
import PlayerList from './PlayerList.jsx';
import './GameRoom.css';

const GameRoom = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const loadRoom = () => {
      socket.emit('joinGameRoom', roomId);
    };

    socket.on('gameStateUpdate', (updatedRoom) => {
      setRoom(updatedRoom);
      
      if (updatedRoom.currentChallengeIndex !== undefined) {
        setCurrentChallenge(updatedRoom.challenges[updatedRoom.currentChallengeIndex]);
      }

      if (updatedRoom.challengeStartTime) {
        const endTime = new Date(updatedRoom.challengeStartTime);
        endTime.setSeconds(endTime.getSeconds() + updatedRoom.timerDuration);
        
        const updateTimer = () => {
          const now = new Date();
          const diff = Math.max(0, (endTime - now) / 1000);
          setTimeLeft(Math.floor(diff));
        };
        
        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
      }
    });

    socket.on('gameError', (error) => {
      toast.error(error.message);
    });

    loadRoom();

    return () => {
      socket.emit('leaveGameRoom', roomId);
      socket.off('gameStateUpdate');
      socket.off('gameError');
    };
  }, [socket, roomId]);

  const handleStartGame = () => {
    socket.emit('startGame', roomId);
  };

  const handleSubmitSolution = (code) => {
    socket.emit('submitSolution', { roomId, code });
  };

  if (!room) return <div>Loading room...</div>;

  return (
    <div className="game-room">
      <div className="game-header">
        <h2>{room.roomName}</h2>
        <div className="game-meta">
          <span className="timer">Time Left: {timeLeft}s</span>
          <span className="challenge-count">
            Challenge {room.currentChallengeIndex + 1} of {room.challenges.length}
          </span>
        </div>
        {room.status === 'waiting' && room.owner === socket.id && (
          <button onClick={handleStartGame} className="start-btn">
            Start Game
          </button>
        )}
      </div>

      <div className="game-content">
        <div className="players-section">
          <PlayerList players={room.players} currentChallenge={room.currentChallengeIndex} />
        </div>
        
        <div className="challenge-section">
          {currentChallenge ? (
            <>
              <div className="challenge-info">
                <h3>{currentChallenge.title}</h3>
                <p>{currentChallenge.description}</p>
              </div>
              <ChallengeEditor 
                challenge={currentChallenge} 
                onSubmit={handleSubmitSolution}
              />
            </>
          ) : (
            <div className="waiting-challenge">
              {room.status === 'waiting' ? 'Waiting for game to start...' : 'Loading challenge...'}
            </div>
          )}
        </div>
      </div>

      {room.status === 'completed' && (
        <div className="game-results">
          <h3>Game Results</h3>
          <ol>
            {room.results[room.results.length - 1]?.rankings?.map((player, index) => (
              <li key={player._id}>
                {index + 1}. {player.username} - {player.score}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default GameRoom;