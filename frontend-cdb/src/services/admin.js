import API from './api.js';

export const getUsers = async () => {
  try {
    const response = await API.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const response = await API.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentSubmissions = async () => {
  try {
    const response = await API.get('/admin/recent-submissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};