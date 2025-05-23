import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminExperiencesList, deleteAdminExperienceEntry } from '../services/experienceAdminService';

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

const PageHeaderControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  background-color: ${props => props.theme.colors.secondaryAccent};
  color: ${props => props.theme.colors.heading};
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const AddEntryLink = styled(Link)`
  display: inline-block;
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.primaryAccent};
  color: ${props => props.theme.colors.background};
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

const ExperienceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ExperienceListItem = styled.li`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 15px 20px;
  margin-bottom: 15px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h3 {
    margin: 0;
    color: ${props => props.theme.colors.heading};
    font-size: 1.2rem;
  }
  span {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.secondaryAccent};
  }
`;

const ExperienceActions = styled.div`
  a, button {
    margin-left: 10px;
    text-decoration: none;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  a { /* Edit button */
    background-color: ${props => props.theme.colors.secondaryAccent};
    color: ${props => props.theme.colors.heading};
  }
  button { /* Delete button */
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const AdminExperienceListPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminExperiencesList();
      setExperiences(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch experiences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDeleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await deleteAdminExperienceEntry(id);
        setExperiences(prevExperiences => prevExperiences.filter(exp => exp._id !== id));
      } catch (err) {
        alert('Failed to delete experience: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <AdminPageContainer><h1>Loading Experience Entries...</h1></AdminPageContainer>;
  if (error) return <AdminPageContainer><h1>Error: {error}</h1><StyledButton onClick={fetchExperiences}>Try Again</StyledButton></AdminPageContainer>;

  return (
    <AdminPageContainer>
      <h1>Admin - Manage Experience</h1>
      <PageHeaderControls>
        <AddEntryLink to="/admin/experiences/new">Add New Experience</AddEntryLink>
      </PageHeaderControls>

      {experiences.length === 0 ? (
        <p>No experience entries found. Add your first one!</p>
      ) : (
        <ExperienceList>
          {experiences.map(exp => (
            <ExperienceListItem key={exp._id}>
              <div>
                <h3>{exp.role}</h3>
                <span>{exp.company} - {exp.dates}</span>
              </div>
              <ExperienceActions>
                <Link to={`/admin/experiences/${exp._id}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteExperience(exp._id)}>Delete</button>
              </ExperienceActions>
            </ExperienceListItem>
          ))}
        </ExperienceList>
      )}
    </AdminPageContainer>
  );
};

export default AdminExperienceListPage;