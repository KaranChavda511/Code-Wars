import API from './api.js';

export const login = async (email, password) => {
  try {
    const response = await API.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await API.post('/users/signup', { 
      username, 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await API.post('/users/logout');
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/users/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};