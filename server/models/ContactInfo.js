const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: [true, 'Platform name is required (e.g., GitHub, LinkedIn)'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Social link URL is required'],
    trim: true,
  },
  label: { // Optional, for aria-label or display
    type: String,
    trim: true,
  },
}, {_id: false}); // No separate _id for subdocuments unless needed

const ContactInfoSchema = new mongoose.Schema({
  // We can use a fixed identifier to always query/update the same document
  // Or, since there's only one, we can just find the first one.
  // For simplicity, let's assume there will be only one document of this type.
  introText: {
    type: String,
    default: "I'm currently looking for new opportunities...",
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    // You might want to add email validation here
  },
  socialLinks: [SocialLinkSchema],
  // You could add a lastUpdatedBy field if you have user tracking
  // lastUpdatedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User' // Assuming you have a User model
  // }
}, { timestamps: true }); // Adds createdAt and updatedAt

// Ensure only one contact info document exists (optional, more advanced)
// ContactInfoSchema.pre('save', async function (next) {
//   const count = await mongoose.model('ContactInfo').countDocuments();
//   if (count > 0 && this.isNew) {
//     const err = new Error('Only one ContactInfo document can exist.');
//     next(err);
//   } else {
//     next();
//   }
// });

// Helper static method to find or create the single ContactInfo document
ContactInfoSchema.statics.findOneOrCreate = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({}); // Creates a document with default values from the schema
  }
  return doc;
};
module.exports = mongoose.model('ContactInfo', ContactInfoSchema);
