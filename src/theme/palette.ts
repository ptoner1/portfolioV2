// Color palette for light and dark mode
const palette = {
  light: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4db6ac', // Teal
      light: '#82e9de',
      dark: '#00867d',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    backgroundAccent: '#e0e0e0',
    text: {
      primary: '#121212',
      secondary: '#424242',
      disabled: '#757575',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    tag: {
      background: '#e3f2fd',
      text: '#2196f3',
    }
  },
  dark: {
    primary: {
      main: '#7986cb', // Lighter Indigo for dark mode
      light: '#aab6fe',
      dark: '#49599a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#80cbc4', // Lighter Teal for dark mode
      light: '#b2fef7',
      dark: '#4f9a94',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    backgroundAccent: '#2d2d2d',
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
      disabled: '#6c6c6c',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    tag: {
      background: '#102a43',
      text: '#48aff0',
    }
  },
};

export default palette;
