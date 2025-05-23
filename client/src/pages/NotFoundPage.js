// d:\PortFolio\client\src\pages\NotFoundPage.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh; // Adjust as needed
  text-align: center;
  padding: 20px;

  h1 {
    font-size: clamp(3rem, 10vw, 6rem);
    color: ${props => props.theme.colors.primaryAccent};
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: 30px;
  }

  a {
    padding: 10px 20px;
    background-color: ${props => props.theme.colors.primaryAccent};
    color: ${props => props.theme.colors.background};
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/">Go Back Home</Link>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
