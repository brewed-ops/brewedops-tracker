// src/main.jsx - Entry point for BrewedOps
// Your App.jsx already has BrowserRouter, so we just render App directly
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
