import API from './api.js';

export const executeCode = async (code, challengeId) => {
  try {
    const response = await API.post('/code/run', {
      code,
      challengeId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateSolution = async (code, challengeId) => {
  try {
    const response = await API.post('/code/validate', {
      code,
      challengeId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTestCases = async (challengeId) => {
  try {
    const response = await API.get(`/code/test-cases/${challengeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};