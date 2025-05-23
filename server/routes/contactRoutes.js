const express = require('express');
const router = express.Router();
const { 
// Import all necessary controller functions
  getPublicContactInfo,
  getAdminContactInfo,    // Assuming getContactInfo was meant for admin
  updateAdminContactInfo  // Assuming updateContactInfo was meant for admin

 } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Route ---
// This route will be used by ContactSection.js to fetch contact info
// This will be mounted at /api/contact-info in server.js
router.route('/').get(getPublicContactInfo);

// --- Admin Routes ---
// These routes will be used by AdminContactPage.js
// This will be mounted at /api/admin/contact-info in server.js,
// so these routes will be /api/admin/contact-info/admin
router.route('/admin')
  .get(protect, getAdminContactInfo)
  .put(protect, updateAdminContactInfo);

module.exports = router;
