const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, registerUser); // Protect the register route

module.exports = router;
