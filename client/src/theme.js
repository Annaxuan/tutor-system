import { indigo, red, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const primaryColor = '#0077b6' // indigo[500]; // '#3f51b5' '#556cd6'
const secondaryColor = purple[500]; // '#1e1eb3'
const dangerColor = red[900];
const indigo50 = indigo[50]; // same as '#e8eaf6'

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor, // '#19857b',
    },
    error: {
      main: dangerColor,
    },
    indigo50: {
      backgroundColor: indigo50,
      color: '#000',
    },
  },
  typography: {
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',

    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.375,
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.375,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.375,
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.375,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.375,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '&:hover': {
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default theme;
