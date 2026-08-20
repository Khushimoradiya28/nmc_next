/**
 * Centralized Design System Theme Constants
 * Matches the CSS custom properties defined in variables.css.
 * Can be exported or updated from a CMS in the future.
 */
export const THEME = {
  colors: {
    primary: {
      base: '#B00000',
      light: '#d11c1c',
      dark: '#800000'
    },
    secondary: {
      base: '#F4B000',
      light: 'rgba(244, 176, 0, 0.15)',
      dark: '#cc9300'
    },
    accent: {
      base: '#F4B000',
      light: 'rgba(244, 176, 0, 0.15)',
      dark: '#cc9300'
    },
    background: '#FFFFFF',
    text: {
      base: '#111111',
      muted: '#555555',
      light: '#ffffff'
    },
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#2563eb',
    border: '#e5e7eb',
    surface: '#ffffff'
  },
  typography: {
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Inter', sans-serif"
  },
  navbar: {
    height: '80px',
    heightMobile: '64px'
  }
};

export default THEME;
