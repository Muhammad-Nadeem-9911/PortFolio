import React from 'react';
import styled from 'styled-components';
import { X } from 'react-feather'; // Example icon library
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background}; // Use theme
  color: ${props => props.theme.colors.text}; // Use theme
  padding: 30px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  /* Styling for react-slick dots */
  .slick-dots li button:before {
    font-size: 10px;
    color: ${props => props.theme.colors.primaryAccent};
  }
  .slick-dots li.slick-active button:before {
    color: ${props => props.theme.colors.primaryAccent};
    opacity: 1;
  }
  .slick-prev:before, .slick-next:before {
    color: ${props => props.theme.colors.primaryAccent};
    font-size: 24px;
  }

  h2, h4 { color: ${props => props.theme.colors.heading}; }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primaryAccent}; // Use theme
  cursor: pointer;
  font-size: 1.5rem;
`;

const Screenshot = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 10px;
`;
const LinksContainer = styled.div`
  margin-top: 20px;
  a {
    color: ${props => props.theme.colors.primaryAccent};
    margin-right: 20px;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.secondaryAccent};
  margin-bottom: 20px;
`;

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;
  console.log('Modal Project Screenshots:', project.screenshots); // Add this line

  const sliderSettings = {
    dots: true,
    infinite: project.screenshots && project.screenshots.length > 1, // Only infinite if more than 1 screenshot
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // Adjusts slider height to current slide
    arrows: project.screenshots && project.screenshots.length > 1, // Show arrows if more than 1 screenshot
  };

  return (
    <ModalOverlay onClick={onClose}> {/* Close on overlay click */}
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside modal */}
        <CloseButton onClick={onClose}><X size={28} /></CloseButton>
        <h2>{project.title}</h2>
        <ProjectDescription>{project.description}</ProjectDescription>

        {project.screenshots && project.screenshots.length > 0 ? (
          <Slider {...sliderSettings}>
            {project.screenshots && project.screenshots.map((ss, index) => (
                <div key={index}><Screenshot src={ss} alt={`${project.title} screenshot ${index + 1}`} /></div>
            ))}
          </Slider>
        ) : (
          <p>No screenshots available for this project.</p>
        )}

        <h4>Technologies:</h4>
        <p>{project.technologies.join(', ')}</p>
        <LinksContainer>
          {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer">View Live Project</a>}
          {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">View Code</a>}
        </LinksContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProjectDetailModal;