import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import App from './App';
import './index.css';
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify'
import { initFederation } from '@angular-architects/native-federation-runtime';

Amplify.configure(outputs);

(async () => {
  try {
    const naasUrl = import.meta.env.VITE_NAAS_APP_URL;
    await initFederation(naasUrl);
    console.log('Production Native Federation initialized successfully.');
  } catch (err) {
    console.error('Failed to pre-load Native Federation manifest endpoints:', err);
  }

  // Safe to render your React Host Shell now
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import '@fontsource/inter/300.css'
// import '@fontsource/inter/400.css'
// import '@fontsource/inter/500.css'
// import '@fontsource/inter/700.css'
// import './index.css'
// import outputs from '../amplify_outputs.json';
// import { Amplify } from 'aws-amplify'
// import { generateClient } from 'aws-amplify/api'

// Amplify.configure(outputs);


// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
