const ContactInfo = require('../models/ContactInfo');
const asyncHandler = require('express-async-handler'); // Or your preferred async error handler

// @desc    Get contact information
// @route   GET /api/admin/contact-info (or /api/admin/contact-info/admin depending on route setup)
// @access  Private/Admin
const getAdminContactInfo = asyncHandler(async (req, res) => {
  // Use the static helper to find or create the document
  // This ensures that if no document exists, one is created with schema defaults
  // or specific defaults defined in the findOneOrCreate method.
  const contactInfo = await ContactInfo.findOneOrCreate();
  res.status(200).json(contactInfo);
});

// @desc    Update contact information
// @route   PUT /api/admin/contact-info (or /api/admin/contact-info/admin depending on route setup)
// @access  Private/Admin
const updateAdminContactInfo = asyncHandler(async (req, res) => {
  const contactInfo = await ContactInfo.findOneOrCreate(); // Ensure document exists
  const { introText, email, socialLinks } = req.body;

  // Validate input (basic example)
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Update fields on the fetched/created document
  if (introText !== undefined) contactInfo.introText = introText;
  contactInfo.email = email; // Already validated that email is present

  if (socialLinks && Array.isArray(socialLinks)) {
    contactInfo.socialLinks = socialLinks.map(link => ({
      platform: link.platform || '',
      url: link.url || '',
    })).filter(link => link.platform && link.url); // Basic validation for links
  } else if (socialLinks === null || (Array.isArray(socialLinks) && socialLinks.length === 0)) {
    contactInfo.socialLinks = []; // Allow clearing social links
  }

  const updatedContactInfo = await contactInfo.save();

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
  // Use the static helper to find or create the document
  const contactInfo = await ContactInfo.findOneOrCreate();
  // Select fields to exclude for public response
  const publicData = await ContactInfo.findById(contactInfo._id).select('-createdAt -updatedAt -__v');
  res.status(200).json(publicData);
});

module.exports = {
  getAdminContactInfo,    // Renamed for clarity
  updateAdminContactInfo, // Renamed for clarity
  getPublicContactInfo,   // Added new public function
};
