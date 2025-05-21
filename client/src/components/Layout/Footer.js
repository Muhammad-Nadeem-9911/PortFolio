import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// You can re-import social icons if you want them in the footer too
// import { FiGithub, FiLinkedin } from 'react-icons/fi';

const FooterContainer = styled(motion.footer)`
  padding: 30px 20px;
  background-color: ${props => props.theme.colors.cardBackground}; /* Or your main background */
  color: ${props => props.theme.colors.secondaryAccent};
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px solid ${props => props.theme.colors.secondaryAccent}33; /* Subtle top border */

  a {
    color: ${props => props.theme.colors.primaryAccent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FooterText = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <FooterContainer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      <FooterText>Designed & Built by M~Nadeem </FooterText>
      <FooterText>&copy; {currentYear} All Rights Reserved.</FooterText>
      {/* Optional: Add social links or other info here */}
    </FooterContainer>
  );
};

export default Footer;