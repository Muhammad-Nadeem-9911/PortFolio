const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const projectRoutes = require('./routes/projectRoutes'); // For public project data and admin project management
const authRoutes = require('./routes/authRoutes');
const aboutRoutes = require('./routes/aboutRoutes'); // Import the new about routes
const contactRoutes = require('./routes/contactRoutes'); // Import the new contact routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Standard error handlers
const experienceRoutes = require('./routes/experienceRoutes');
const skillRoutes = require('./routes/skillRoutes'); // Import skill routes

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

// Enable CORS - Configure this properly for production
const allowedOrigins = ['https://portfolio-1vs8.onrender.com']; // Add your frontend URL
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Mount routers
app.use('/api/projects', projectRoutes); // This might handle both public GET and admin CRUD for projects
app.use('/api/auth', authRoutes); // This tells Express to use authRoutes for any path starting with /api/auth
app.use('/api/about-info', aboutRoutes); // Mount the public about route
app.use('/api/admin/about-info', aboutRoutes); // Mount the admin about routes (will use the /admin sub-path from aboutRoutes.js)
app.use('/api/contact-info', contactRoutes); // Mount the public contact route
app.use('/api/admin/contact-info', contactRoutes); // Mount the contact routes for admin

// Mount experienceRoutes and skillRoutes once at /api.
// These router files will handle their specific sub-paths (e.g., /skills, /admin/skills, /experiences, /admin/experiences).
app.use('/api', experienceRoutes); // Assuming experienceRoutes is structured like skillRoutes
app.use('/api', skillRoutes);

// --- It's good practice to have these error handlers last ---
// Handle 404 errors - Not Found
app.use(notFound);

// Custom Global Error Handler
app.use((err, req, res, next) => {
  // console.error("Global Error Handler Caught:", err); // Optional: Keep for debugging, removed for cleanup
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status is not already set
  let message = err.message || 'Server Error';

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `The value '${value}' for the field '${field}' already exists. Please use a different value.`;
    statusCode = 400; // Bad Request for duplicate entries
  } else if (err.name === 'ValidationError') { // Mongoose validation error
    const messages = Object.values(err.errors).map(val => val.message);
    message = messages.join(', ');
    statusCode = 400; // Bad Request for validation errors
  }

  res.status(statusCode).json({
    message: message,
    // Send stack only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));