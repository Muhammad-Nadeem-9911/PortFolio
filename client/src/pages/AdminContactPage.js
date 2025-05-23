import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Link removed as nav is in layout
import { getAdminContactInfo, updateAdminContactInfo } from '../services/contactService';
import { useNotification } from '../contexts/NotificationContext'; // Import the hook

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
  input[type="email"],
  textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.secondaryAccent}80; // Semi-transparent border
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primaryAccent};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryAccent}40;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const SocialLinkInputGroup = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.secondaryAccent}30;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  input { margin-bottom: 5px; }
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
  color: ${props => props.theme.colors.background}; /* Or a contrasting text color */
  transition: opacity 0.2s ease-in-out;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdminContactPage = () => {
  const [contactInfo, setContactInfo] = useState({ introText: '', email: '', socialLinks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification(); // Use the hook

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const data = await getAdminContactInfo();
        setContactInfo(data || { introText: '', email: '', socialLinks: [] }); // Ensure defaults if data is null/undefined
      } catch (err) {
        setError(err.message || 'Failed to load contact information.');
        addNotification(err.message || 'Failed to load contact information.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...contactInfo.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setContactInfo(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const addSocialLink = () => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', label: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    setContactInfo(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateAdminContactInfo(contactInfo);
      addNotification('Contact information updated successfully!', 'success');
      // Optionally, navigate away or show a success message
    } catch (err) {
      setError(err.message || 'Failed to update contact information.');
      addNotification(err.message || 'Failed to update contact information.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminPageContainer><h1>Loading Contact Information...</h1></AdminPageContainer>;
  if (error && !loading) return <AdminPageContainer><h1>Error: {error}</h1></AdminPageContainer>;

  return (
    <AdminPageContainer>
      <h1>Admin - Manage Contact Information</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="introText">Intro Text</label>
          <textarea id="introText" name="introText" value={contactInfo.introText} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={contactInfo.email} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <label>Social Links</label>
          {contactInfo.socialLinks.map((link, index) => (
            <SocialLinkInputGroup key={index}>
              <input type="text" placeholder="Platform (e.g., GitHub)" value={link.platform} onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} />
              <input type="text" placeholder="URL" value={link.url} onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} />
              <input type="text" placeholder="Label (Optional)" value={link.label || ''} onChange={(e) => handleSocialLinkChange(index, 'label', e.target.value)} />
              <ActionButton type="button" onClick={() => removeSocialLink(index)} className="danger">Remove</ActionButton>
            </SocialLinkInputGroup>
          ))}
          <ActionButton type="button" onClick={addSocialLink}>Add Social Link</ActionButton>
        </FormGroup>
        <SubmitButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</SubmitButton>
      </Form>
    </AdminPageContainer>
  );
};

export default AdminContactPage;