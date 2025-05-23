import React from 'react';
import styled from 'styled-components';
// Ensure Outlet is imported from react-router-dom
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService'; // Assuming this path is correct

const AdminLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;

  h2 {
    color: ${props => props.theme.colors.primaryAccent};
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.5rem;
  }
`;

const AdminNavLink = styled(NavLink)`
  padding: 10px 15px;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 10px;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors.secondaryAccent}30; /* Light hover */
  }

  &.active {
    background-color: ${props => props.theme.colors.primaryAccent};
    color: ${props => props.theme.colors.background}; /* Or a light text color */
  }
`;

const LogoutButton = styled.button`
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  background-color: #e74c3c; /* A distinct delete color */
  color: white;
  transition: opacity 0.2s ease-in-out;
  margin-top: auto; /* Pushes logout button to the bottom */

  &:hover {
    opacity: 0.9;
  }
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto; /* If content is too long */
`;

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  return (
    <AdminLayoutContainer>
      <Sidebar>
        <h2>Admin Panel</h2>
        {/* Ensure these 'to' paths are relative if AdminLayout is under /admin */}
        <AdminNavLink to="projects">Manage Projects</AdminNavLink>
        <AdminNavLink to="about">Manage About Info</AdminNavLink>
        <AdminNavLink to="contact">Manage Contact Info</AdminNavLink>
        <AdminNavLink to="experiences">Manage Experience</AdminNavLink> {/* Add this link */}
        <AdminNavLink to="skills">Manage Skills</AdminNavLink>
        {/* Add links to other admin sections here */}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <ContentArea>
        {/* THIS IS THE CRITICAL PART */}
        <Outlet />
      </ContentArea>
    </AdminLayoutContainer>
  );
};

export default AdminLayout;
