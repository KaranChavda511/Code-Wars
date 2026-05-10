import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:2001';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
