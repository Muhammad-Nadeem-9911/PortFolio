// d:\PortFolio\server\models\Experience.js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  dates: { type: String, required: true, trim: true }, // e.g., "March 2022 - Present" or "2020 - 2021"
  description: { type: [String], required: true }, // Array of strings for bullet points
  order: { type: Number, default: 0 }, // Optional: for custom sorting
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
