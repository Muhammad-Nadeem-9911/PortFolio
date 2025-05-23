import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// Example icons (install react-icons: npm install react-icons)
import { FaReact, FaNodeJs, FaDatabase, FaHtml5, FaCss3Alt, FaJsSquare, FaGitAlt, FaPython, FaJava, FaDocker, FaAws } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiStyledcomponents, SiTypescript, SiGraphql, SiKubernetes, SiDotnet } from 'react-icons/si'; // Removed SiCsharp for now
import { getPublicSkills } from '../../services/skillService'; // Import the public service function

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
  
  /* Target SkillLevel on hover of SkillItem */
  &:hover .skill-level-tag {
    opacity: 1;
    transform: translateY(0); /* Bring to final vertical position */
  }

  /* Explicit visibility for debugging */
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important; /* Ensure it's not display:none */

  img, .skill-icon-placeholder, svg {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important; /* Or inline-block, ensure it's not none */
  }

  img { 
    width: 48px; /* Adjusted to be closer to 3rem visual size */
    height: 48px;
    object-fit: contain;
    margin-bottom: 15px;
  }

  .skill-icon-placeholder { 
    margin-bottom: 15px;
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

const SkillLevel = styled.span`
  font-size: 0.75rem; /* Slightly smaller for a tag */
  font-weight: 500;
  padding: 4px 10px; /* Padding for the tag */
  border-radius: 12px; /* Pill shape */
  background-color: ${props => props.theme.colors.primaryAccent + '30'}; /* Slightly more opaque accent */
  color: ${props => props.theme.colors.secondaryAccent};
  margin-top: 8px; /* Space from the skill name */
  display: inline-block; /* Allows padding and border-radius to apply correctly */
  text-transform: capitalize; /* e.g., 'Intermediate' */
  opacity: 0; /* Initially hidden */
  transform: translateY(10px); /* Start slightly lower for upward animation */
  transition: opacity 0.3s ease-out, transform 0.3s ease-out; /* Smooth animation */
  /* Removed absolute positioning to keep it in flow */
`;

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5 
    } 
  }
};

// Helper function to get icon component based on skill name
const getSkillIcon = (skillName) => {
  if (!skillName) return null;
  const name = skillName.toLowerCase();

  // Prioritize exact matches or strong indicators
  if (name.includes('react')) return <FaReact />;
  if (name.includes('node') || name.includes('nodejs')) return <FaNodeJs />;
  if (name.includes('express')) return <SiExpress />;
  if (name.includes('mongo') || name.includes('mongodb')) return <SiMongodb />;
  if (name.includes('javascript') || name === 'js') return <FaJsSquare />;
  if (name.includes('typescript') || name === 'ts') return <SiTypescript />;
  if (name.includes('html')) return <FaHtml5 />;
  if (name.includes('css')) return <FaCss3Alt />;
  if (name.includes('styled-components') || name.includes('styled components')) return <SiStyledcomponents />;
  if (name.includes('git')) return <FaGitAlt />;
  if (name.includes('python')) return <FaPython />;
  if (name.includes('java')) return <FaJava />;
  // if (name.includes('c#') || name.includes('csharp')) return <SiCsharp />; // Temporarily commented out
  if (name.includes('.net') || name.includes('dotnet') || name.includes('c#') || name.includes('csharp')) return <SiDotnet />; // Group C# with .NET for now
  if (name.includes('sql') || name.includes('database')) return <FaDatabase />; // Generic database
  if (name.includes('docker')) return <FaDocker />;
  if (name.includes('kubernetes') || name.includes('k8s')) return <SiKubernetes />;
  if (name.includes('aws')) return <FaAws />;
  if (name.includes('graphql')) return <SiGraphql />;
  // Add more mappings as needed
  return null; // Or a generic <FaTools />
};

// const skillsData = [
//   { name: 'HTML5', icon: <FaHtml5 /> },
//   { name: 'CSS3', icon: <FaCss3Alt /> },
//   { name: 'JavaScript', icon: <FaJsSquare /> },
//   { name: 'React', icon: <FaReact /> },
//   { name: 'Node.js', icon: <FaNodeJs /> },
//   { name: 'Express.js', icon: <SiExpress /> },
//   { name: 'MongoDB', icon: <SiMongodb /> },
//   { name: 'Git', icon: <FaGitAlt /> },
//   // Add more skills here
// ];

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicSkills();
        setSkills(data || []); // Ensure skills is an array
      } catch (err) {
        setError(err.message || 'Could not load skills.');
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  if (loading) {
    return (
      <SkillsSectionContainer id="skills">
        <SectionHeading>Loading Skills...</SectionHeading>
      </SkillsSectionContainer>
    );
  }

  if (error) {
    return (
      <SkillsSectionContainer id="skills">
        <SectionHeading>My Skills</SectionHeading>
        <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>
      </SkillsSectionContainer>
    );
  }

  return (
    <SkillsSectionContainer
      id="skills" // For navigation
      variants={sectionVariants}
      initial="hidden"
      animate="visible" // Force animation to visible on mount for testing
      // whileInView="visible" // Temporarily disable whileInView
    >
      <SectionHeading variants={itemVariants}>My Skills</SectionHeading>
      <SkillsGrid
        // Removed animation props from SkillsGrid to match reference.
        // Animations are handled by SkillsSectionContainer (whileInView)
        // and SkillItem (variants).
      >
        {skills.length === 0 && !loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No skills to display at the moment.</p>
        ) : (
          skills.map((skill) => (
          <SkillItem
            key={skill._id || skill.name} // Use _id from DB if available
            variants={itemVariants} // Re-add itemVariants for animation
          >
            {skill.iconUrl ? ( // Priority 1: Explicit iconUrl // Removed console.warn from onError for general cleanup
              <img src={skill.iconUrl} alt={`${skill.name} icon`} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling?.classList?.remove('skill-icon-placeholder-hidden'); }} />
            ) : ( // Priority 2: Dynamic react-icon
              getSkillIcon(skill.name) || (
                // Fallback: If no iconUrl and no matching react-icon
                <div 
                  className="skill-icon-placeholder" 
                  style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey', fontSize: '2rem' }}
                >
                  ?
                </div>)
            )}
            <p>{skill.name}</p>
            {skill.level && (
              <SkillLevel className="skill-level-tag"> {/* Added className for hover targeting */}
                {skill.level}
              </SkillLevel>
            )}
          </SkillItem>
          )) // Closes the .map() call and its implicit return
        )} {/* Closes the ternary operator's 'else' block */}
      </SkillsGrid>
    </SkillsSectionContainer>
  );
};

export default SkillsSection;