import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardWrapper = styled(motion.div)` // Directly use motion.div
  background: ${props => props.theme.colors.cardBackground || '#112240'};
  border-radius: 8px;
  padding: 20px;
  /* margin: 15px; */ // Rely on grid gap from parent
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  cursor: pointer;
  color: ${props => props.theme.colors.text};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(100, 255, 218, 0.3); // Accent color shadow
  }

  img {
    width: 100%;
    /* height: 200px; */ // Replaced with aspect-ratio
    aspect-ratio: 16 / 9; // Or your preferred aspect ratio, e.g., 4 / 3
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  h3 { color: ${props => props.theme.colors.primaryAccent}; margin-bottom: 10px; }
  p { font-size: 0.9rem; line-height: 1.5; }
`;

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 10 }
  }
};

const ProjectCard = ({ project, onClick }) => {
  return (
    <CardWrapper
      onClick={onClick}
      variants={cardVariants}
      // initial, animate, or whileInView will be controlled by the parent ProjectsGrid
      // if ProjectsGrid staggers its children.
    >
      {project.screenshots && project.screenshots.length > 0 && <img src={project.screenshots[0]} alt={`${project.title} main screenshot`} />}
      <h3>{project.title}</h3>
      <p>{project.description.substring(0, 100)}...</p> {/* Short description */}
    </CardWrapper>
  );
};

export default ProjectCard;