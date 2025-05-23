const ContactInfo = require('../models/ContactInfo');
const asyncHandler = require('express-async-handler'); // Or your preferred async error handler

// @desc    Get contact information
// @route   GET /api/admin/contact-info (or /api/admin/contact-info/admin depending on route setup)
// @access  Private/Admin
const getAdminContactInfo = asyncHandler(async (req, res) => {
  let contactInfo = await ContactInfo.findOne(); // Find the single contact info document

  if (!contactInfo) {
    // If no contact info exists, create a default one or return default values
    // Option 1: Return default structure (frontend will handle empty state)
    // return res.status(200).json({
    //   introText: "Default intro text...",
    //   email: "default@example.com",
    //   socialLinks: []
    // });

    // Option 2: Create and save a default document then return it (better for consistency)
    contactInfo = await ContactInfo.create({
      email: 'your.email@example.com', // Provide a sensible default
      introText: 'Feel free to reach out!',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/yourusername', label: 'GitHub' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
      ]
    });
  }

  res.status(200).json(contactInfo);
});

// @desc    Update contact information
// @route   PUT /api/admin/contact-info (or /api/admin/contact-info/admin depending on route setup)
// @access  Private/Admin
const updateAdminContactInfo = asyncHandler(async (req, res) => {
  const { introText, email, socialLinks } = req.body;

  // Validate input (basic example)
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Find the existing document or create a new one if it doesn't exist (upsert)
  // The filter {} will match the first document if one exists.
  const updatedContactInfo = await ContactInfo.findOneAndUpdate(
    {}, // An empty filter will match the first document found or create one if upsert is true
    { introText, email, socialLinks /*, lastUpdatedBy: req.user._id */ },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  if (updatedContactInfo) {
    res.status(200).json(updatedContactInfo);
  } else {
    // This case should ideally not be hit with upsert: true unless there's a db issue
    res.status(500);
    throw new Error('Failed to update contact information');
  }
});

// @desc    Get public contact information
// @route   GET /api/contact-info
// @access  Public
const getPublicContactInfo = asyncHandler(async (req, res) => {
  let contactInfo = await ContactInfo.findOne().select('-createdAt -updatedAt -__v'); // Exclude audit fields

  if (!contactInfo) {
    // If no contact info exists, create and return a default one.
    // This ensures the frontend always gets a consistent structure.
    contactInfo = await ContactInfo.create({
      email: 'contact@example.com', // Provide a sensible default
      introText: 'Feel free to reach out!',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com', label: 'GitHub' },
      ]
    });
    // Re-fetch to apply select and ensure consistency for the response
    contactInfo = await ContactInfo.findById(contactInfo._id).select('-createdAt -updatedAt -__v');
  }
  res.status(200).json(contactInfo);
});

module.exports = {
  getAdminContactInfo,    // Renamed for clarity
  updateAdminContactInfo, // Renamed for clarity
  getPublicContactInfo,   // Added new public function
};
