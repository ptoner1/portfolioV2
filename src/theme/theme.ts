import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import palette from './palette';

// Custom theme namespace
declare module '@mui/material/styles' {
  interface Theme {
    portfolio: {
      spacing: Record<string, string>;
      borderRadius: Record<string, string>;
      transition: Record<string, string>;
    };
  }
  
  interface ThemeOptions {
    portfolio?: {
      spacing?: Record<string, string>;
      borderRadius?: Record<string, string>;
      transition?: Record<string, string>;
    };
  }
  
  interface TypeBackground {
    default: string;
    paper: string;
    accent: string;
  }
  
  interface Palette {
    tag: {
      background: string;
      text: string;
    };
  }
  
  interface PaletteOptions {
    tag?: {
      background?: string;
      text?: string;
    };
  }
}

// Define our custom properties
const customProperties = {
  portfolio: {
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2.5rem',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
    },
    transition: {
      fast: 'all 0.2s ease',
      medium: 'all 0.3s ease',
      slow: 'all 0.5s ease',
    },
  },
};

// Create theme based on mode
export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const colors = mode === 'light' ? palette.light : palette.dark;
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
        accent: colors.backgroundAccent,
      },
      text: colors.text,
      divider: colors.divider,
      tag: colors.tag,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
    ...customProperties,
  };
  
  return createTheme(themeOptions);
};
