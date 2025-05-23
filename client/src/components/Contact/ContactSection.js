import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// Example icons for social links (install react-icons)
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'; // Feather icons
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'; // Font Awesome icons
import { getPublicContactInfo } from '../../services/portfolioService'; // Import the service

const ContactSectionContainer = styled(motion.section)`
  padding: 60px 20px;
  background-color: ${props => props.theme.colors.cardBackground}; /* Use a contrasting background */
  color: ${props => props.theme.colors.text};
  text-align: center;

  @media (min-width: 768px) {
    padding: 80px 40px;
  }
`;

const SectionHeading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: ${props => props.theme.colors.heading};
  margin-bottom: 20px;
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

const ContactContent = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.secondaryAccent};
  margin-bottom: 40px;
`;

const EmailLink = styled(motion.a)`
  display: inline-block;
  margin-top: 20px;
  padding: 15px 25px;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primaryAccent};
  border: 2px solid ${props => props.theme.colors.primaryAccent};
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primaryAccent}1A; /* Subtle background on hover */
    color: ${props => props.theme.colors.primaryAccent};
  }
`;

const SocialLinksContainer = styled(motion.div)`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 25px;

  a {
    color: ${props => props.theme.colors.secondaryAccent};
    font-size: 2rem;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.primaryAccent};
    }
  }
`;

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Helper to map platform name to an icon component
const getSocialIcon = (platform) => {
  switch (platform?.toLowerCase()) { // Added optional chaining for safety
    case 'github':
      return <FiGithub />;
    case 'linkedin':
      return <FiLinkedin />;
    case 'whatsapp':
      return <FaWhatsapp />;
    case 'twitter': // or 'x'
      return <FiTwitter />;
    case 'instagram':
      return <FaInstagram />;
    case 'mail': // If you want a mail icon in social links too
      return <FiMail />
    default:
      return null; // Or a default icon
  }
};

const ContactSection = () => {
  const [contactInfo, setContactInfo] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on new fetch
        const data = await getPublicContactInfo();
        setContactInfo(data);
      } catch (err) {
        setError(err.message || 'Could not load contact information.');
        console.error("Failed to fetch contact info:", err);
        // Optionally, set default data here if API fails and you want fallbacks
        // setContactInfo({
        //   introText: "Default intro text on error.",
        //   email: 'default@example.com',
        //   socialLinks: []
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <ContactSectionContainer id="contact" variants={sectionVariants} initial="hidden" animate="visible"><SectionHeading variants={itemVariants}>Loading...</SectionHeading></ContactSectionContainer>
    );
  }

  // Handle error or no data after loading
  if (error || !contactInfo) {
    return (
      <ContactSectionContainer id="contact" variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeading variants={itemVariants}>Get In Touch</SectionHeading>
        <ContactContent variants={itemVariants}>
          <p>{error || "Contact information is currently unavailable. Please try again later."}</p>
        </ContactContent>
      </ContactSectionContainer>
    );
  }
  return (
    <ContactSectionContainer
      id="contact" // For navigation
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <SectionHeading variants={itemVariants}>Get In Touch</SectionHeading>
      <ContactContent variants={itemVariants}>
        <p>{contactInfo.introText || "I'm currently looking for new opportunities and my inbox is always open. Whether you have a question or just want to say hi, I'll do my best to get back to you!"}</p>
      </ContactContent>

      {contactInfo.email && (
        <EmailLink href={`mailto:${contactInfo.email}`} variants={itemVariants}>
          Say Hello
        </EmailLink>
      )}

      {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
        <SocialLinksContainer variants={itemVariants}>
          {contactInfo.socialLinks.map((link) => (
            <a
              key={link.platform || link.url} // Use URL as part of key if platform might be missing
              href={link.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label || link.platform}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </SocialLinksContainer>
      )}

    </ContactSectionContainer>
  );
};

export default ContactSection;