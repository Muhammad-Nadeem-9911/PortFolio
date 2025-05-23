const express = require('express');
const router = express.Router();
const {
  getPublicSkills,
  getAdminSkills,
  getAdminSkillById,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Route ---
// Assuming this router is mounted at /api in server.js
router.route('/skills').get(getPublicSkills); // Path is now /skills relative to /api

// --- Admin Routes ---
// Assuming this router is mounted at /api in server.js
router.route('/admin/skills') // Path is now /admin/skills relative to /api
  .get(protect, getAdminSkills)
  .post(protect, createAdminSkill);

router.route('/admin/skills/:id') // Path is now /admin/skills/:id relative to /api
  .get(protect, getAdminSkillById)
  .put(protect, updateAdminSkill)
  .delete(protect, deleteAdminSkill);

module.exports = router;