import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // For animations
import { getPublicAboutInfo } from '../../services/portfolioService'; // Import the service

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
    color: ${props => props.theme.colors.text}; /* Use main text color for better visibility */
    white-space: pre-line; /* Respect line breaks from textarea input */
  }

  /* Style for loading/error messages if needed */
  .message {
    text-align: center;
  }

  strong {
    color: ${props => props.theme.colors.primaryAccent};
    font-weight: 600;
  }
`;

const itemVariants = { // Define itemVariants if not already globally available
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicAboutInfo(); // Fetches { greeting, name, taglineStrings, profileImageUrl, bio }
        setAboutData(data);
      } catch (err) {
        console.error("Failed to fetch about info for AboutSection:", err);
        setError(err.message || 'Could not load about information.');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <AboutSectionContainer id="about">
        <SectionHeading>About Me</SectionHeading>
        <AboutContent><p className="message">Loading about information...</p></AboutContent>
      </AboutSectionContainer>
    );
  }

  const bioContent = aboutData?.bio || "Detailed information about me is coming soon. Stay tuned!";
  const displayError = error || (!aboutData && !loading && "About information is currently unavailable.");

  return (
    <AboutSectionContainer
      id="about" // For navigation
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <SectionHeading variants={itemVariants}>About Me</SectionHeading>
      <AboutContent animate="visible"> {/* Add animate="visible" to trigger children animation */}
        {displayError && !aboutData?.bio 
          ? <motion.p className="message" style={{ color: 'red' }} variants={itemVariants}>{displayError}</motion.p>
          : <motion.p variants={itemVariants}>{bioContent}</motion.p>
        }
      </AboutContent>
    </AboutSectionContainer>
  );
};

export default AboutSection;