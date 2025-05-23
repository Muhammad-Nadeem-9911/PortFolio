import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Link removed as nav is in layout
import { getAdminAboutInfo, updateAdminAboutInfo } from '../services/aboutAdminService'; // Assuming this service exists
import { useNotification } from '../contexts/NotificationContext'; // For better user feedback

const AdminPageContainer = styled.div`
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.secondaryAccent}80;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primaryAccent};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryAccent}40;
    }
  }
`;

const TaglineInputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    flex-grow: 1;
    margin-right: 10px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 5px;
  margin-right: 5px;
  background-color: ${props => props.theme.colors.secondaryAccent};
  color: ${props => props.theme.colors.heading};
  &:hover { opacity: 0.8; }
  &.danger { background-color: #e74c3c; color: white; }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.primaryAccent};
  color: ${props => props.theme.colors.background};
  transition: opacity 0.2s ease-in-out;
  width: 100%;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CurrentImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid ${props => props.theme.colors.secondaryAccent}80;
`;

const FileInput = styled.input`
  display: block;
  margin-top: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.secondaryAccent}80;
  border-radius: 4px;
  width: 100%;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const AdminAboutPage = () => {
  const [formData, setFormData] = useState({ greeting: '', name: '', taglineStrings: [''], bio: '' });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentResumeUrl, setCurrentResumeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // For previewing newly selected image
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification(); // Initialize the hook

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        setLoading(true);
        const data = await getAdminAboutInfo();
        setFormData({
          greeting: data.greeting || '',
          name: data.name || '',
          taglineStrings: data.taglineStrings && data.taglineStrings.length > 0 ? data.taglineStrings : [''],
          bio: data.bio || '',
          // resumeUrl is handled by currentResumeUrl for display
        });
        setCurrentImageUrl(data.profileImageUrl || '');      
        setCurrentResumeUrl(data.resumeUrl || '');
      } catch (err) {
        setError(err.message || 'Failed to load "About" information.');
        addNotification(err.message || 'Failed to load "About" information.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutInfo(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNotification]); // addNotification is stable

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaglineChange = (index, value) => {
    const newTaglines = [...formData.taglineStrings];
    newTaglines[index] = value;
    setFormData(prev => ({ ...prev, taglineStrings: newTaglines }));
  };

  const addTagline = () => {
    setFormData(prev => ({ ...prev, taglineStrings: [...prev.taglineStrings, ''] }));
  };

  const removeTagline = (index) => {
    if (formData.taglineStrings.length <= 1) return; // Keep at least one tagline input
    setFormData(prev => ({ ...prev, taglineStrings: prev.taglineStrings.filter((_, i) => i !== index) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview('');
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedResumeFile(file);
    } else {
      setSelectedResumeFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const submissionData = new FormData();
    submissionData.append('greeting', formData.greeting);
    submissionData.append('name', formData.name);
    formData.taglineStrings.forEach((tagline, index) => {
      submissionData.append(`taglineStrings[${index}]`, tagline);
    });
    submissionData.append('bio', formData.bio);

    if (selectedFile) {
      submissionData.append('profileImage', selectedFile); // Key must match multer field name in backend
    }
    if (selectedResumeFile) {
      submissionData.append('resumeFile', selectedResumeFile); // Key must match multer field name
    }

    try {
      const updatedData = await updateAdminAboutInfo(submissionData);
      addNotification('"About" information updated successfully!', 'success');
      setCurrentImageUrl(updatedData.profileImageUrl || ''); // Update displayed image
      setCurrentResumeUrl(updatedData.resumeUrl || ''); // Update resume URL
      setSelectedFile(null); // Clear selected file after successful upload
      setSelectedResumeFile(null); // Clear selected resume file
      setImagePreview('');   // Clear preview
    } catch (err) {
      setError(err.message || 'Failed to update "About" information.');
      addNotification(err.message || 'Failed to update "About" information.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminPageContainer><h1>Loading "About" Information...</h1></AdminPageContainer>;
  if (error && !loading) return <AdminPageContainer><h1>Error: {error}</h1></AdminPageContainer>;
  return (
    <AdminPageContainer>
      <h1>Admin - Manage "About" Information</h1>
      <Form onSubmit={handleSubmit}>
        {(imagePreview || currentImageUrl) && (
          <FormGroup>
            <label>Current Profile Image</label>
            <CurrentImagePreview src={imagePreview || currentImageUrl} alt="Profile Preview" />
          </FormGroup>
        )}
        <FormGroup>
          <label htmlFor="profileImageFile">Update Profile Image (Optional)</label>
          <FileInput type="file" id="profileImageFile" name="profileImageFile" accept="image/*" onChange={handleFileChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="greeting">Greeting Text</label>
          <input type="text" id="greeting" name="greeting" value={formData.greeting} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="resumeFile">Update Resume (PDF, DOC, DOCX)</label>
          <FileInput type="file" id="resumeFile" name="resumeFile" accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeFileChange} />
          {currentResumeUrl && !selectedResumeFile && (
            <p style={{ marginTop: '5px', fontSize: '0.9em' }}>
              Current Resume: <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer">{currentResumeUrl.split('/').pop()}</a>
            </p>
          )}
          {selectedResumeFile && (
            <p style={{ marginTop: '5px', fontSize: '0.9em' }}>New Resume Selected: {selectedResumeFile.name}</p>
          )}
        </FormGroup>
        <FormGroup>
          <label htmlFor="bio">About Me Paragraph (Bio)</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows="5" />
        </FormGroup>
        <FormGroup>
          <label>Tagline Strings (for Typewriter)</label>
          {formData.taglineStrings.map((tagline, index) => (
            <TaglineInputGroup key={index}>
              <input type="text" value={tagline} onChange={(e) => handleTaglineChange(index, e.target.value)} placeholder={`Tagline ${index + 1}`} />
              {formData.taglineStrings.length > 1 && (
                <ActionButton type="button" onClick={() => removeTagline(index)} className="danger">Remove</ActionButton>
              )}
            </TaglineInputGroup>
          ))}
          <ActionButton type="button" onClick={addTagline}>Add Tagline</ActionButton>
        </FormGroup>
        <SubmitButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</SubmitButton>
      </Form>
    </AdminPageContainer>
  );
};

export default AdminAboutPage;