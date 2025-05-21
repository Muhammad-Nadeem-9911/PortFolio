const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  technologies: {
    type: [String],
    required: [true, 'At least one technology must be listed'],
  },
  screenshots: { // Array of URLs to your screenshots
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10 screenshots'],
  },
  liveLink: { type: String, trim: true },
  githubLink: { type: String, trim: true },
  displayOrder: { type: Number, default: 0 }, // For ordering projects
}, { timestamps: true });

function arrayLimit(val) { return val.length <= 10; }

module.exports = mongoose.model('Project', projectSchema);