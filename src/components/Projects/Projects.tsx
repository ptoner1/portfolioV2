import React, { useEffect } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProjectCard from './components/ProjectCard';

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
    id: 'spotifyApp',
    title: 'Spotify Sort My Liked',
    imageUrl: spotifyProjectImg,
    summary: 'An app that allows users to filter and sort their liked songs and save the results as a new playlist.',
    skills: ['React', 'Express', 'AWS'],
    projectUrl: 'https://github.com/ptoner1/sort-my-spotify-frontend',
    alt: 'Spotify Sort My Liked application screenshot',
    // Module Federation metadata
    remoteName: 'spotifyProject',
    remoteUrl: import.meta.env.VITE_SPOTIFY_APP_URL,
    componentName: './ProjectDetail'
  },
  {
    id: 'deancraig',
    title: 'Dean',
    imageUrl: spotifyProjectImg,
    summary: 'Mr Craig enjoys his evenings with a glass of scotch',
    skills: ['Dean', 'Craig', 'George'],
  }
];

const Projects: React.FC = () => {
  
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
    </ProjectsContainer>
  );
};

export default Projects;
