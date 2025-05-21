import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px; /* Base font size */
  }

  body {
    font-family: ${props => props.theme.fonts.join(',')};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.colors.heading};
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  a {
    color: ${props => props.theme.colors.primaryAccent};
    text-decoration: none;
  }
`;

export default GlobalStyles;