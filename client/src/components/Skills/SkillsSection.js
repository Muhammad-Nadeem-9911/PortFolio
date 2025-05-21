import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// Example icons (install react-icons: npm install react-icons)
import { FaReact, FaNodeJs, FaDatabase, FaTools, FaHtml5, FaCss3Alt, FaJsSquare, FaGitAlt } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiStyledcomponents } from 'react-icons/si';

const SkillsSectionContainer = styled(motion.section)`
  padding: 40px 20px 60px 20px; /* Decreased top padding, kept bottom padding */
  background-color: ${props => props.theme.colors.cardBackground}; /* Slightly different background for contrast */
  color: ${props => props.theme.colors.text};
  text-align: center;

  @media (min-width: 768px) {
    padding: 60px 40px 80px 40px; /* Decreased top padding, kept bottom padding */
  }
`;

const SectionHeading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: ${props => props.theme.colors.heading};
  margin-bottom: 50px;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: ${props => props.theme.colors.primaryAccent};
    border-radius: 2px;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 40px;
  }
`;

const SkillItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(100, 255, 218, 0.2);
  }

  svg {
    font-size: 3rem; /* Adjust icon size */
    color: ${props => props.theme.colors.primaryAccent};
    margin-bottom: 15px;
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.colors.text};
    font-weight: 500;
    margin: 0;
  }
`;

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const skillsData = [
  { name: 'HTML5', icon: <FaHtml5 /> },
  { name: 'CSS3', icon: <FaCss3Alt /> },
  { name: 'JavaScript', icon: <FaJsSquare /> },
  { name: 'React', icon: <FaReact /> },
  { name: 'Node.js', icon: <FaNodeJs /> },
  { name: 'Express.js', icon: <SiExpress /> },
  { name: 'MongoDB', icon: <SiMongodb /> },
  { name: 'Git', icon: <FaGitAlt /> },
  // Add more skills here
];

const SkillsSection = () => {
  return (
    <SkillsSectionContainer
      id="skills" // For navigation
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading variants={itemVariants}>My Skills</SectionHeading>
      <SkillsGrid>
        {skillsData.map((skill, index) => (
          <SkillItem key={index} variants={itemVariants}>
            {skill.icon}
            <p>{skill.name}</p>
          </SkillItem>
        ))}
      </SkillsGrid>
    </SkillsSectionContainer>
  );
};

export default SkillsSection;