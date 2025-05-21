import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll'; // Using react-scroll for smooth scrolling and active state
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for hamburger menu

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

const MobileMenuIcon = styled.div`
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
// We'll use react-scroll Link for these, so href becomes 'to'
const navItems = [
  { label: 'About', to: 'about' }, // 'to' matches the section id
  { label: 'Skills', to: 'skills' },
  { label: 'Experience', to: 'experience' },
  { label: 'Projects', to: 'projects' },
  { label: 'Contact', to: 'contact' },
  // For external links like Resume, you'd use a regular <a> tag or a different component
  { label: 'Resume', href: '/YourName_Resume.pdf', isExternal: true }, // Added Resume link

];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // We'll use react-scroll's activeClass prop instead of manual state
  // const [activeSection, setActiveSection] = useState('hero'); // Example state if not using react-scroll activeClass

  // If you were implementing manually with Intersection Observer:
  // useEffect(() => {
  //   const observer = new IntersectionObserver(entries => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         setActiveSection(entry.target.id);
  //       }
  //     });
  //   }, { threshold: 0.5 }); // Adjust threshold as needed
  //   // Observe each section...
  // }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <NavContainer initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <Logo href="#">M~Nadeem</Logo> {/* Or link to #hero */}
        <NavLinksContainer>
          {navItems.map(item => (
            item.isExternal ? (
              <NavLink as="a" key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                activeClass="active"
                onClick={() => setIsOpen(false)}
              >{item.label}</NavLink>
            )
          ))}
        </NavLinksContainer>
        <MobileMenuIcon onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileMenuIcon>
      </NavContainer>
      <AnimatePresence>
        {isOpen && (
          <MobileNavLinks
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={toggleMenu} // Close menu when a link is clicked or background is clicked
          >
            {navItems.map(item => (
              item.isExternal ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  activeClass="active"
                  onClick={() => setIsOpen(false)}
                >{item.label}</NavLink>
              )
            ))}
          </MobileNavLinks>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;