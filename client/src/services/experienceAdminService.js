import api from './api'; // Your central axios instance with auth headers

/**
 * Fetches all experiences for the admin panel.
 * @returns {Promise<Array<Object>>} An array of experience objects.
 */
export const getAdminExperiencesList = async () => {
  try {
    // Standard path for listing admin resources
    const response = await api.get('/admin/experiences');
    return response.data;
  } catch (error) {
    console.error('Error fetching experiences for admin:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch experiences' };
  }
};

/**
 * Fetches a single experience by ID for the admin panel.
 * @param {string} id - The ID of the experience.
 * @returns {Promise<Object>} The experience object.
 */
export const getAdminExperienceDetails = async (id) => {
  try {
    // Standard path for fetching a specific admin resource by ID
    const response = await api.get(`/admin/experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching experience details for ID ${id}:`, error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch experience details' };
  }
};

/**
 * Creates a new experience.
 * @param {Object} experienceData - The data for the new experience.
 * @returns {Promise<Object>} The created experience object.
 */
export const createAdminExperienceEntry = async (experienceData) => {
  try {
    // Standard path for creating an admin resource
    const response = await api.post('/admin/experiences', experienceData);
    return response.data;
  } catch (error)
   {
    console.error('Error creating experience:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to create experience' };
  }
};

/**
 * Updates an existing experience.
 * @param {string} id - The ID of the experience to update.
 * @param {Object} experienceData - The updated data for the experience.
 * @returns {Promise<Object>} The updated experience object.
 */
export const updateAdminExperienceEntry = async (id, experienceData) => {
  try {
    // Standard path for updating a specific admin resource by ID
    const response = await api.put(`/admin/experiences/${id}`, experienceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating experience ID ${id}:`, error.response || error.message);
    throw error.response?.data || { message: 'Failed to update experience' };
  }
};

/**
 * Deletes an experience.
 * @param {string} id - The ID of the experience to delete.
 * @returns {Promise<Object>} The success message or response data.
 */
export const deleteAdminExperienceEntry = async (id) => {
  try {
    // Standard path for deleting a specific admin resource by ID
    const response = await api.delete(`/admin/experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting experience ID ${id}:`, error.response || error.message);
    throw error.response?.data || { message: 'Failed to delete experience' };
  }
};