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
    console.log('[authService] Attempting login with:', { username }); // Don't log password here in production
    const response = await apiClient.post('/auth/login', { username, password });
    console.log('[authService] Login API response:', response);
    if (response.data && response.data.token) {
      // Ensure 'authToken' is the key used by PrivateRoute and api.js interceptor
      localStorage.setItem('authToken', response.data.token);
      console.log('[authService] Token stored in localStorage.');
    } else {
      console.warn('[authService] Token not found in response data:', response.data);
    }
    return response.data;
  } catch (error) {
    // Log the specific error structure from backend if available
    console.error('[authService] Login API error:', error.response ? error.response.data : error.message, error);
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