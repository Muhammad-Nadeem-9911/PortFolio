import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminProjects, deleteAdminProject } from '../services/projectService';
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

const PageHeaderControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px; /* Keep margin for AddProjectLink */
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

const AddProjectLink = styled(Link)`
  display: inline-block;
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.primaryAccent};
  color: ${props => props.theme.colors.background}; /* Dark text on accent */
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProjectListItem = styled.li`
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
  }
`;

const ProjectActions = styled.div`
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
    background-color: #e74c3c; /* A distinct delete color */
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification(); // Use the hook

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects.');
      addNotification(err.message || 'Failed to fetch projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteAdminProject(id);
        setProjects(projects.filter(project => project._id !== id)); // Optimistically update UI
        addNotification('Project deleted successfully!', 'success');
        // Or refetch: fetchProjects();
      } catch (err) {
        addNotification(`Failed to delete project: ${err.response?.data?.error || err.message}`, 'error');
      }
    }
  };

  if (loading) return <AdminPageContainer><h1>Loading projects...</h1></AdminPageContainer>;
  if (error) return <AdminPageContainer><h1>Error: {error}</h1><StyledButton onClick={fetchProjects}>Try Again</StyledButton></AdminPageContainer>;

  return (
    <AdminPageContainer>
      <h1>Admin - Manage Projects</h1>
      <PageHeaderControls> {/* Renamed for clarity, only contains AddProjectLink now */}
        <AddProjectLink to="/admin/projects/new">Add New Project</AddProjectLink>
      </PageHeaderControls>

      {projects.length === 0 ? (
        <p>No projects found. Add your first project!</p>
      ) : (
        <ProjectList>
          {projects.map(project => (
            <ProjectListItem key={project._id}>
              <h3>{project.title}</h3>
              <ProjectActions>
                <Link to={`/admin/projects/${project._id}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
              </ProjectActions>
            </ProjectListItem>
          ))}
        </ProjectList>
      )}
    </AdminPageContainer>
  );
};

export default AdminProjectsPage;