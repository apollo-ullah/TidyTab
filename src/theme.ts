import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ce93d8',
      light: '#e1bee7',
      dark: '#ab47bc',
    },
    secondary: {
      main: '#b39ddb',
      light: '#d1c4e9',
      dark: '#7e57c2',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)',
      backgroundClip: 'text',
      textFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 24px',
          fontSize: '1rem',
        },
        contained: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
}); 