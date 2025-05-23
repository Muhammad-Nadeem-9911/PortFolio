import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll'; // Using react-scroll for smooth scrolling and active state
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for hamburger menu
import { FiDownload } from 'react-icons/fi'; // Example download icon
import { getPublicAboutInfo } from '../../services/portfolioService';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 20px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.background}E6; // Semi-transparent background
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: top 0.3s; // For hiding/showing navbar on scroll (optional)

  @media (min-width: 768px) {
    padding: 0 50px;
  }
`;

const Logo = styled.a`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primaryAccent};
  text-decoration: none;
  /* You can replace text with an SVG logo if you have one */
`;

const NavLinksContainer = styled.div`
  display: none; // Hidden on mobile by default

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavLink = styled(ScrollLink)` // Use react-scroll Link
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  margin: 0 15px;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer; // Indicate it's clickable

  &:hover {
    color: ${props => props.theme.colors.primaryAccent};
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: ${props => props.theme.colors.primaryAccent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
    }

  /* Active state styling */
  &.active {
    color: ${props => props.theme.colors.primaryAccent};

  }
`;

const ResumeButtonLink = styled(NavLink).attrs({ as: 'a' })` // Use NavLink as base, but render as <a>
  background-color: ${props => props.theme.colors.primaryAccent}1A; /* Very subtle background */
  color: ${props => props.theme.colors.primaryAccent} !important;
  padding: 8px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex; /* For aligning icon and text */
  align-items: center; /* For aligning icon and text */

  &:hover {
    background-color: ${props => props.theme.colors.primaryAccent}33; /* Slightly darker subtle background */
  }
  &::after { display: none; } // Remove the underline effect from NavLink

  svg { margin-right: 8px; } /* Space between icon and text */
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  padding: 0; /* Adjust if needed */
  display: block;
  cursor: pointer;
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primaryAccent};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLinks = styled(motion.div)`
  position: fixed;
  top: 70px; /* Below navbar */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* z-index: 1000; // This was already here and correct */
  z-index: 1000; // Ensure it's above other content, same as NavContainer
  padding: 20px;

  a {
    font-size: 1.5rem;
    margin: 15px 0;
    color: ${props => props.theme.colors.text};
    text-decoration: none;
    &:hover {
      color: ${props => props.theme.colors.primaryAccent};
    }
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('/YourName_Resume.pdf'); // Default/fallback resume URL
  const [logoName, setLogoName] = useState('M~Nadeem'); // Default logo name

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const data = await getPublicAboutInfo();
        if (data && data.resumeUrl) {
          let url = data.resumeUrl;
          console.log("Navbar: Raw resumeUrl from backend:", url);

          if (url.includes('res.cloudinary.com') && !url.includes('/fl_attachment')) {
            // Try the most basic form of fl_attachment first.
            // This tells Cloudinary to suggest download, and it should use the
            // existing filename from the public_id (which includes the .pdf extension).
            
            // Check for /raw/upload/ first, then /upload/
            if (url.includes('/raw/upload/')) {
              // Insert fl_attachment directly after /raw/upload/
              url = url.replace(/(\/raw\/upload\/)/, '$1fl_attachment/');
            } else if (url.includes('/upload/')) { // Fallback for other types if structure differs
              url = url.replace(/(\/upload\/)/, '$1fl_attachment/');
            }
          }
          console.log("Navbar: Processed resumeUrl for href:", url);
          setResumeUrl(url);
        }
        if (data && data.name) { // Set the logo name
          setLogoName(data.name);
        }
      } catch (error) {
        console.error("Navbar: Failed to fetch resume URL from about info:", error);
        // Keep the default resumeUrl if fetching fails
      }
    };
    fetchResumeUrl();
  }, []);

  // Define navItems inside the component so it can use the dynamic resumeUrl
  const navItems = [
    { label: 'About', to: 'about' }, // 'to' matches the section id
    { label: 'Skills', to: 'skills' },
    { label: 'Experience', to: 'experience' },
    { label: 'Projects', to: 'projects' },
    { label: 'Contact', to: 'contact' },
    { label: 'Resume', href: resumeUrl, isExternal: true, isResumeButton: true }, // Mark as resume button
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper to render nav links, used in both desktop and mobile
  const renderNavLinks = (isMobile = false) => navItems.map(item => (
    item.isExternal ? (
      item.isResumeButton ? (
        <ResumeButtonLink key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => isMobile && setIsOpen(false)} title="Download Resume">
          <FiDownload /> {/* Add icon here */}
          {item.label}
        </ResumeButtonLink>
      ) : (
        <NavLink as="a" key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => isMobile && setIsOpen(false)}>
          {item.label}
        </NavLink>
      )
    ) : (
      <NavLink key={item.label} to={item.to} spy={true} smooth={true} offset={-70} duration={500} activeClass="active" onClick={() => setIsOpen(false)}>
        {item.label}
      </NavLink>
    )
  ));

  return (
    <>
      <NavContainer initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <Logo href="#">{logoName}</Logo> {/* Use dynamic logoName */}
        <NavLinksContainer>
          {renderNavLinks()}
        </NavLinksContainer>
        <MobileMenuButton
          onClick={toggleMenu}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-links"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </NavContainer>
      <AnimatePresence>
        {isOpen && (
          <MobileNavLinks
            id="mobile-nav-links" // ID for aria-controls
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => { if (e.target === e.currentTarget) toggleMenu(); }} // Close only if background is clicked
          >
            {renderNavLinks(true)}
          </MobileNavLinks>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;