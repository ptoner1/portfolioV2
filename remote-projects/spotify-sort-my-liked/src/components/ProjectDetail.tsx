import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import {
  MusicNote as MusicNoteIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
  QueueMusic as PlaylistIcon,
  GitHub as GitHubIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

/**
 * ProjectDetail Component - Exposed via Module Federation
 * 
 * This component represents the detailed view of the Spotify Sort My Liked project.
 * It's exported as a federated module that can be imported by the host application.
 * 
 * When implementing additional projects:
 * 1. Create a similar component for each project
 * 2. Expose it in the project's vite.config.ts
 * 3. Register it in the host's federatedProjects registry
 */
const ProjectDetail: React.FC = () => {
  return (
    <Box sx={{ width: '100%', mb: 8 }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        {/* Project header */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'primary.main',
          }}
        >
          Spotify Sort My Liked
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {/* Project preview image */}
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                mb: { xs: 2, md: 0 },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image="https://via.placeholder.com/600x300/121212/1DB954?text=Spotify+Sort+App+Screenshot"
                alt="Spotify Sort My Liked application screenshot"
              />
              <CardContent sx={{ backgroundColor: 'background.paper', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Application interface showing sorted playlists and filtering options
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Project summary */}
            <Typography variant="h5" gutterBottom>
              Project Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Spotify Sort My Liked is a web application that allows users to filter and organize their
              Spotify liked songs collection based on various audio features and metadata. Users can
              create new playlists from their filtered results with just a few clicks.
            </Typography>

            {/* Technology stack */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Technology Stack
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip label="React" color="primary" size="medium" />
              <Chip label="Express" color="primary" size="medium" />
              <Chip label="Spotify API" color="primary" size="medium" />
              <Chip label="AWS Lambda" color="primary" size="medium" />
              <Chip label="Material UI" color="primary" size="medium" />
              <Chip label="OAuth 2.0" color="primary" size="medium" />
            </Box>

            {/* Project links */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<GitHubIcon />}
                href="https://github.com/yourusername/spotify-sort-my-liked"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CodeIcon />}
                href="https://spotify-sort-my-liked-demo.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Key features section */}
      <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Key Features
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <MusicNoteIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Audio Feature Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sort and filter tracks based on audio features like tempo, energy,
              danceability, acousticness, and more using Spotify's audio feature analytics.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <SortIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Advanced Sorting Options
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create complex sorting rules with multiple criteria and directions.
              Sort by artist, album, release date, or any audio feature.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <PlaylistIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Playlist Generation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save your filtered results as a new Spotify playlist with custom name
              and description. Perfect for creating mood-based or themed collections.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Implementation details */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          mt: 6,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Implementation Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" paragraph>
          This project was built with a React frontend and Node.js/Express backend.
          It leverages the Spotify Web API for authentication and data retrieval.
          The application architecture includes:
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <FilterListIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="OAuth 2.0 Authentication Flow"
              secondary="Secure authentication with Spotify's OAuth implementation"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FilterListIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Batch Processing of API Requests"
              secondary="Optimized retrieval of user's liked songs collection that can contain thousands of tracks"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FilterListIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Audio Feature Analysis"
              secondary="Parallel processing of audio feature data to minimize load times"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FilterListIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Serverless Backend"
              secondary="AWS Lambda functions handle API calls and data processing for scalability"
            />
          </ListItem>
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Challenges Overcame
        </Typography>
        <Typography variant="body1" paragraph>
          The project required handling rate limits from the Spotify API, especially
          when dealing with large collections of liked songs. This was solved by implementing
          batch processing and intelligent request throttling to stay within API limits
          while providing a smooth user experience.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            This component is loaded via Module Federation from a separately deployed application.
            <Link href="https://webpack.js.org/concepts/module-federation/" target="_blank" sx={{ ml: 1 }}>
              Learn more about Module Federation
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProjectDetail;
