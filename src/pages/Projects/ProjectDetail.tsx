import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { loadRemoteModule } from '@/utils/federationUtils';
import { StyleSheetManager } from 'styled-components';
import Alert from '@/components/Alert/Alert';

// Styled components

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.portfolio.spacing.xl,
  minHeight: '300px',
  gap: theme.portfolio.spacing.md,
}));

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.portfolio.spacing.lg,
  marginTop: theme.portfolio.spacing.lg,
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.error.dark 
    : theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: theme.portfolio.borderRadius.medium,
}));

// Loading Fallback component
const LoadingFallback = () => (
  <LoadingContainer>
    <CircularProgress size={60} />
    <Typography variant="h6" color="text.secondary">
      Loading project details...
    </Typography>
    <Typography variant="body2" color="text.secondary">
      This may take a moment as we're loading the module from a remote source.
    </Typography>
  </LoadingContainer>
);

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1">
            We couldn't load this project's details. This could be because:
          </Typography>
          <ul>
            <li>The remote module is not available</li>
            <li>There was a network error</li>
            <li>The module is incompatible with the current environment</li>
          </ul>
          <Typography variant="body2" fontStyle="italic" mt={2}>
            Error details: {this.state.errorMessage}
          </Typography>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * Dynamic Remote Component Loader
 * Handles loading of federated modules with proper error handling
 */
const DynamicRemoteComponent: React.FC<{ moduleName: string }> = ({ moduleName }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading remote module: ${moduleName}`);
        
        // Use the loadRemoteModule utility to load the federated module
        const module = await loadRemoteModule({
          url: import.meta.env.VITE_SPOTIFY_APP_URL || "",
          scope: 'spotifyApp',
          module: './App'
        });
        
        console.log('Module loaded successfully:', module);
        
        // Handle both default and named exports
        const ComponentToRender = module.default || module;
        
        if (!ComponentToRender) {
          throw new Error('No component found in the remote module');
        }
        
        setComponent(() => ComponentToRender);
      } catch (err) {
        console.error('Failed to load remote module:', err);
        
        // Enhanced error reporting
        if (err instanceof Error) {
          if (err.message.includes('Loading chunk')) {
            setError('Failed to load remote module chunks. Ensure the remote app is running on main.d29382d3wfcbic.amplifyapp.com');
          } else if (err.message.includes('Cannot resolve')) {
            setError('Remote module not found. Check if the module is properly exposed from the remote app');
          } else {
            setError(err.message);
          }
        } else {
          setError('Unknown error occurred while loading remote module');
        }
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [moduleName]);

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <ErrorContainer>
        <Typography variant="h5" gutterBottom>
          Failed to Load Remote Module
        </Typography>
        <Typography variant="body1" gutterBottom>
          We couldn't load the federated module. This could be because:
        </Typography>
        <ul>
          <li>The remote application is not running at the expected URL</li>
          <li>There's a network connectivity issue</li>
          <li>The module export format is incompatible</li>
          <li>CORS headers are not properly configured</li>
        </ul>
        <Typography variant="body2" fontStyle="italic" mt={2}>
          Error details: {error}
        </Typography>
        <Typography variant="body2" mt={1}>
          Make sure the remote app is running: <code>npm start</code> in the sort-my-liked-spotify/client directory
        </Typography>
      </ErrorContainer>
    );
  }

  if (!Component) {
    return (
      <ErrorContainer>
        <Typography variant="h5" gutterBottom>
          Component Not Available
        </Typography>
        <Typography variant="body1">
          The remote module was loaded but no component was found.
        </Typography>
      </ErrorContainer>
    );
  }

  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
};

// New ShadowWrapper component
// Shadow Wrapper needed to allow each app to define it's own global styles separately
import { useTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const ShadowWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shadowHost = useRef<HTMLDivElement>(null);
  const shadowRoot = useRef<ShadowRoot | null>(null);
  const theme = useTheme(); // Get the current theme from parent context
  
  useEffect(() => {
    if (!shadowRoot.current && shadowHost.current) {
      shadowRoot.current = shadowHost.current.attachShadow({ mode: 'open' });
      const container = document.createElement('div');
      shadowRoot.current.appendChild(container);
      
      const root = createRoot(container);
      root.render(
        <ThemeProvider theme={theme}>
          <StyleSheetManager target={shadowRoot.current}>
            {children}
          </StyleSheetManager>
        </ThemeProvider>
      );
    }
  }, [children, theme]); // Add theme to dependencies
  
  return <div ref={shadowHost} />;
};



/**
 * ProjectDetail component
 * 
 * This component displays a federated module for a specific project
 * based on the projectId route parameter.
 */
const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <>
    <Alert message="This microfrontend is being served from this domain:" link={import.meta.env.VITE_SPOTIFY_APP_URL.replace("/assets/remoteEntry.js", "")}/>
    <ShadowWrapper>
      <DynamicRemoteComponent moduleName={projectId+"/App"} />
    </ShadowWrapper>
    </>
  );
};

export default ProjectDetail;
