import axios from 'axios';
import { getToken } from './authService'; // Import getToken to send with authenticated requests

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'; // Adjust port if needed

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public function to get projects (used by main portfolio site)
export const getProjects = async () => {
  try {
    const response = await apiClient.get('/projects');
    return response.data.data; // Assuming your backend returns { success: true, count: ..., data: [...] }
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Admin function to get projects (can be same as public for now)
export const getAdminProjects = async () => {
  // If your GET /api/projects route ever becomes protected, you'd add token here.
  // For now, it's the same as the public getProjects.
  return getProjects();
};

export const deleteAdminProject = async (id) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No auth token found. Please log in.');
    }
    const response = await apiClient.delete(`/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const getAdminProjectById = async (id) => {
  try {
    // This route is public on the backend, but if it were protected, you'd add token here.
    // For consistency with admin operations, we can still check for token if desired,
    // but the backend /api/projects/:id is currently public.
    const response = await apiClient.get(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project by ID:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const createAdminProject = async (projectData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No auth token found. Please log in.');
    }
    const response = await apiClient.post('/projects', projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const updateAdminProject = async (id, projectData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No auth token found. Please log in.');
    }
    const response = await apiClient.put(`/projects/${id}`, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error.response?.data?.error || error.message);
    throw error;
  }
};

// Note: The backend routes for create and update projects are already protected
// in d:\PortFolio\server\routes\projectRoutes.js