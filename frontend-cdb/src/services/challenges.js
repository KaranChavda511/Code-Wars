import API from './api.js';

export const getChallenges = async (filters = {}) => {
  try {
    const response = await API.get('/challenges/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChallengeById = async (id) => {
  try {
    const response = await API.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createChallenge = async (challengeData) => {
  try {
    const response = await API.post('/challenges', challengeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateChallenge = async (id, challengeData) => {
  try {
    const response = await API.put(`/challenges/${id}`, challengeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteChallenge = async (id) => {
  try {
    const response = await API.delete(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitSolution = async (challengeId, code) => {
  try {
    const response = await API.post('/submissions/submit', {
      challengeId,
      code
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};