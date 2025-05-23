import axios from 'axios';

// It's good practice to have a central API instance,
// but for simplicity, we can create one here or import if you have one.
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api', // Explicitly point to your backend
});

/**
 * Fetches the public contact information for the portfolio.
 * @returns {Promise<Object>} The contact information.
 * Example: { introText: '...', email: '...', socialLinks: [{platform: 'GitHub', url: '...'}] }
 */
export const getPublicContactInfo = async () => {
  try {
    // Ensure your backend has a public GET endpoint like '/contact-info' or '/portfolio/contact'
    const response = await publicApi.get('/contact-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching public contact information:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch contact information' };
  }
};

/**
 * Fetches the public "About" information for the portfolio.
 * @returns {Promise<Object>} The "About" section information.
 * Example: {
 *   greeting: 'Hi, my name is',
 *   name: 'M~Nadeem',
 *   taglineStrings: ["I build things for the web.", "I'm a Full Stack Developer."],
 *   profileImageUrl: '/Profile.png'
 * }
 */
export const getPublicAboutInfo = async () => {
  try {
    // Ensure your backend has a public GET endpoint like '/about-info' or '/portfolio/about'
    const response = await publicApi.get('/about-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching public about information:', error.response || error.message);
    throw error.response?.data || { message: 'Failed to fetch about information' };
  }
};

/**
 * Fetches the public "Experience" information for the portfolio.
 * @returns {Promise<Array<Object>>} An array of experience objects.
 * Example: [{
 *   _id: 'someId',
 *   role: 'Full Stack Developer',
 *   company: 'Freelancer',
 *   dates: 'March 2022 - Present',
 *   description: ['Developed web apps.', 'Used React & Node.js.']
 * }]
 */
export const getPublicExperiences = async () => {
  try {
    // Ensure your backend has a public GET endpoint like '/experiences' or '/portfolio/experiences'
    const response = await publicApi.get('/experiences');
    return response.data;
  } catch (error) {
    console.error('Error fetching public experiences:', error.response || error.message, error);
    throw error.response?.data || { message: 'Failed to fetch experience information' };
  }
};

/**
 * Fetches the public "Projects" information for the portfolio.
 * @returns {Promise<Array<Object>>} An array of project objects.
 * Example: [{
 *   _id: 'someId',
 *   title: 'My Awesome Project',
 *   description: 'This project does amazing things...',
 *   imageUrl: '/images/project.jpg',
 *   tags: ['React', 'Node.js', 'API'],
 *   liveUrl: 'https://example.com',
 *   sourceUrl: 'https://github.com/user/repo'
 * }]
 */
export const getPublicProjects = async () => {
  try {
    // Ensure your backend has a public GET endpoint like '/projects' or '/portfolio/projects'
    const response = await publicApi.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching public projects:', error.response || error.message, error);
    throw error.response?.data || { message: 'Failed to fetch project information' };
  }
};