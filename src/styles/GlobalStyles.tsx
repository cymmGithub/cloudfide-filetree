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
    line-height: 1.55;
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings:
      'ss01' on,
      'cv02' on,
      'tnum' on;
    font-variant-ligatures: none;
  }

  body {
    background-image:
      radial-gradient(
        ellipse at 20% -10%,
        rgba(212, 166, 75, 0.05),
        transparent 55%
      ),
      radial-gradient(
        ellipse at 110% 100%,
        rgba(212, 166, 75, 0.03),
        transparent 50%
      );
    background-attachment: fixed;
    min-height: 100vh;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1000;
    opacity: 0.025;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  ::selection {
    background: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.accentInk};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
    border: 3px solid ${(props) => props.theme.colors.bg};
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.borderStrong};
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    color: inherit;
  }

  textarea,
  input {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  a {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
    box-shadow: inset 0 -1px 0 ${(props) => props.theme.colors.accent};
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes rise-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes blink {
    0%, 49%   { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes hairline-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
`;
