const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes'); // Make sure the path is correct

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors()); // Configure this properly for production

// Mount routers
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes); // This tells Express to use authRoutes for any path starting with /api/auth

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`))