import API from './api.js';

export const createRoom = async (roomData) => {
  try {
    const response = await API.post('/multiplayer/room', roomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRooms = async () => {
  try {
    const response = await API.get('/multiplayer/rooms');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinRoom = async (roomId) => {
  try {
    const response = await API.post(`/multiplayer/room/${roomId}/join`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const startGame = async (roomId) => {
  try {
    const response = await API.post(`/multiplayer/room/${roomId}/start`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitSolution = async (roomId, challengeId, code) => {
  try {
    const response = await API.post('/multiplayer/submit', {
      roomId,
      challengeId,
      code
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGameState = async (roomId) => {
  try {
    const response = await API.get(`/multiplayer/room/${roomId}/state`);
    return response.data;
  } catch (error) {
    throw error;
  }
};