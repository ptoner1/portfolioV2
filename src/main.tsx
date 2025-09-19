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
import { Schema } from '../amplify/data/resource';

Amplify.configure(outputs);

const client = generateClient<Schema>();

client.queries.sayHello({
  name: "Pauly  Wauly",
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
