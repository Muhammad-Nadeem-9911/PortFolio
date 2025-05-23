const AboutInfo = require('../models/AboutInfo');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module for path operations

// @desc    Get public "About" information
// @route   GET /api/about-info
// @access  Public
const getPublicAboutInfo = asyncHandler(async (req, res) => {
  // Use the static helper to find or create the document
  const aboutInfo = await AboutInfo.findOneOrCreate();
  // Select fields to exclude for public response
  const publicData = await AboutInfo.findById(aboutInfo._id).select('-createdAt -updatedAt -__v -profileImagePublicId');
  res.status(200).json(publicData);
});

// --- Admin Controllers ---

// @desc    Get "About" information for Admin
// @route   GET /api/admin/about-info
// @access  Private/Admin
const getAdminAboutInfo = asyncHandler(async (req, res) => {
  // Use the static helper to find or create the document
  const aboutInfo = await AboutInfo.findOneOrCreate();
  res.status(200).json(aboutInfo);
});

// @desc    Update "About" information
// @route   PUT /api/admin/about-info
// @access  Private/Admin
const updateAdminAboutInfo = asyncHandler(async (req, res) => {
  const aboutInfo = await AboutInfo.findOneOrCreate(); // Get or create the single document

  // Destructure text fields from req.body.
  // profileImageUrl and resumeUrl will be handled by Cloudinary uploads if files are present.
  const { greeting, name, taglineStrings, bio /* any other text fields */ } = req.body;

  // Update text fields
  if (greeting !== undefined) aboutInfo.greeting = greeting;
  if (name !== undefined) aboutInfo.name = name; // Name is required by schema, but check undefined for partial updates
  if (taglineStrings !== undefined) aboutInfo.taglineStrings = taglineStrings;
  if (bio !== undefined) aboutInfo.bio = bio;
  // Update other text fields here...

  // Handle profile image upload if req.files.profileImage exists
  if (req.files && req.files.profileImage && req.files.profileImage[0]) {
    const profileImageFile = req.files.profileImage[0];

    try {
      // 1. If there's an old image and its public_id is stored, delete it from Cloudinary
      if (aboutInfo.profileImagePublicId) {
        await cloudinary.uploader.destroy(aboutInfo.profileImagePublicId);
      }

      // 2. Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(profileImageFile.path, {
        folder: 'portfolio_profile_images', // Optional: specify a folder
        // transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }] // Optional transformations
      });

      aboutInfo.profileImageUrl = result.secure_url;
      aboutInfo.profileImagePublicId = result.public_id;

    } catch (uploadError) {
      console.error('Cloudinary upload error in updateAdminAboutInfo:', uploadError);
      res.status(500);
      throw new Error('Failed to upload profile image. Other changes might not have been saved.');
      // Note: If you want to ensure atomicity, you might need more complex transaction management
      // or save text fields first, then attempt image upload and save image fields.
    }
  }

  // Handle resume file upload if req.files.resumeFile exists
  if (req.files && req.files.resumeFile && req.files.resumeFile[0]) {
    const resumeFile = req.files.resumeFile[0];
    console.log('--- Handling Resume Upload ---');
    console.log('Original resume file details from multer:', {
      originalname: resumeFile.originalname,
      mimetype: resumeFile.mimetype,
      size: resumeFile.size,
      path: resumeFile.path,
    });
    try {
      // 1. If there's an old resume and its public_id is stored, delete it
      if (aboutInfo.resumePublicId) {
        await cloudinary.uploader.destroy(aboutInfo.resumePublicId, { resource_type: 'raw' });
      }

      // 2. Upload the new resume to Cloudinary
      // Extract the original extension to ensure it's part of the public_id or used as format
      const originalExtension = path.extname(resumeFile.originalname).toLowerCase(); // e.g., '.pdf'

      const result = await cloudinary.uploader.upload(resumeFile.path, {
        folder: 'portfolio_resumes',
        resource_type: 'raw', // Important for non-image files like PDF, DOCX
        // Explicitly set the public_id to include the original filename and extension
        public_id: `${path.parse(resumeFile.originalname).name}_${Date.now()}`, // Ensures unique name + original extension
        format: originalExtension.replace('.', '') // Tell Cloudinary the format without the dot
      });
      console.log('Cloudinary resume upload result:', JSON.stringify(result, null, 2));

      aboutInfo.resumeUrl = result.secure_url;
      aboutInfo.resumePublicId = result.public_id;

    } catch (uploadError) {
      console.error('Cloudinary resume upload error in updateAdminAboutInfo:', uploadError);
      res.status(500);
      throw new Error('Failed to upload resume. Other changes might not have been saved.');
    }
  }

  // Basic validation
  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }

  // Save the updated document (whether it was found or newly created and then modified)
  const updatedAboutInfo = await aboutInfo.save();

  if (updatedAboutInfo) { // Should always be true if save is successful
    res.status(200).json(updatedAboutInfo);
  } else {
    res.status(500); // Should not happen with upsert: true
    throw new Error('Failed to update "About" information');
  }
});

module.exports = {
  getPublicAboutInfo,
  getAdminAboutInfo,
  updateAdminAboutInfo,
};