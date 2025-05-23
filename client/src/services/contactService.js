import api from './api'; // Assuming you have an api.js for axios instance with base URL and auth headers

/**
 * Fetches the contact information for the admin panel.
 * @returns {Promise<Object>} The contact information.
 */
export const getAdminContactInfo = async () => {
  try {
    const response = await api.get('/admin/contact-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact information:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch contact information' };
  }
};

/**
 * Updates the contact information.
 * @param {Object} contactData - The contact data to update.
 * @param {string} contactData.introText - The introductory text.
 * @param {string} contactData.email - The contact email.
 * @param {Array<Object>} contactData.socialLinks - Array of social links.
 * @param {string} contactData.socialLinks[].platform - Platform name (e.g., GitHub, LinkedIn).
 * @param {string} contactData.socialLinks[].url - URL of the social media profile.
 * @param {string} [contactData.socialLinks[].label] - Optional label for aria-label.
 * @returns {Promise<Object>} The updated contact information.
 */
export const updateAdminContactInfo = async (contactData) => {
  try {
    const response = await api.put('/admin/contact-info', contactData);
    return response.data;
  } catch (error) {
    console.error('Error updating contact information:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to update contact information' };
  }
};

// Ensure you have an api.js like this in your services folder:
// import axios from 'axios';
// const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });
// api.interceptors.request.use(config => { /* Add auth token if needed */ return config; });
// export default api;