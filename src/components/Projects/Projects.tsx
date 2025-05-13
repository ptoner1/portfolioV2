import React, { useEffect } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProjectCard from './components/ProjectCard';
import { registerFederatedProject } from '../../utils/federationUtils';

// Import project images
import spotifyProjectImg from '../../assets/photos/sort-my-liked.png';

// Styled components
const ProjectsContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.portfolio.spacing.xl,
  paddingTop: theme.portfolio.spacing.xl,
  paddingBottom: theme.portfolio.spacing.xl,
  gap: theme.portfolio.spacing.lg,
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.portfolio.spacing.lg,
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
  paddingBottom: theme.portfolio.spacing.xs,
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
  },
}));

/**
 * Project data with Module Federation configuration
 * 
 * In a production environment, this data would likely come from an API or CMS.
 * Each project includes Module Federation metadata for loading remote components.
 * 
 * To add a new project:
 * 1. Add a new entry to this array with a unique ID
 * 2. Configure the remote module details (remoteName, remoteUrl, componentName)
 * 3. The project will automatically be registered with the federation system
 */
const projectsData = [
  {
    id: 'spotify-sort-my-liked',
    title: 'Spotify Sort My Liked',
    imageUrl: spotifyProjectImg,
    summary: 'An app that allows users to filter and sort their liked songs and save the results as a new playlist.',
    skills: ['React', 'Express', 'AWS'],
    projectUrl: 'https://github.com/yourusername/spotify-sort-my-liked', // GitHub or demo link
    alt: 'Spotify Sort My Liked application screenshot',
    // Module Federation metadata
    remoteName: 'spotifyProject',
    remoteUrl: 'http://localhost:5001/assets/remoteEntry.js', // Will be configured in the example remote
    componentName: './ProjectDetail'
  },
  {
    id: 'deancraig',
    title: 'Dean',
    imageUrl: spotifyProjectImg,
    summary: 'Mr Craig enjoys his evenings with a glass of scotch',
    skills: ['Dean', 'Craig', 'George'],
  }
  // More projects can be added here in the future
];

// Projects Component
const Projects: React.FC = () => {
  // Register all projects with the Module Federation system
  useEffect(() => {
    projectsData.forEach((project) => {
      if (project.remoteName && project.remoteUrl && project.componentName) {
        registerFederatedProject({
          id: project.id,
          remoteName: project.remoteName,
          remoteUrl: project.remoteUrl,
          componentName: project.componentName
        });
      }
    });
  }, []);
  return (
    <ProjectsContainer maxWidth="lg" id="projects-section">
      <SectionHeading className='card-loading' variant="h3">
        Projects
      </SectionHeading>
      
      <Grid container spacing={4}>
        {projectsData.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <ProjectCard
              id={project.id}
              title={project.title}
              imageUrl={project.imageUrl}
              summary={project.summary}
              skills={project.skills}
              projectUrl={project.projectUrl}
              alt={project.alt}
              useExternalLink={false} // Use internal routing to federated modules
            />
          </Grid>
        ))}
      </Grid>
      
      {/* 
        Note about Module Federation:
        In a production environment, we would implement Module Federation to 
        dynamically load project details from separately deployed micro-frontends.
        
        This would involve:
        1. Setting up a Webpack ModuleFederationPlugin in the build config
        2. Exposing a ProjectDetails component from each micro-frontend
        3. Dynamically importing these remote modules when a user clicks on a project
        
        This approach enables:
        - Independent deployment of project details
        - Better separation of concerns
        - Improved loading performance
        
        For this demo, we're using direct links, but the architecture
        is designed to be easily extended with Module Federation.
      */}
    </ProjectsContainer>
  );
};

export default Projects;
