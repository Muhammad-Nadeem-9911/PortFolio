import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
};

export const isLoggedIn = () => {
  const token = getToken();
  return !!token; // Basic check; consider token expiration validation for production
};