import React, { useEffect } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProjectCard from './components/ProjectCard';

// Import project images
import spotifyProjectImg from '../../assets/photos/sort-my-liked.png';
import github_white from '../../assets/icons/github_white.png';

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
    skills: ['React', 'Express', 'EC2', 'Oauth', 'Spotify API'],
    projectUrl: 'https://github.com/ptoner1/sort-my-spotify-frontend',
    alt: 'Spotify Sort My Liked application screenshot',
    // Module Federation metadata
    remoteName: 'spotifyProject',
    remoteUrl: import.meta.env.VITE_SPOTIFY_APP_URL,
    componentName: './ProjectDetail'
  },
  {
    id: 'PortfolioV2',
    title: 'Portfolio V2',
    imageUrl: github_white,
    summary: "This website!  I've used it as an opportunity to develop AWS and bundling skills.",
    skills: ['React', 'SES', 'S3', 'Lambda', 'Vite', 'Module Federation'],
    projectUrl: 'https://github.com/ptoner1/portfolioV2',
    alt: 'Portfolio V2 application screenshot',
    useExternalLink: true
    // componentName: './ProjectDetail'
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
              useExternalLink={project.useExternalLink}
            />
          </Grid>
        ))}
      </Grid>
    </ProjectsContainer>
  );
};

export default Projects;
