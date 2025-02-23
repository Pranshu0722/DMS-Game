import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Optional global styles
import App from './App'; // Main application component

// Render the React application into the root element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
