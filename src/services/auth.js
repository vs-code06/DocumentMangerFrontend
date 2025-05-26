import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/api/profile/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};