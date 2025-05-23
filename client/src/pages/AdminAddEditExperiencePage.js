import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createAdminExperienceEntry,
  getAdminExperienceDetails,
  updateAdminExperienceEntry
} from '../services/experienceAdminService';
import { useNotification } from '../contexts/NotificationContext'; // Import the hook
const AdminFormPageContainer = styled.div`
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
  input[type="number"],
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
  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const DescriptionInputGroup = styled.div`
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
  margin-top: 10px;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primaryAccent};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const AdminAddEditExperiencePage = () => {
  const { id } = useParams(); // Get ID from URL for editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    dates: '',
    description: [''], // Start with one empty description point
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification(); // Use the hook

  useEffect(() => {
    if (isEditMode) {
      const fetchExperience = async () => {
        setLoading(true);
        try {
          const data = await getAdminExperienceDetails(id);
          setFormData({
            role: data.role || '',
            company: data.company || '',
            dates: data.dates || '',
            description: Array.isArray(data.description) && data.description.length > 0 ? data.description : [''],
            order: data.order !== undefined ? data.order : 0,
          });
        } catch (err) {
          const fetchError = err.message || 'Failed to fetch experience details.';
          setError(fetchError);
          addNotification(fetchError, 'error'); // Notify user on fetch error
        } finally {
          setLoading(false);
        }
      };
      fetchExperience();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData(prev => ({ ...prev, description: newDescription }));
  };

  const addDescriptionPoint = () => {
    setFormData(prev => ({ ...prev, description: [...prev.description, ''] }));
  };

  const removeDescriptionPoint = (index) => {
    if (formData.description.length <= 1) return; // Keep at least one
    setFormData(prev => ({
      ...prev,
      description: formData.description.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // Filter out empty description points before saving
    const payload = {
      ...formData,
      description: formData.description.filter(point => point.trim() !== ''),
    };

    try {
      if (isEditMode) {
        await updateAdminExperienceEntry(id, payload);
        addNotification('Experience updated successfully!', 'success');
      } else {
        await createAdminExperienceEntry(payload);
        addNotification('Experience created successfully!', 'success');
      }
      navigate('/admin/experiences');
    } catch (err) {
      const submitError = err.message || `Failed to ${isEditMode ? 'update' : 'create'} experience.`;
      setError(submitError);
      addNotification(submitError, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEditMode) return <AdminFormPageContainer><h1>Loading Experience Details...</h1></AdminFormPageContainer>;

  return (
    <AdminFormPageContainer>
      <BackLink to="/admin/experiences">← Back to Experience List</BackLink>
      <h1>{isEditMode ? 'Edit Experience' : 'Add New Experience'}</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="role">Role/Title</label>
          <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="company">Company/Institution</label>
          <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="dates">Dates (e.g., March 2022 - Present)</label>
          <input type="text" id="dates" name="dates" value={formData.dates} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label>Description Points</label>
          {formData.description.map((point, index) => (
            <DescriptionInputGroup key={index}>
              <input type="text" value={point} onChange={(e) => handleDescriptionChange(index, e.target.value)} placeholder={`Point ${index + 1}`} />
              {formData.description.length > 1 && (
                <ActionButton type="button" onClick={() => removeDescriptionPoint(index)} className="danger">Remove</ActionButton>
              )}
            </DescriptionInputGroup>
          ))}
          <ActionButton type="button" onClick={addDescriptionPoint}>Add Description Point</ActionButton>
        </FormGroup>
        <FormGroup>
          <label htmlFor="order">Order (for sorting, lower numbers first)</label>
          <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} />
        </FormGroup>
        <SubmitButton type="submit" disabled={saving}>
          {saving ? 'Saving...' : (isEditMode ? 'Update Experience' : 'Create Experience')}
        </SubmitButton>
      </Form>
    </AdminFormPageContainer>
  );
};

export default AdminAddEditExperiencePage;