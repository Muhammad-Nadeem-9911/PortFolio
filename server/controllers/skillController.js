const Skill = require('../models/Skill');
const asyncHandler = require('express-async-handler');

// @desc    Get all public skills
// @route   GET /api/skills
// @access  Public
const getPublicSkills = asyncHandler(async (req, res) => {
  // Fetch skills marked as public, sorted by order (ascending) then name (ascending)  
  const skills = await Skill.find({ isPublic: true }).sort('order name').select('-createdAt -updatedAt -__v -isPublic');
  res.json(skills);
});

// --- Admin Controllers ---

// @desc    Get all skills (for admin)
// @route   GET /api/admin/skills
// @access  Private/Admin
const getAdminSkills = asyncHandler(async (req, res) => {
  // Attempt to fetch all skills and explicitly include the isPublic field
  // Attempt to fetch all skills and explicitly include the isPublic field
  // The .select('+isPublic') attempts to override any global projection that might be excluding it.
  // The empty filter {} is still subject to global pre('find') hooks that might add conditions.
  const skills = await Skill.find({}).select('+isPublic').sort('order name');
    res.json(skills);
});

// @desc    Get single skill by ID (for admin)
// @route   GET /api/admin/skills/:id
// @access  Private/Admin
const getAdminSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (skill) {
    res.json(skill);
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

// @desc    Create a new skill (for admin)
// @route   POST /api/admin/skills
// @access  Private/Admin
const createAdminSkill = asyncHandler(async (req, res) => {
  // isPublic is no longer sent from the main creation form, relies on schema default
  // category and iconUrl are also removed from the form
  const { name, level, order } = req.body;

  const skill = new Skill({
    name,
    level,
    order,
    // isPublic will use the schema default (true)
  });

  const createdSkill = await skill.save();
  res.status(201).json(createdSkill);
});

// @desc    Update a skill (for admin)
// @route   PUT /api/admin/skills/:id
// @access  Private/Admin
const updateAdminSkill = asyncHandler(async (req, res) => {
  // category and iconUrl are removed from the form
  const { name, level, order, isPublic } = req.body;

  const skill = await Skill.findById(req.params.id);

  if (skill) {
    skill.name = name ?? skill.name; // Use ?? to allow empty strings but not undefined
    skill.level = level ?? skill.level;
    skill.order = order !== undefined ? order : skill.order; // Allow 0
    skill.isPublic = isPublic !== undefined ? isPublic : skill.isPublic; // Allow false

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

// @desc    Delete a skill (for admin)
// @route   DELETE /api/admin/skills/:id
// @access  Private/Admin
const deleteAdminSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (skill) {
    await skill.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: 'Skill removed' });
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

module.exports = {
  getPublicSkills,
  getAdminSkills,
  getAdminSkillById,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
};