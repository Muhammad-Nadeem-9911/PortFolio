const Experience = require('../models/Experience');
const asyncHandler = require('express-async-handler');

// @desc    Get all public experiences
// @route   GET /api/experiences
// @access  Public
const getPublicExperiences = asyncHandler(async (req, res) => {
  // Sort by 'order' field if you have one, otherwise by creation date or another field
  const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
  res.status(200).json(experiences);
});

// --- Admin Controllers ---

// @desc    Create a new experience
// @route   POST /api/admin/experiences
// @access  Private/Admin
const createAdminExperience = asyncHandler(async (req, res) => {
  const { role, company, dates, description, order } = req.body;

  if (!role || !company || !dates || !description) {
    res.status(400);
    throw new Error('Please provide all required fields: role, company, dates, and description');
  }

  const experience = new Experience({
    role,
    company,
    dates,
    description,
    order,
    // user: req.user._id // If you want to associate experiences with the admin user who created them
  });

  const createdExperience = await experience.save();
  res.status(201).json(createdExperience);
});

// @desc    Get all experiences for admin
// @route   GET /api/admin/experiences
// @access  Private/Admin
const getAdminExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
  res.status(200).json(experiences);
});

// @desc    Get a single experience by ID for admin
// @route   GET /api/admin/experiences/:id
// @access  Private/Admin
const getAdminExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    res.status(200).json(experience);
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Update an experience
// @route   PUT /api/admin/experiences/:id
// @access  Private/Admin
const updateAdminExperience = asyncHandler(async (req, res) => {
  const { role, company, dates, description, order } = req.body;
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    experience.role = role || experience.role;
    experience.company = company || experience.company;
    experience.dates = dates || experience.dates;
    experience.description = description || experience.description;
    experience.order = order !== undefined ? order : experience.order;

    const updatedExperience = await experience.save();
    res.status(200).json(updatedExperience);
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Delete an experience
// @route   DELETE /api/admin/experiences/:id
// @access  Private/Admin
const deleteAdminExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    await experience.deleteOne(); // or experience.remove() for older Mongoose versions
    res.status(200).json({ message: 'Experience removed' });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

module.exports = {
  getPublicExperiences,
  createAdminExperience,
  getAdminExperiences,
  getAdminExperienceById,
  updateAdminExperience,
  deleteAdminExperience,
};