import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createAdminSkill,
  getAdminSkillById,
  updateAdminSkill
} from '../services/skillService'; // Import skill service functions
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
  max-width: 600px;
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
  select {
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

const AdminAddEditSkillPage = () => {
  const { id } = useParams(); // Get ID from URL for editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate', // Default level
    order: 0,
    // isPublic is no longer managed by this form
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification(); // Use the hook

  useEffect(() => {
    if (isEditMode) {
      const fetchSkill = async () => {
        setLoading(true);
        try {
          const data = await getAdminSkillById(id);
          setFormData({
            name: data.name || '',
            level: data.level || 'Intermediate',
            order: data.order !== undefined ? data.order : 0,
            // isPublic: data.isPublic !== undefined ? data.isPublic : true, // Not needed here anymore
          });
        } catch (err) {
          const fetchError = err.message || 'Failed to fetch skill details.';
          setError(fetchError);
          addNotification(fetchError, 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchSkill();
    }
  }, [id, isEditMode, addNotification]); // Add addNotification to dependency array

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      // Removed checkbox logic as isPublic is handled elsewhere
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Prepare payload without isPublic, as it's handled by a separate toggle
    const payload = { ...formData };
    delete payload.isPublic; // Ensure isPublic is not sent from this form

    try {
      if (isEditMode) {
        await updateAdminSkill(id, payload); // Send payload without isPublic
        addNotification('Skill updated successfully!', 'success');
      } else {
        await createAdminSkill(payload); // Send payload without isPublic
        addNotification('Skill created successfully!', 'success');
      }
      navigate('/admin/skills'); // Navigate back to the list page
    } catch (err) { // Catch the error object
      // Check for specific backend error message (in 'error' field) first, then generic message (in 'message' field), then fallback
      const submitError = err.response?.data?.error || err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} skill.`;
      setError(submitError);
      addNotification(submitError, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEditMode) return <AdminFormPageContainer><h1>Loading Skill Details...</h1></AdminFormPageContainer>;

  return (
    <AdminFormPageContainer>
      <BackLink to="/admin/skills">← Back to Skills List</BackLink>
      <h1>{isEditMode ? 'Edit Skill' : 'Add New Skill'}</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="name">Skill Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <label htmlFor="level">Level</label>
          <select id="level" name="level" value={formData.level} onChange={handleChange} required>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </FormGroup>
        <FormGroup>
          <label htmlFor="order">Order (for sorting, lower numbers first)</label>
          <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} />
        </FormGroup>
        <SubmitButton type="submit" disabled={saving}>
          {saving ? 'Saving...' : (isEditMode ? 'Update Skill' : 'Create Skill')}
        </SubmitButton>
      </Form>
    </AdminFormPageContainer>
  );
};

export default AdminAddEditSkillPage;