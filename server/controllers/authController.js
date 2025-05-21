const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Or your preferred expiration
  });
};

// @desc    Register a new user (admin)
// @route   POST /api/auth/register
// @access  Public (for initial setup, then make private or remove)
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    const user = await User.create({ username, password });
    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Auth user & get token (login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select('+password');
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};