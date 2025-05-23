import api from './api'; // Assuming this is your authenticated axios instance
import axios from 'axios'; // Import axios for the public instance

// It's good practice to have a central API instance,
// but for simplicity, we can create one here or import if you have one.
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api', // Explicitly point to your backend
});


// --- Public Service ---

/**
 * Fetches the public "Skills" information for the portfolio.
 * @returns {Promise<Array<Object>>} An array of skill objects.
 */
export const getPublicSkills = async () => {
  try {
    const response = await publicApi.get('/skills'); // Public endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching public skills:', error.response || error.message, error);
    throw error.response?.data || { message: 'Failed to fetch skills information' };
  }
};


// --- Admin Services ---

/**
 * Fetches all skills for the admin panel.
 * @returns {Promise<Array<Object>>} An array of skill objects.
 */
export const getAdminSkills = async () => {
  try {
    const response = await api.get('/admin/skills'); // Admin endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching admin skills:', error.response ? error.response.data : error.message);
    throw error.response?.data || { message: 'Failed to fetch admin skills' };
  }
};

/**
 * Fetches a single skill by ID for the admin panel.
 * @param {string} id - The ID of the skill.
 * @returns {Promise<Object>} The skill object.
 */
export const getAdminSkillById = async (id) => {
  try {
    const response = await api.get(`/admin/skills/${id}`); // Admin endpoint
    return response.data;
  } catch (error) {
    console.error(`Error fetching admin skill ${id}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || { message: `Failed to fetch skill ${id}` };
  }
};

/**
 * Creates a new skill.
 * @param {Object} skillData - The data for the new skill.
 * @returns {Promise<Object>} The created skill object.
 */
export const createAdminSkill = async (skillData) => {
  try {
    const response = await api.post('/admin/skills', skillData); // Admin endpoint
    return response.data;
  } catch (error) {
    console.error('Error creating admin skill:', error.response ? error.response.data : error.message);
    throw error.response?.data || { message: 'Failed to create skill' };
  }
};

/**
 * Updates an existing skill.
 * @param {string} id - The ID of the skill to update.
 * @param {Object} skillData - The updated data for the skill.
 * @returns {Promise<Object>} The updated skill object.
 */
export const updateAdminSkill = async (id, skillData) => {
  try {
    const response = await api.put(`/admin/skills/${id}`, skillData); // Admin endpoint
    return response.data;
  } catch (error) {
    console.error(`Error updating admin skill ${id}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || { message: `Failed to update skill ${id}` };
  }
};

/**
 * Deletes a skill.
 * @param {string} id - The ID of the skill to delete.
 * @returns {Promise<Object>} Confirmation message.
 */
export const deleteAdminSkill = async (id) => {
  try {
    const response = await api.delete(`/admin/skills/${id}`); // Admin endpoint
    return response.data;
  } catch (error) {
    console.error(`Error deleting admin skill ${id}:`, error.response ? error.response.data : error.message);
    throw error.response?.data || { message: `Failed to delete skill ${id}` };
  }
};