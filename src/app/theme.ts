import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f5eff',
      dark: '#123eb3',
    },
    secondary: {
      main: '#107c72',
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#5d6b82',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    button: {
      textTransform: 'none',
      fontWeight: 650,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(23, 32, 51, 0.08)',
          boxShadow: '0 1px 2px rgba(23, 32, 51, 0.06)',
        },
      },
    },
  },
})
