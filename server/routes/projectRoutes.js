const express = require('express');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject, // We need to import these
  deleteProject  // We need to import these
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, createProject); // Protect the create route

router.route('/:id').get(getProjectById).put(protect, updateProject).delete(protect, deleteProject); // Add PUT and DELETE, and protect them

module.exports = router;
