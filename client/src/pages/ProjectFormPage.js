import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
// import { getProjectById, createProject, updateProject } from '../services/projectService'; // We'll use these later
import { getAdminProjectById, createAdminProject, updateAdminProject } from '../services/projectService';
import axios from 'axios'; // For Cloudinary uploads

const FormPageContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  h1 {
    color: ${props => props.theme.colors.heading};
    text-align: center;
    margin-bottom: 30px;
  }
`;

const Form = styled.form`
  max-width: 700px;
  margin: 0 auto;
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.secondaryAccent};
    font-weight: 500;
  }

  input[type="text"],
  input[type="url"],
  input[type="number"],
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid ${props => props.theme.colors.secondaryAccent};
    border-radius: 4px;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primaryAccent};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.85;
    }
  }

  button[type="submit"] {
    background-color: ${props => props.theme.colors.primaryAccent};
    color: ${props => props.theme.colors.background};
  }

  button[type="button"] {
    background-color: ${props => props.theme.colors.secondaryAccent};
    color: ${props => props.theme.colors.heading};
  }
`;

const ScreenshotPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const ScreenshotPreview = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.colors.secondaryAccent};
  border-radius: 4px;
  padding: 5px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 3px;
  }

  button { /* Remove button */
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    padding: 0;
  }
`;

const initialFormState = {
  title: '',
  description: '',
  technologies: '', // Will be comma-separated string, then converted to array
  screenshots: [], // Array of URLs
  liveLink: '',
  githubLink: '',
  displayOrder: 0,
};

const ProjectFormPage = () => {
  const { id } = useParams(); // To get project ID for editing
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // For new files to upload
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      const fetchProject = async () => {
        try {
          const projectData = await getAdminProjectById(id);
          setFormData({
            ...projectData,
            technologies: projectData.technologies.join(', '), // Convert array to comma-separated string for input
            // screenshots are already an array of URLs
          });
        } catch (err) {
          setError(err.message || 'Failed to fetch project details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else {
      setFormData(initialFormState); // Reset form for new project
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleFileChange = (e) => {
    // Allow up to 10 files in total (existing + new)
    const currentTotalScreenshots = formData.screenshots.length + selectedFiles.length;
    const filesToAdd = Array.from(e.target.files);
    
    if (currentTotalScreenshots + filesToAdd.length > 10) {
      alert(`You can upload a maximum of 10 screenshots. You currently have ${formData.screenshots.length} and selected ${selectedFiles.length + filesToAdd.length}.`);
      e.target.value = null; // Clear the file input
      return;
    }
    setSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd]);
    e.target.value = null; // Clear the file input to allow re-selecting the same file if needed
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeExistingScreenshot = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter(url => url !== urlToRemove),
    }));
  };

  const uploadFilesToCloudinary = async () => {
    if (selectedFiles.length === 0) return [];
    setImageUploadLoading(true);
    const uploadedUrls = [];
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME; // Store in .env
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; // Store in .env

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary cloud name or upload preset is not configured.");
      setError("Image upload service is not configured.");
      setImageUploadLoading(false);
      throw new Error("Image upload service not configured.");
    }

    for (const file of selectedFiles) {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append('file', file);
      formDataCloudinary.append('upload_preset', uploadPreset);
      try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataCloudinary);
        uploadedUrls.push(res.data.secure_url);
      } catch (uploadError) {
        console.error('Cloudinary upload error for a file:', uploadError);
        // Decide if you want to stop all or continue and report partial success
      }
    }
    setImageUploadLoading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newScreenshotUrls = await uploadFilesToCloudinary();
      const finalScreenshotUrls = [...formData.screenshots, ...newScreenshotUrls];

      if (finalScreenshotUrls.length > 10) {
        setError("Cannot save more than 10 screenshots in total.");
        setLoading(false);
        return;
      }

      const projectPayload = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        screenshots: finalScreenshotUrls,
      };

      if (isEditing) {
        await updateAdminProject(id, projectPayload);
      } else {
        await createAdminProject(projectPayload);
      }
      navigate('/admin/projects');
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} project.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <FormPageContainer><h1>Loading project details...</h1></FormPageContainer>;
  if (error) return <FormPageContainer><h1>Error: {error}</h1><button onClick={() => navigate('/admin/projects')}>Back</button></FormPageContainer>;

  return (
    <FormPageContainer>
      <h1>{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="technologies">Technologies (comma-separated)</label>
          <input type="text" name="technologies" id="technologies" value={formData.technologies} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="liveLink">Live Link</label>
          <input type="url" name="liveLink" id="liveLink" value={formData.liveLink} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="githubLink">GitHub Link</label>
          <input type="url" name="githubLink" id="githubLink" value={formData.githubLink} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="displayOrder">Display Order</label>
          <input type="number" name="displayOrder" id="displayOrder" value={formData.displayOrder} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <label htmlFor="screenshots">Screenshots (Max 10 total)</label>
          <input type="file" id="screenshots" multiple onChange={handleFileChange} accept="image/*" />
          {imageUploadLoading && <p>Uploading images...</p>}
          
          {(formData.screenshots.length > 0 || selectedFiles.length > 0) && <h4>Current & New Screenshots:</h4>}
          <ScreenshotPreviewContainer>
            {/* Display existing screenshots */}
            {formData.screenshots.map((url, index) => (
              <ScreenshotPreview key={`existing-${index}`}>
                <img src={url} alt={`Existing screenshot ${index + 1}`} />
                <button type="button" onClick={() => removeExistingScreenshot(url)}>×</button>
              </ScreenshotPreview>
            ))}
            {/* Display newly selected files for upload */}
            {selectedFiles.map((file, index) => (
              <ScreenshotPreview key={`new-${index}`}>
                <img src={URL.createObjectURL(file)} alt={`New screenshot ${index + 1}`} />
                <button type="button" onClick={() => removeSelectedFile(index)}>×</button>
              </ScreenshotPreview>
            ))}
          </ScreenshotPreviewContainer>
        </FormGroup>

        <ButtonGroup>
          <button type="button" onClick={() => navigate('/admin/projects')} disabled={loading || imageUploadLoading}>
            Cancel
          </button>
          <button type="submit" disabled={loading || imageUploadLoading}>
            {loading || imageUploadLoading
              ? 'Saving...'
              : isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </ButtonGroup>
      </Form>
    </FormPageContainer>
  );
};

export default ProjectFormPage;