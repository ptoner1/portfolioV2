// Project metadata interface
export interface ProjectMetadata {
  id: string;
  remoteName: string;
  remoteUrl: string;
  componentName: string;
}

// Type definitions for federated modules
export interface RemoteModuleOptions {
  url: string;
  scope: string;
  module: string;
}

/**
 * Dynamically imports a module from a federated remote using Vite's Module Federation
 */
export async function loadRemoteModule<T = any>(remoteModuleOptions: RemoteModuleOptions): Promise<T> {
  try {
    // Dynamically load the remote entry script
    // This loads the remoteEntry.js file which exposes the init() and get() methods
    const remoteEntry = await import(remoteModuleOptions.url);
    
    console.log('Remote entry loaded:', remoteEntry);
    
    // Initialize the remote container with shared dependencies
    // Vite's federation plugin expects a shared scope object
    const shared = {
      react: {
        '18.2.0': {
          get: async () => {
            const react = await import('react');
            return () => react;
          },
          from: 'portfolio-app',
          loaded: true
        }
      },
      'react-dom': {
        '18.2.0': {
          get: async () => {
            const reactDom = await import('react-dom');
            return () => reactDom;
          },
          from: 'portfolio-app',
          loaded: true
        }
      },
      'styled-components': {
        '6.1.0': {
          get: async () => {
            const styledComponents = await import('styled-components');
            return () => styledComponents;
          },
          from: 'portfolio-app',
          loaded: true
        }
      }
    };
    
    // Initialize the remote container with the shared scope
    await remoteEntry.init(shared);
    
    // Get the module factory function
    const factory = await remoteEntry.get(remoteModuleOptions.module);
    
    // Execute the factory to get the actual module
    const module = factory();
    
    console.log('Module executed:', module);
    
    return module;
  } catch (error) {
    console.error('Error loading remote module:', error);
    throw error;
  }
}

