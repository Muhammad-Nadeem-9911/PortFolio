import './App.css';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import routing components

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
import LoginPage from './pages/LoginPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import PrivateRoute from './components/routing/PrivateRoute'; // We'll create this


const AppContainer = styled.div`
  background-color: ${props => props.theme.colors.background}; /* Uncomment this */
  color: ${props => props.theme.colors.text}; /* Uncomment this */
  min-height: 100vh;
  /* text-align: center; Remove or adjust as needed for layout */
  /* padding-top: 50px; Adjust or remove as needed */
`;

function App() {
  return (
    <Router> {/* Wrap your app with Router */}
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Navbar /> {/* Add Navbar here, outside of specific page containers for fixed positioning */}
        {/* AppContainer can wrap the Routes or be inside individual pages */}
        {/* For simplicity, let's put it inside pages or use a layout component */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <AppContainer> {/* Wrap public pages with AppContainer */}
              <HeroSection />
              <AboutSection /> {/* Add AboutSection here */}
              <SkillsSection /> {/* Add SkillsSection here */}
              <ExperienceSection /> {/* Add ExperienceSection here */}
              <ContactSection /> {/* Add ContactSection here */}
              <ProjectsSection />
              <Footer /> {/* Add Footer here */}
              {/* Add other public sections here */}
            </AppContainer>
          } />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Private (Admin) Routes */}
          {/* Use PrivateRoute to protect these */}
          <Route path="/admin/projects" element={<PrivateRoute element={<AdminProjectsPage />} />} />
          <Route path="/admin/projects/new" element={<PrivateRoute element={<ProjectFormPage />} />} />
          <Route path="/admin/projects/:id/edit" element={<PrivateRoute element={<ProjectFormPage />} />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;