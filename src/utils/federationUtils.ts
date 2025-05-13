/**
 * federationUtils.ts
 * Utilities for working with Webpack Module Federation
 */

// Type definitions for federated modules
export interface RemoteModuleOptions {
  url: string;
  scope: string;
  module: string;
}

/**
 * Dynamically imports a module from a federated remote
 * 
 * @param options - RemoteModuleOptions containing url, scope, and module
 * @returns A Promise that resolves to the federated module
 * 
 * Note on security:
 * 1. Only load modules from trusted sources
 * 2. Consider implementing content security policies (CSP) to restrict 
 *    which domains can provide federated modules
 * 3. Validate and sanitize any data coming from remote modules
 * 4. Consider implementing integrity checks for remote modules
 */
export async function loadRemoteModule<T = any>(options: RemoteModuleOptions): Promise<T> {
  // Dynamically load the remote entry
  // @ts-ignore - The window.__federation_shared__ object is injected by Module Federation
  window[options.scope] = await import(/* @vite-ignore */ options.url);
  
  // Initialize the sharing scope
  // @ts-ignore
  await __webpack_init_sharing__("default");
  
  // Initialize the container scope
  // @ts-ignore
  const container = window[options.scope];
  // @ts-ignore
  await container.init(__webpack_share_scopes__.default);
  
  // Get the factory function for creating the module
  // @ts-ignore
  const factory = await container.get(options.module);
  
  // Execute the factory to get the module
  return factory();
}

// Project metadata interface
export interface ProjectMetadata {
  id: string;
  remoteName: string;
  remoteUrl: string;
  componentName: string;
}

// Registry of federated module configurations for each project
export const federatedProjects: Record<string, ProjectMetadata> = {
  // Will be populated with project configurations
  // Example:
  // 'spotify-sort-my-liked': {
  //   id: 'spotify-sort-my-liked',
  //   remoteName: 'spotifyProject',
  //   remoteUrl: 'http://localhost:5001/assets/remoteEntry.js',
  //   componentName: './ProjectDetail'
  // }
};

// Add projects to the registry - this would be done when loading project data
export function registerFederatedProject(project: ProjectMetadata): void {
  federatedProjects[project.id] = project;
}

/**
 * Get the project metadata by ID
 * 
 * @param projectId - The unique identifier for the project
 * @returns The project metadata or undefined if not found
 */
export function getProjectMetadata(projectId: string): ProjectMetadata | undefined {
  return federatedProjects[projectId];
}
