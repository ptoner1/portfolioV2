import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProjectDetail from './components/ProjectDetail';

/**
 * Main App Component
 * 
 * When the remote app is accessed directly (not through Module Federation),
 * this component is the entry point and renders the ProjectDetail component.
 */
function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spotify Sort My Liked - Remote Application
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This is a federated module that can be imported by the host application.
        </Typography>
        
        {/* Render the exposed component */}
        <ProjectDetail />
      </Box>
    </Container>
  );
}

export default App;
