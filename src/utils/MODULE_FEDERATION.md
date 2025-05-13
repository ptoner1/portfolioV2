# Module Federation in Portfolio App

This document explains how the Module Federation setup works in the portfolio application, how to add new projects, and considerations for security and performance.

## What is Module Federation?

Module Federation is a feature of Webpack 5 that allows a JavaScript application to dynamically load code from another application at runtime. In our portfolio, we use it to:

1. **Load project details from separate repositories** - Each project can be developed and deployed independently
2. **Enable independent deployments** - Project details can be updated without rebuilding the portfolio
3. **Improve performance** - Only load the code for projects when they are viewed
4. **Support ecosystem diversity** - Each project can use its own tech stack (as long as it exposes compatible components)

## How Our Implementation Works

### Host Application (Portfolio)

The host application (this portfolio) is configured to:

1. Define shared dependencies to avoid duplication
2. Register remote entry points for each project
3. Dynamically load components from these remotes when needed

Core files:
- `src/utils/federationUtils.ts` - Utilities for loading federated modules
- `src/pages/Projects/ProjectDetail.tsx` - Component that dynamically loads project details
- `src/components/Projects/Projects.tsx` - Component that registers all available projects

### Remote Applications (Individual Projects)

Each remote project exposes components that can be loaded by the host:

1. Sets up its own Module Federation configuration
2. Exposes specific components (e.g., `ProjectDetail`)
3. Shares dependencies with the host to avoid duplication

Example remote setup in `remote-projects/spotify-sort-my-liked/`.

## Adding a New Project

To add a new federated project:

1. **Create a remote application** with Module Federation:
   - Use the existing project as a template
   - Configure the federation plugin in `vite.config.ts` 
   - Expose the necessary components

2. **Register the project in the host**:
   - Add the project details to the `projectsData` array in `src/components/Projects/Projects.tsx`
   - Include the Module Federation metadata (remoteName, remoteUrl, componentName)

3. **Deploy the remote project** to its own hosting (e.g., Vercel, Netlify, AWS)

4. **Update the URL** in the host to point to the deployed remote entry

Example registration:
```typescript
{
  id: 'my-new-project',
  title: 'My New Project',
  imageUrl: myProjectImg,
  summary: 'Project description...',
  skills: ['React', 'Node.js'],
  projectUrl: 'https://github.com/username/my-new-project',
  alt: 'Project screenshot',
  // Module Federation metadata
  remoteName: 'myNewProject',
  remoteUrl: 'https://my-new-project.example.com/assets/remoteEntry.js',
  componentName: './ProjectDetail'
}
```

## Security Considerations

1. **Trusted Sources Only**: Only load remotes from trusted domains. All remotes effectively have the same permissions as your main application.

2. **Content Security Policy (CSP)**: Implement a CSP that restricts which domains can provide federated modules.

3. **Subresource Integrity**: Consider implementing integrity checks for remote entries when they stabilize.

4. **Validate Data**: Always validate and sanitize any data received from remote modules.

5. **Version Pinning**: Consider pinning to specific versions of remotes to prevent unexpected changes.

## Performance Optimizations

1. **Lazy Loading**: Projects are only loaded when the user navigates to the project detail page.

2. **Shared Dependencies**: Core libraries like React and Material UI are shared to avoid duplication.

3. **Caching**: Module Federation supports caching, reducing load times for subsequent visits.

4. **Code Splitting**: Each project can implement its own code splitting for optimal loading.

5. **Loading States**: The application displays loading states while federated modules are being fetched.

## Troubleshooting

Common issues:

1. **Version Mismatches**: Ensure shared dependencies have compatible versions between host and remotes.

2. **CORS Issues**: Make sure the server hosting the remote entry has proper CORS headers.

3. **Loading Failures**: Check browser console for detailed error messages.

4. **Build Configuration**: Ensure both host and remote are built with the correct federation settings.

## Resources

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Vite Federation Plugin](https://github.com/originjs/vite-plugin-federation)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
