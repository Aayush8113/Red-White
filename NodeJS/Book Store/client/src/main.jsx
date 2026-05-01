// React and ReactDOM for building the UI
import React from 'react';
import ReactDOM from 'react-dom/client';
// Main App component
import App from './App.jsx';
// Global styles (Tailwind CSS)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
