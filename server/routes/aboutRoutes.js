const express = require('express');
const router = express.Router();
const {
 getPublicAboutInfo,
 getAdminAboutInfo,
 updateAdminAboutInfo,
} = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware'); // Removed 'admin' from import
const multer = require('multer');

// Multer setup for image uploads
// We'll use diskStorage with an empty object, which defaults to OS temp directory.
// Cloudinary can upload from a file path.
const storage = multer.diskStorage({}); 

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
    // Allow PDF and Word documents for resume
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Please upload an image (jpeg, png, gif) or a document (pdf, doc, docx).'), false);
  }
};

// Configure multer instance
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // 10MB file size limit (adjust for resume + image)
});
// --- Public Route ---
// This route will be used by HeroSection.js to fetch "About" info
// Mounted at /api/about-info in server.js
router.route('/').get(getPublicAboutInfo);

// --- Admin Routes ---
// These routes will be used by the AdminAboutPage.js
// Mounted at /api/admin/about-info in server.js
router.route('/admin')
 .get(protect, getAdminAboutInfo) // Removed 'admin' middleware
 .put(
    protect, 
    upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'resumeFile', maxCount: 1 }]), 
    updateAdminAboutInfo
  );

module.exports = router;