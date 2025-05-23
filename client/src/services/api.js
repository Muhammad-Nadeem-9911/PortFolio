import axios from 'axios';
import { getToken, logoutUser } from './authService'; // Assuming getToken and logoutUser are in your authService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken(); // Fetches token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[Axios Interceptor] Token being sent for path:', config.url);
    } else {
      console.warn('[Axios Interceptor] No token found for path:', config.url, '(Request will be unauthenticated)');
    }
    return config;
  },
  (error) => {
    console.error('[Axios Interceptor] Error in request setup:', error);
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle global errors like 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[Axios Interceptor] API call error:', error.config?.url, error.response?.status, error.response?.data);
    if (error.response && error.response.status === 401) {
      console.error('[Axios Interceptor] Unauthorized (401) response. Consider logging out user.');
      // Example: Forcing logout and redirect on 401
      // logoutUser(); // Make sure this doesn't cause redirect loops if login page also uses api instance
      // window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;