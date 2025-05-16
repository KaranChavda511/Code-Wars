import React,{ useEffect } from 'react';
import { useSocket as useSocketContext } from '../contexts/SocketContext.jsx';
import { toast } from 'react-hot-toast';

// Enhanced socket hook with reconnect logic
const useSocket = () => {
  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      const handleConnectError = (err) => {
        toast.error(`Connection error: ${err.message}`);
      };

      const handleReconnectAttempt = (attempt) => {
        toast.loading(`Reconnecting (attempt ${attempt})...`);
      };

      socket.on('connect_error', handleConnectError);
      socket.on('reconnect_attempt', handleReconnectAttempt);

      return () => {
        socket.off('connect_error', handleConnectError);
        socket.off('reconnect_attempt', handleReconnectAttempt);
      };
    }
  }, [socket]);

  return {
    socket,
    isConnected: socket?.connected || false
  };
};

export default useSocket;