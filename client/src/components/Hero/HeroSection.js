import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Import motion
import Typewriter from 'typewriter-effect';
import { getPublicAboutInfo } from '../../services/portfolioService'; // Import the service

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column; /* Default to column on small screens */
  justify-content: center;
  align-items: flex-start; /* Align text to the left */
  min-height: 80vh; /* Adjust as needed */
  padding: 120px 10% 50px 10%; /* Increased top padding to 150px */
  gap: 50px; /* Space between text and image */
  position: relative; /* Needed for absolute positioning if you go that route */
  text-align: left;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    margin-top: 100px;
    padding: 15% 5%;
  }

  @media (min-width: 992px) { /* Adjust breakpoint as needed */
    flex-direction: row; /* Row layout on larger screens */
    justify-content: space-between; /* Space out text and image */
    align-items: center; /* Vertically center items */
  }
`;

const Greeting = styled.p`
  color: ${props => props.theme.colors.primaryAccent};
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Name = styled.h1`
  font-size: clamp(40px, 8vw, 80px); /* Responsive font size */
  color: ${props => props.theme.colors.heading};
  margin-bottom: 5px;
`;

const Tagline = styled.h2`
  font-size: clamp(20px, 5vw, 40px);
  color: ${props => props.theme.colors.secondaryAccent};
  margin-bottom: 20px;
`;

const TextContent = styled(motion.div)`
  flex: 1; /* Allow text content to take available space */
  max-width: 600px; /* Optional: limit text width */

  @media (max-width: 991px) {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled(motion.div)`
  flex: 1; /* Allow image container to take available space */
  display: flex;
  justify-content: center; /* Center image within its container */
  align-items: center;
  max-width: 300px; /* Max width for the image container */
  margin: 0 auto; /* Center on small screens */
  position: relative;
  overflow: visible; /* Allow orbiting element to go outside bounds */
  aspect-ratio: 1 / 1; /* Give it a fixed aspect ratio */
  width: 100%; /* Ensure it takes max width up to max-width */
`;

const StyledImage = styled(motion.img)`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  position: relative; /* To be above the ::before pseudo-element if it's a background */
  z-index: 1;
  box-shadow: 0 10px 30px -15px rgba(2,12,27,0.7); /* Example shadow */
`;

const OrbitingEffect = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250px; /* Size of the orbiting path/element */
  height: 250px; /* Should be same as width for circular path */
  margin-top: -125px; /* Center vertically */
  margin-left: -125px; /* Center horizontally */
  border-radius: 50%; /* Make it circular */
  z-index: 0; /* Behind the image */
  border: 2px dashed ${props => props.theme.colors.primaryAccent}; /* Example: dashed line */
  opacity: 0; /* Start hidden */

  /* Optional: Add a glowing effect */
  box-shadow: 0 0 20px ${props => props.theme.colors.primaryAccent}80;
`;

// Animation variants for the image and its container/effects
// Text content animation remains the same

// Animation variants for the image and its container/effects
const imageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.7, duration: 0.5 } // Container visible
  }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 }, // Simple fade/scale in
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut", delay: 1 } // Image animates after container
  }
};

// Animation variants for the orbiting effect
const orbitVariants = {
  hidden: { opacity: 0, rotate: 0 }, // Start hidden, no rotation
  visible: {
    opacity: [0, 1, 1, 0], // Fade in, stay visible, fade out
    rotate: 360, // Rotate a full circle
    transition: {
      duration: 3, // Duration of one orbit cycle
      ease: "linear", // Constant speed
      delay: 1.8, // Start after image appears
      repeat: Infinity, // Repeat forever
      repeatDelay: 5 // Wait 5 seconds before repeating
    }
  }
};

const HeroSection = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicAboutInfo();
        setAboutInfo(data);
      } catch (err) {
        setError(err.message || 'Could not load hero information.');
        console.error("Failed to fetch about info:", err);
        // Set default fallbacks if API fails and you want to show something
        setAboutInfo({
          greeting: 'Hi, my name is',
          name: 'M~Nadeem',
          taglineStrings: ["I build things for the web.", "I'm a Full Stack Developer."],
          profileImageUrl: '/Profile.png'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <HeroContainer id="hero">
        <TextContent><Name>Loading...</Name></TextContent>
      </HeroContainer>
    );
  }

  // Use default/fallback data if aboutInfo is not fully populated after loading/error
  const displayInfo = {
    greeting: aboutInfo?.greeting || 'Hi, my name is',
    name: aboutInfo?.name || 'M~Nadeem',
    taglineStrings: aboutInfo?.taglineStrings && aboutInfo.taglineStrings.length > 0
      ? aboutInfo.taglineStrings
      : ["I build things for the web.", "I'm a Full Stack Developer."],
    profileImageUrl: aboutInfo?.profileImageUrl || '/Profile.png'
  };

  return (
    <HeroContainer id="hero">
      <TextContent
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <Greeting>{displayInfo.greeting}</Greeting>
        <Name>{displayInfo.name}</Name>
        <Tagline>
          <Typewriter
            options={{
              strings: displayInfo.taglineStrings,
              autoStart: true,
              loop: true,
              delay: 75,
              deleteSpeed: 50,
            }}
          />
        </Tagline>
      </TextContent>

      <ImageContainer
        initial={{ opacity: 0, scale: 0.8 }} // Initial state for the container itself
        animate={{ opacity: 1, scale: 1 }} // Animate container in
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} // Container animation timing
      >
        <OrbitingEffect variants={orbitVariants} initial="hidden" animate="visible" /> {/* The orbiting element */}
        <StyledImage src={displayInfo.profileImageUrl} alt={displayInfo.name} variants={imageVariants} initial="hidden" animate="visible" /> {/* The image */}
      </ImageContainer>
    </HeroContainer>
  );
};

export default HeroSection;