import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle iOS standalone mode detection
const isInStandaloneMode = () => 
  window.navigator.standalone === true || 
  window.matchMedia('(display-mode: standalone)').matches;

// Apply specific styles or behaviors when in standalone mode
if (isInStandaloneMode()) {
  document.body.classList.add('standalone-mode');
  
  // Prevent default touch behaviors that might interfere with the app
  document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) {
      e.preventDefault();
    }
  }, { passive: false });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
