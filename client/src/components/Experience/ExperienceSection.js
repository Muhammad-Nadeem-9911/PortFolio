import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ExperienceSectionContainer = styled(motion.section)`
  padding: 60px 20px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  text-align: center;

  @media (min-width: 768px) {
    padding: 80px 40px;
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

const ExperienceList = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
`;

const ExperienceItem = styled(motion.div)`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-left: 5px solid ${props => props.theme.colors.primaryAccent};

  h3 {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.heading};
    margin-bottom: 5px;
  }

  h4 {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.primaryAccent};
    margin-bottom: 10px;
    font-weight: 500;
  }

  p.dates {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.secondaryAccent};
    margin-bottom: 15px;
    font-style: italic;
  }

  ul {
    list-style: disc;
    margin-left: 20px;
    padding-left: 0;
    color: ${props => props.theme.colors.text};
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
`;

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const experienceData = [
  {
    role: 'Full Stack Developer',
    company: 'Tech Solutions Inc.',
    dates: 'Jan 2022 - Present',
    description: [
      'Developed and maintained web applications using React, Node.js, and Express.',
      'Collaborated with cross-functional teams to define, design, and ship new features.',
      'Implemented responsive UIs and ensured application scalability.',
    ],
  },
  // Add more experiences (work, education) here
];

const ExperienceSection = () => {
  return (
    <ExperienceSectionContainer id="experience" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
      <SectionHeading variants={itemVariants}>My Journey</SectionHeading>
      <ExperienceList>
        {experienceData.map((exp, index) => (
          <ExperienceItem key={index} variants={itemVariants}>
            <h3>{exp.role}</h3>
            <h4>{exp.company}</h4>
            <p className="dates">{exp.dates}</p>
            <ul>
              {exp.description.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </ExperienceItem>
        ))}
      </ExperienceList>
    </ExperienceSectionContainer>
  );
};

export default ExperienceSection;