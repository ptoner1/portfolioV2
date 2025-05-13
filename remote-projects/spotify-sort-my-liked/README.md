# Spotify Sort My Liked - Federated Module

This is a remote application that demonstrates Module Federation with the portfolio app. It exposes a ProjectDetail component that can be loaded by the portfolio app's Module Federation setup.

## Overview

This application:
- Acts as a remote module for the portfolio application
- Exposes a `ProjectDetail` component displaying the Spotify Sort My Liked project
- Uses the same UI library (Material UI) as the host application to ensure style consistency
- Demonstrates how federated modules can be isolated yet integrated

## Development

### Setup

```
npm install
```

### Running the development server

```
npm run dev
```

This starts the development server on port 5001.

## Building for production

```
npm run build
```

## How it works with Module Federation

1. This application exposes its `ProjectDetail` component through Module Federation
2. The portfolio app (host) dynamically loads this component when a user navigates to the project details page
3. Both applications share core dependencies like React and Material UI to avoid duplication
4. The component integrates with the host application's UI while maintaining its own encapsulated logic

## Module Federation Configuration

The Module Federation configuration is in `vite.config.ts`:

```typescript
federation({
  name: 'spotify_project',
  filename: 'remoteEntry.js',
  exposes: {
    './ProjectDetail': './src/components/ProjectDetail.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
    '@mui/material': { singleton: true, requiredVersion: '^5.14.19' },
    '@emotion/react': { singleton: true, requiredVersion: '^11.11.1' },
    '@emotion/styled': { singleton: true, requiredVersion: '^11.11.1' }
  }
})
```

This configuration:
- Names the remote as 'spotify_project'
- Exposes the ProjectDetail component at './ProjectDetail'
- Shares dependencies with the host to avoid duplication

## Running the complete Module Federation setup

To test the complete Module Federation setup:

1. Start this remote application:
   ```
   cd remote-projects/spotify-sort-my-liked
   npm run dev
   ```

2. In another terminal, start the portfolio application:
   ```
   npm run dev
   ```

3. Navigate to the projects section in the portfolio app
4. Click on the "Spotify Sort My Liked" project to see the federated module in action

## Deployment

In a real-world scenario, this application would be deployed to its own hosting and the portfolio application would reference the production URL.
