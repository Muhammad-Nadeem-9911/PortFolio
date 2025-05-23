import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// We'll need to create these service functions and the service file
import { getAdminSkills, deleteAdminSkill, updateAdminSkill } from '../services/skillService'; // Import updateAdminSkill
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification

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

const AddSkillLink = styled(Link)`
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

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillListItem = styled.li`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img { // If you plan to have icons for skills
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
    object-fit: contain;
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
    color: ${props => props.theme.colors.heading};
  }

  p { // For skill level or category
    font-size: 0.9rem;
    color: ${props => props.theme.colors.secondaryAccent};
    margin-bottom: 15px;
  }

  .visibility-status {
    font-size: 0.8rem;
    font-style: italic;
    /* Style based on the $isPublic prop of the SkillListItem */
    color: ${props => props.$isPublic ? props.theme.colors.primaryAccent : props.theme.colors.text + '99'};
    margin-top: 5px;
  }
`;

const SkillActions = styled.div`
  margin-top: auto; // Pushes actions to the bottom if content above varies
  width: 100%;
  display: flex;
  justify-content: space-around; // Or 'flex-end' with margin-left on buttons
  flex-wrap: wrap; /* Allow buttons to wrap on smaller item cards */
  button, a {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    margin-top: 5px; /* Add some space if they wrap */
  }

  a { /* Edit button */
    background-color: ${props => props.theme.colors.secondaryAccent};
    color: ${props => props.theme.colors.heading};
  }

  button { /* Delete button */
    background-color: #e74c3c; /* A distinct delete color */
    color: white;
  }

  .toggle-visibility-btn {
    /* Style based on the $isPublic prop of the SkillActions component */
    background-color: ${props => props.$isPublic ? (props.theme.colors.warning || '#f39c12') : (props.theme.colors.success || '#2ecc71')};
    color: white;
  }
`;


const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminSkills();
      setSkills(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch skills.';
      setError(errorMessage); // Keep local error state
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]); // addNotification is stable from context, so this is fine


  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteAdminSkill(id);
        setSkills(skills.filter(skill => skill._id !== id));
        addNotification('Skill deleted successfully!', 'success');
      } catch (err) {
        addNotification(`Failed to delete skill: ${err.response?.data?.message || err.message}`, 'error'); // Use message from backend if available
      }
    }
  };

  const handleToggleVisibility = async (skillId, currentIsPublic) => {
    const newIsPublicStatus = !currentIsPublic;
    try {
      await updateAdminSkill(skillId, { isPublic: newIsPublicStatus });
      setSkills(prevSkills =>
        prevSkills.map(s =>
          s._id === skillId ? { ...s, isPublic: newIsPublicStatus } : s
        )
      );
      addNotification(
        `Skill visibility updated to ${newIsPublicStatus ? 'Public' : 'Hidden'}.`,
        'success'
      );
    } catch (err) {
      addNotification(
        `Failed to update skill visibility: ${err.response?.data?.message || err.message}`,
        'error'
      );
    }
  };
  if (loading) return <AdminPageContainer><h1>Loading skills...</h1></AdminPageContainer>;
  // Keep error display simple, notification will also show
  if (error && !skills.length) return <AdminPageContainer><h1>Error loading skills. Check console.</h1></AdminPageContainer>;

  return (
    <AdminPageContainer>
      <h1>Admin - Manage Skills</h1>
      <PageHeaderControls>
        <AddSkillLink to="/admin/skills/new">Add New Skill</AddSkillLink>
      </PageHeaderControls>

      {skills.length === 0 && !loading ? (
        <p style={{textAlign: 'center'}}>No skills found. Add your first skill!</p>
      ) : (
        <SkillList>
          {skills.map(skill => {
            // Log each skill's isPublic status during render
            // console.log(`Rendering skill: ${skill.name}, isPublic: ${skill.isPublic}, type: ${typeof skill.isPublic}`);
            
            // Determine the effective isPublic status, defaulting to true if not a boolean
            // This ensures consistency for display logic and prop passing.
            const effectiveIsPublic = typeof skill.isPublic === 'boolean' ? skill.isPublic : true;

            return (
              <SkillListItem key={skill._id} $isPublic={effectiveIsPublic}> {/* Use $isPublic */}
                {skill.iconUrl && <img src={skill.iconUrl} alt={`${skill.name} icon`} />}
                <h3>{skill.name || 'Unnamed Skill'}</h3>
                {skill.level && <p>Level: {skill.level}</p>}
                <span className="visibility-status"> {/* Removed isPublic prop from span */}
                  {/* Display status directly based on skill.isPublic, defaulting to true if not boolean */}
                  {effectiveIsPublic ? 'Public' : 'Hidden'}
                </span>
                <SkillActions $isPublic={effectiveIsPublic}> {/* Use $isPublic for styled component */}
                  <Link to={`/admin/skills/${skill._id}/edit`}>Edit</Link>
                  <button onClick={() => handleDeleteSkill(skill._id)}>Delete</button>
                  <button
                    className="toggle-visibility-btn" // isPublic prop is passed to SkillActions styled component
                    onClick={() => handleToggleVisibility(skill._id, effectiveIsPublic)}
                  >
                    {/* Text directly based on skill.isPublic, defaulting to true if not boolean */}
                    {effectiveIsPublic ? 'Make Hidden' : 'Make Public'}
                  </button>
                </SkillActions>
              </SkillListItem>
            );
          })}
        </SkillList>
      )}
    </AdminPageContainer>
  );
};

export default AdminSkillsPage;
