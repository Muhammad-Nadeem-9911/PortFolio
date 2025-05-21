import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import { getProjects } from '../../services/projectService';
import { motion } from 'framer-motion';

const SectionWrapper = styled.section`
  padding: 50px 0;
  text-align: center;
`;

const ProjectsGrid = styled.div`
  max-width: 1200px; 
  margin: 0 auto; /* Center the grid */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const SectionHeading = styled.h2`
  color: ${props => props.theme.colors.heading}; /* Or 'inherit' if you prefer */
  margin-bottom: 40px;
  font-weight: 600; /* Or from theme if defined */
`;

const HighlightedText = styled.span`
  color: ${props => props.theme.colors.primaryAccent};
`;

const StatusMessage = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.primaryAccent};
  font-size: 1.2rem;
  margin-top: 40px;
`;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Each child will animate 0.15s after the previous
      delayChildren: 0.2,
    }
  }
};

// Card variants will be defined in ProjectCard.js or passed as props

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with actual API call
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        setProjects(data);

      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to fetch projects.";
        console.error("Failed to fetch projects:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (error) return <StatusMessage>Error: {error}</StatusMessage>;
  // It's good practice to show a loading indicator that matches your theme.
  // You could even replace this with a more sophisticated spinner component later.
  if (loading) return <StatusMessage>Loading projects...</StatusMessage>;

  if (!projects || projects.length === 0) return <StatusMessage>No projects to display yet. Stay tuned!</StatusMessage>;

  return (
    <SectionWrapper id="projects">
      <SectionHeading>
        My Creative <HighlightedText>Work</HighlightedText>
      </SectionHeading>
      <ProjectsGrid
        as={motion.div} // Tell styled-components to render a motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="visible" // Animate when in view
        viewport={{ once: true, amount: 0.2 }} // Trigger once, when 20% is visible
      >
        {projects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => {
              console.log('ProjectCard clicked with data:', project); // Add this console log
              setSelectedProject(project);
            }}
          />
        ))}
      </ProjectsGrid>
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </SectionWrapper>
  );
};

export default ProjectsSection;