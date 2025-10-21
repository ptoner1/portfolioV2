import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import './index.css'
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'

Amplify.configure({
  ...outputs,
  // API: {
  //   REST: {
  //     ['EmailPortfolioContact']: {
  //       endpoint: 'https://ane1v5jx8i.execute-api.us-east-1.amazonaws.com/PortfolioV2',
  //       region: 'us-east-1',
  //       // service: 'AWS_IAM'
  //     }
  //   }
  // }
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
