const mongoose = require('mongoose');

const AboutInfoSchema = new mongoose.Schema(
  {
    greeting: {
      type: String,
      trim: true,
      default: 'Hi, my name is',
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      default: 'Your Name',
    },
    taglineStrings: {
      type: [String], // Array of strings
      default: ["I build things for the web.", "I'm a Full Stack Developer."],
    },
    profileImageUrl: {
      type: String,
      trim: true,
      default: '/Profile.png', // Default local path or a placeholder
    },
    resumeUrl: { // Will now store Cloudinary URL for the resume
      type: String,
      trim: true,
      default: '',
    },
    profileImagePublicId: { // To store Cloudinary public_id for deletion
      type: String,
      trim: true,
      default: '',
    },
    bio: { // New field for the "About Me" paragraph
      type: String,
      trim: true,
      default: 'A passionate developer dedicated to creating amazing web experiences. Currently exploring new technologies and seeking challenging opportunities.',
    },
    resumePublicId: { // To store Cloudinary public_id for the resume file
      type: String,
      trim: true,
      default: '',
    }

    // You could add a field for a longer "About Me" paragraph here if needed
    // bio: { type: String, trim: true, default: 'A short bio about yourself...' }
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Helper static method to find or create the single About document
AboutInfoSchema.statics.findOneOrCreate = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({}); // Creates a document with default values
  }
  return doc;
};

module.exports = mongoose.model('AboutInfo', AboutInfoSchema);