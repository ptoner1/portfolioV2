import { initFederation, loadRemoteModule as nativeLoadRemote } from '@angular-architects/native-federation-runtime';

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

// Global initialization flag to prevent registering the map multiple times
let nativeFederationInitialized = false;

export async function loadRemoteModule<T = any>(remoteModuleOptions: RemoteModuleOptions): Promise<T> {
  const isNativeFederation = remoteModuleOptions.url.endsWith('.json');

  // =================================================
  // ENGINE A: Native Federation (Angular 19: ESBuild)
  // =================================================
  if (isNativeFederation) {
    try {
      if (!nativeFederationInitialized) {
        await initFederation(remoteModuleOptions.url);
        nativeFederationInitialized = true;
      }

      const module = await nativeLoadRemote<T>({
        remoteName: remoteModuleOptions.scope,
        exposedModule: remoteModuleOptions.module
      });

      return module;
    } catch (error) {
      console.error('Native Federation loader failed:', error);
      throw error;
    }
  }

  // ==================================================
  // ENGINE B: Standard Federation (React/Vite Webpack)
  // ==================================================
  try {
    // Dynamically import the classic remoteEntry.js script module
    const remoteEntry = await import(/* @vite-ignore */ remoteModuleOptions.url);
    
    // Your original shared scope mapping configuration
    const shared = {
      react: {
        '18.2.0': {
          get: async () => { const r = await import('react'); return () => r; },
          from: 'portfolio-app',
          loaded: true
        }
      },
      'react-dom': {
        '18.2.0': {
          get: async () => { const rd = await import('react-dom'); return () => rd; },
          from: 'portfolio-app',
          loaded: true
        }
      },
      'styled-components': {
        '6.1.0': {
          get: async () => { const sc = await import('styled-components'); return () => sc; },
          from: 'portfolio-app',
          loaded: true
        }
      }
    };

    await remoteEntry.init(shared);
    const factory = await remoteEntry.get(remoteModuleOptions.module);
    return factory();
  } catch (error) {
    console.error('Standard Webpack/Vite Federation loader failed:', error);
    throw error;
  }
}
