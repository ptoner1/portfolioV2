import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { loadRemoteModule, getProjectMetadata } from '../../utils/federationUtils';

// Styled components
const ProjectDetailContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.portfolio.spacing.xl,
  gap: theme.portfolio.spacing.lg,
}));

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
 * ProjectDetail component
 * 
 * This component is responsible for loading and displaying a federated module
 * for a specific project based on the projectId route parameter.
 * 
 * It handles:
 * - Loading states while the remote module is being fetched
 * - Error handling for failed module loads
 * - Maintaining consistent styling with the portfolio theme
 */
const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state on projectId change
    setLoading(true);
    setError(null);
    setRemoteComponent(null);

    if (!projectId) {
      setError(new Error('Project ID is required'));
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        const projectMetadata = getProjectMetadata(projectId);
        
        if (!projectMetadata) {
          throw new Error(`Project configuration not found for ID: ${projectId}`);
        }

        // Load the remote module
        const module = await loadRemoteModule({
          url: projectMetadata.remoteUrl,
          scope: projectMetadata.remoteName,
          module: projectMetadata.componentName,
        });

        // Set the remote component
        setRemoteComponent(() => module.default || module);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load remote module:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return (
    <ProjectDetailContainer maxWidth="lg">
      {loading ? (
        <LoadingFallback />
      ) : error ? (
        <ErrorContainer>
          <Typography variant="h5" gutterBottom>
            Error Loading Project
          </Typography>
          <Typography variant="body1">
            We couldn't load the project details. Please try again later.
          </Typography>
          <Typography variant="body2" color="error" mt={2}>
            {error.message}
          </Typography>
        </ErrorContainer>
      ) : RemoteComponent ? (
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <RemoteComponent />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <Typography variant="h5" color="error">
          Project component could not be loaded
        </Typography>
      )}
    </ProjectDetailContainer>
  );
};

export default ProjectDetail;
