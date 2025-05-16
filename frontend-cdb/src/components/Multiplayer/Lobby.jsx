// import React,{ useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import  useSocket  from '../../hooks/useSocket.js';
// import { toast } from 'react-hot-toast';
// import API from '../../services/api.js';
// import './Lobby.css'

// const Lobby = () => {
//   const [rooms, setRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState('');
//   const [isCreating, setIsCreating] = useState(false);
//   const { socket } = useSocket();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const { data } = await API.get('/multiplayer/rooms');
//         setRooms(data);
//       } catch (error) {
//         toast.error('Failed to load rooms');
//       }
//     };

//     fetchRooms();

//     if (socket) {
//       socket.on('roomCreated', (room) => {
//         setRooms(prev => [...prev, room]);
//       });

//       socket.on('roomJoined', (roomId) => {
//         navigate(`/multiplayer/${roomId}`);
//       });

//       socket.on('roomListUpdate', (updatedRooms) => {
//         setRooms(updatedRooms);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('roomCreated');
//         socket.off('roomJoined');
//         socket.off('roomListUpdate');
//       }
//     };
//   }, [socket, navigate]);

//   const handleCreateRoom = async () => {
//     if (!newRoomName.trim()) {
//       toast.error('Room name cannot be empty');
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const { data } = await API.post('/multiplayer/room', {
//         roomName: newRoomName,
//         challenges: [], // In real app, you'd select challenges
//       });
//       socket.emit('joinRoom', data.roomId);
//       setNewRoomName('');
//     } catch (error) {
//       toast.error('Failed to create room');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleJoinRoom = (roomId) => {
//     socket.emit('joinRoom', roomId);
//   };

//   return (
//     <div className="multiplayer-lobby">
//       <h2>Multiplayer Lobby</h2>

//       <div className="create-room">
//         <input
//           value={newRoomName}
//           onChange={(e) => setNewRoomName(e.target.value)}
//           placeholder="Enter room name"
//         />
//         <button 
//           onClick={handleCreateRoom} 
//           disabled={isCreating}
//           className="create-btn"
//         >
//           {isCreating ? 'Creating...' : 'Create Room'}
//         </button>
//       </div>

//       <div className="room-list">
//         <h3>Available Rooms</h3>
//         {rooms.length === 0 ? (
//           <p>No rooms available. Create one!</p>
//         ) : (
//           <ul>
//             {rooms.map(room => (
//               <li key={room._id} className="room-item">
//                 <div className="room-info">
//                   <span className="room-name">{room.roomName}</span>
//                   <span className="room-players">
//                     {room.players.length}/5 players
//                   </span>
//                 </div>
//                 <button 
//                   onClick={() => handleJoinRoom(room._id)}
//                   disabled={room.players.length >= 5}
//                   className="join-btn"
//                 >
//                   {room.players.length >= 5 ? 'Full' : 'Join'}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Lobby;







// yaha se new css vala code hai.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from '../../hooks/useSocket.js';
import { toast } from 'react-hot-toast';
import API from '../../services/api.js';
import './Lobby.css'

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchRooms = async () => {
    //   try {
    //     const { data } = await API.get('/multiplayer/rooms');
    //     // const { data } = await API.get('/multiplayer/room');
    //     setRooms(data);
    //   } catch (error) {
    //     toast.error('Failed to load rooms');
    //   }
    // };

    const fetchRooms = async () => {
      try {
        const { data } = await API.get('/multiplayer/rooms');
        if (data.rooms) {
          setRooms(data.rooms);
        } else {
          setRooms([]); // fallback
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]); // fallback on failure
      }
    };

    fetchRooms();

    if (socket) {
      socket.on('roomCreated', (room) => {
        setRooms(prev => [...prev, room]);
      });

      socket.on('roomJoined', (roomId) => {
        navigate(`/multiplayer/${roomId}`);
      });

      socket.on('roomListUpdate', (updatedRooms) => {
        setRooms(updatedRooms);
      });
    }

    return () => {
      if (socket) {
        socket.off('roomCreated');
        socket.off('roomJoined');
        socket.off('roomListUpdate');
      }
    };
  }, [socket, navigate]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Room name cannot be empty');
      return;
    }

    setIsCreating(true);
    try {
      // const { data } = await API.post('/multiplayer/room', {
        const { data } = await API.post('/multiplayer/rooms', {
        roomName: newRoomName,
        // challenges: [], // yaha par empty challenges bhej rahe hai isliye problem aa rhai hai
        challenges: [
          {
            title: "Dummy Challenge",
            description: "Solve this test challenge!",
            input: "2 3",
            output: "5"
          }
        ], // now yaha par ham ek dummy challenge bhej ke chake karte hai ki kaam ho raha hai ki nahi
      });
      socket.emit('joinRoom', data.roomId);
      setNewRoomName('');
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    socket.emit('joinRoom', roomId);
  };

  return (
    <div className="multiplayer-lobby">
      <h2>Multiplayer Lobby 🎮</h2>

      <div className="create-room">
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="create-btn"
        >
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>
      </div>

      <div className="room-list">
        <h3>Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms available. Create one! 🧪</p>
        ) : (
          <ul>
            {rooms.map(room => (
              <li key={room._id} className="room-item">
                <div className="room-info">
                  <span className="room-name">{room.roomName}</span>
                  <span className="room-players">
                    {room.players.length}/5 players
                    {room.players.length >= 5 && (
                      <span className="room-full-badge">Full</span>
                    )}
                  </span>
                  <div className="player-avatars">
                    {room.players.map((p, i) => (
                      <div key={i} className="player-avatar">
                        {p.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinRoom(room._id)}
                  disabled={room.players.length >= 5}
                  className="join-btn"
                >
                  {room.players.length >= 5 ? 'Full' : 'Join'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Lobby;



