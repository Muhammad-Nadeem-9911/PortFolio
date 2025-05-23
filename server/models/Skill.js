const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true, // Skill names should probably be unique
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], // Example levels
    default: 'Intermediate',
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  iconUrl: {
    type: String,
    trim: true,
    default: '', // Optional: URL to an icon image
  },
  order: {
    type: Number,
    default: 0, // For custom sorting
  },
  isPublic: {
    type: Boolean,
    default: true, // Whether to show on the public portfolio
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;