const Project = require('../models/Project');
const cloudinary = require('cloudinary').v2; // Import Cloudinary

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    console.log('Attempting to fetch projects from DB...'); // Add this log
    const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    console.log(`Found ${projects.length} projects.`); // Add this log
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a project (Example - secure this in a real app)
// @route   POST /api/projects
// @access  Private (should be)
exports.createProject = async (req, res, next) => {
  // In a real app, you'd have authentication and better validation
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const updatedData = req.body;

    // 1. Fetch the existing project to get the current list of screenshots
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // 2. Identify screenshots to be deleted from Cloudinary
    const existingScreenshots = project.screenshots || [];
    const newScreenshots = updatedData.screenshots || [];
    const screenshotsToDelete = existingScreenshots.filter(url => !newScreenshots.includes(url));

    if (screenshotsToDelete.length > 0) {
      console.log(`Attempting to delete ${screenshotsToDelete.length} images from Cloudinary for updated project: ${project.title}`);
      const publicIdsToDelete = screenshotsToDelete.map(url => {
        try {
          const parts = url.split('/');
          const uploadIndex = parts.indexOf('upload');
          if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null;
          const pathAndFileWithExtension = parts.slice(uploadIndex + (parts[uploadIndex + 1].match(/^v\d+$/) ? 2 : 1)).join('/');
          const publicId = pathAndFileWithExtension.substring(0, pathAndFileWithExtension.lastIndexOf('.'));
          return publicId;
        } catch (e) {
          console.error(`Error parsing Cloudinary URL for deletion: ${url}`, e);
          return null;
        }
      }).filter(id => id);

      if (publicIdsToDelete.length > 0) {
        console.log('Public IDs to delete from Cloudinary during update:', publicIdsToDelete);
        for (const publicId of publicIdsToDelete) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted from Cloudinary during update: ${publicId}`);
          } catch (cloudinaryError) {
            // Log the error but continue, so the project update itself isn't blocked
            // You might want more sophisticated error handling here (e.g., retry, or mark for later cleanup)
            console.error(`Failed to delete image ${publicId} from Cloudinary during update:`, cloudinaryError);
          }
        }
      }
    }

    // 3. Update the project document in MongoDB
    const updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found for deletion.' });
    }

    // Delete images from Cloudinary
    if (project.screenshots && project.screenshots.length > 0) {
      console.log(`Attempting to delete ${project.screenshots.length} images from Cloudinary for project: ${project.title}`);
      const publicIds = project.screenshots.map(url => {
        // Extract public_id from URL.
        // Example URL: http://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
        // The public_id for deletion includes the folder path but not the version or extension.
        try {
          const parts = url.split('/');
          const uploadIndex = parts.indexOf('upload');
          // Ensure 'upload' segment exists and there are segments after it
          if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null; 

          // Segments after 'upload' and before the filename (excluding version if present) form the path + public_id
          // If a version (e.g., v1234567890) is present, it's parts[uploadIndex + 1]
          // The actual public_id for deletion starts after the version or directly after 'upload' if no version.
          const pathAndFileWithExtension = parts.slice(uploadIndex + (parts[uploadIndex+1].match(/^v\d+$/) ? 2 : 1)).join('/');
          const publicId = pathAndFileWithExtension.substring(0, pathAndFileWithExtension.lastIndexOf('.'));
          return publicId;
        } catch (e) {
          console.error(`Error parsing Cloudinary URL to get public_id: ${url}`, e);
          return null; // Skip if URL parsing fails
        }
      }).filter(id => id); // Filter out any nulls from parsing errors

      if (publicIds.length > 0) {
        console.log('Public IDs to delete from Cloudinary:', publicIds);
        // Cloudinary's delete_resources can take an array of public_ids
        // Or loop and destroy one by one (destroy is simpler for fewer images)
        for (const publicId of publicIds) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted from Cloudinary: ${publicId}`);
        }
      }
    }

    // Delete project from MongoDB
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error during project deletion process:', error);
    res.status(500).json({ success: false, error: 'Server Error during project deletion.' });
  }
};