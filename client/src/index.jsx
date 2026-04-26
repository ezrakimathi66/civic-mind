import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';

// Set API base URL from env variable for production deployment
const apiUrl = import.meta.env.VITE_API_URL || 'https://civic-mind-1-1pf7.onrender.com';
axios.defaults.baseURL = apiUrl;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
