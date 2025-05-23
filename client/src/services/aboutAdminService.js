import api from './api'; // Ensure this line is present and correct

/**
 * Fetches the "About" information for the admin panel.
 * @returns {Promise<Object>} The "About" information.
 * Example: { greeting: 'Hi', name: 'M~Nadeem', taglineStrings: ['Dev', 'Creator'], profileImageUrl: '/img.png' }
 */
export const getAdminAboutInfo = async () => {
  try {
    // Path matches the setup in server.js and aboutRoutes.js for admin GET
    const response = await api.get('/admin/about-info/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching "About" information for admin:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch "About" information' };
  }
};

/**
 * Updates the "About" information.
 * @param {Object} aboutData - The "About" data to update.
 * @param {string} aboutData.greeting
 * @param {string} aboutData.name
 * @param {Array<string>} aboutData.taglineStrings
 * @param {string} aboutData.profileImageUrl
 * @returns {Promise<Object>} The updated "About" information.
 */
export const updateAdminAboutInfo = async (formData) => { // Changed parameter to formData
  try {
    // Path matches the setup in server.js and aboutRoutes.js for admin PUT
// Axios will automatically set Content-Type to multipart/form-data when FormData is passed
    const response = await api.put('/admin/about-info/admin', formData);
    return response.data;
  } catch (error) {
    console.error('Error updating "About" information:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to update "About" information' };
  }
};
