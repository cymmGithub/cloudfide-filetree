import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSize.md};
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
  }

  textarea,
  input {
    font-family: inherit;
    font-size: inherit;
  }

  a {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
