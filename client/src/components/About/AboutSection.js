import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // For animations

const AboutSectionContainer = styled(motion.section)`
  padding: 30px 20px 60px 20px; /* Decreased top padding, kept bottom padding */
  background-color: ${props => props.theme.colors.background}; /* Or a slightly different shade if desired */
  color: ${props => props.theme.colors.text};
  text-align: center; /* Center heading, but text can be left-aligned within content */
  
  @media (min-width: 768px) {
    padding: 60px 40px 80px 40px; /* Decreased top padding, kept bottom padding */
  }
`;

const SectionHeading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: ${props => props.theme.colors.heading};
  margin-bottom: 40px;
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

const AboutContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  text-align: left; /* Align paragraph text to the left for readability */
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.secondaryAccent}; /* Slightly muted text for paragraphs */
  }

  strong {
    color: ${props => props.theme.colors.primaryAccent};
    font-weight: 600;
  }
`;

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const AboutSection = () => {
  return (
    <AboutSectionContainer
      id="about" // For navigation
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading>About Me</SectionHeading>
      <AboutContent>
        <p>
          Hello! I'm Nadeem, a passionate and dedicated Full Stack Developer with a knack for creating elegant, efficient, and user-friendly web applications. My journey into the world of code started with a fascination for how websites worked, RealTime Online Class System Project, and I've been hooked ever since.
        </p>
        <p>
          I thrive on turning complex problems into simple, beautiful, and intuitive designs. I have experience working with a range of technologies including <strong>React, Node.js, Express, and MongoDB</strong>, and I'm always eager to learn and adapt to new tools and frameworks. My goal is to build software that not only functions flawlessly but also provides a delightful experience for the end-user.
        </p>
        <p>
          When I'm not coding, you can find me exploring new tech, Playing Cricket Or Watching Cricket. I believe in continuous learning and am always looking for opportunities to grow both personally and professionally.
        </p>
      </AboutContent>
    </AboutSectionContainer>
  );
};

export default AboutSection;