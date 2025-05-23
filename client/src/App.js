import './App.css';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; // Import useLocation

import ProjectsSection from './components/Projects/ProjectsSection'; // Uncomment this
import HeroSection from './components/Hero/HeroSection'; // Uncomment this
import GlobalStyles from './styles/GlobalStyles'; // Uncomment this
import AboutSection from './components/About/AboutSection'; // Import the new AboutSection
import SkillsSection from './components/Skills/SkillsSection'; // Import the new SkillsSection
import ExperienceSection from './components/Experience/ExperienceSection'; // Import the new ExperienceSection
import ContactSection from './components/Contact/ContactSection'; // Import the new ContactSection
import Navbar from './components/Layout/Navbar'; // Import Navbar
import Footer from './components/Layout/Footer'; // Import Footer
import theme from './styles/theme'; // Make sure this is imported

// Import new admin components (will create these next)
import LoginPage from './pages/LoginPage'; // Changed to LoginPage, verify your actual filename
import AdminProjectsPage from './pages/AdminProjectsPage';
import ProjectFormPage from './pages/ProjectFormPage'; // Reverted to likely original name
import AdminAboutPage from './pages/AdminAboutPage'; // Import AdminAboutPage
import AdminContactPage from './pages/AdminContactPage'; // Import AdminContactPage
import AdminLayout from './components/Layout/AdminLayout'; // Import AdminLayout
import PrivateRoute from './components/routing/PrivateRoute'; // Reverted to likely original name
import AdminAddEditExperiencePage from './pages/AdminAddEditExperiencePage'; // Import the new page
import AdminExperienceListPage from './pages/AdminExperienceListPage'; // Import AdminExperienceListPage
import AdminSkillsPage from './pages/AdminSkillsPage'; // Import AdminSkillsPage
import NotFoundPage from './pages/NotFoundPage'; // Import NotFoundPage
import AdminAddEditSkillPage from './pages/AdminAddEditSkillPage'; // Import AdminAddEditSkillPage
import { NotificationProvider } from './contexts/NotificationContext'; // Import NotificationProvider

const AppContainer = styled.div`
  background-color: ${props => props.theme.colors.background}; /* Uncomment this */
  color: ${props => props.theme.colors.text}; /* Uncomment this */
  min-height: 100vh;
  /* text-align: center; Remove or adjust as needed for layout */
  /* padding-top: 50px; Adjust or remove as needed */
`;

// This new component will manage the layout based on the current route
const AppContent = () => {
  const location = useLocation();
  // Show public navbar and footer if not an admin page and not the admin login page
  const showPublicNavbarAndFooter = !location.pathname.startsWith('/admin') || location.pathname === '/admin'; // Show for /admin before redirect

  return (
    <>
      {showPublicNavbarAndFooter && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <AppContainer> {/* Wrap public pages with AppContainer */}
              <HeroSection />
              <AboutSection /> {/* Add AboutSection here */}
              <SkillsSection /> {/* Add SkillsSection here */}
              <ExperienceSection /> {/* Add ExperienceSection here */}
              <ContactSection /> {/* Add ContactSection here */}
              <ProjectsSection /> {/* Add ProjectsSection here */}
              {/* Add other public sections here */}
            </AppContainer>
          } />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Routes - Wrapped by AdminLayout and PrivateRoute */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {/* Default admin page (e.g., projects or a dashboard) */}
            <Route index element={<Navigate to="projects" replace />} /> {/* Redirect /admin to /admin/projects */}
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="about" element={<AdminAboutPage />} />
            <Route path="contact" element={<AdminContactPage />} />
            <Route path="experiences" element={<AdminExperienceListPage />} />
            <Route path="experiences/new" element={<AdminAddEditExperiencePage />} />
            <Route path="experiences/:id/edit" element={<AdminAddEditExperiencePage />} />
            <Route path="skills/:id/edit" element={<AdminAddEditSkillPage />} /> {/* Add edit skill route */}
            <Route path="skills/new" element={<AdminAddEditSkillPage />} /> {/* Add new skill route */}
            <Route path="skills" element={<AdminSkillsPage />} />
            {/* Add other nested admin routes here as children of this /admin route */}
          </Route>

          {/* Catch-all for 404 Not Found */}
          <Route path="*" element={
            <AppContainer> {/* Optionally wrap with AppContainer or a specific Layout */}
              <NotFoundPage />
            </AppContainer>
          } />
        </Routes>
      {showPublicNavbarAndFooter && !location.pathname.startsWith('/admin/') && location.pathname !== '/admin/login' && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <NotificationProvider> {/* Moved NotificationProvider inside ThemeProvider */}
          <GlobalStyles />
          <AppContent /> {/* Use the AppContent component here */}
        {/* NotificationContainer rendered by NotificationProvider will now have theme access */}
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;