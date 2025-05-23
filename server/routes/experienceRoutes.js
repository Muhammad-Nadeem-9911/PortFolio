const express = require('express');
const router = express.Router();
const {
  getPublicExperiences,
  createAdminExperience,
  getAdminExperiences, // Renamed from getAdminExperiencesListController for consistency if needed
  getAdminExperienceById,
  updateAdminExperience,
  deleteAdminExperience,
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware'); // Assuming only 'protect' is needed for admin

// --- Public Route ---
// Assuming this router is mounted at /api in server.js
// This will handle GET /api/experiences
router.route('/experiences').get(getPublicExperiences);

// --- Admin Routes ---
// Assuming this router is mounted at /api in server.js
// These routes will handle /api/admin/experiences and /api/admin/experiences/:id

// General admin route for listing all experiences and creating a new one
// GET /api/admin/experiences
// POST /api/admin/experiences
router.route('/admin/experiences')
  .get(protect, getAdminExperiences) // Controller for fetching all admin experiences
  .post(protect, createAdminExperience)

// Specific admin route for operations on a single experience by ID
// GET /api/admin/experiences/:id
// PUT /api/admin/experiences/:id
// DELETE /api/admin/experiences/:id
router.route('/admin/experiences/:id')
  .get(protect, getAdminExperienceById)
  .put(protect, updateAdminExperience)
  .delete(protect, deleteAdminExperience);

module.exports = router;