import API from './api.js';

export const getLeaderboard = async (limit = 100) => {
  try {
    const response = await API.get('/leaderboard', { params: { limit } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await API.get(`/leaderboard/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentActivity = async (userId) => {
  try {
    const response = await API.get(`/leaderboard/user/${userId}/activity`);
    return response.data;
  } catch (error) {
    throw error;
  }
};