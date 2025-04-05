import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle iOS standalone mode detection
const isInStandaloneMode = () => 
  // Use type assertion for window.navigator.standalone which isn't in standard Navigator type
  ('standalone' in window.navigator && (window.navigator as any).standalone === true) || 
  window.matchMedia('(display-mode: standalone)').matches;

// Apply specific styles or behaviors when in standalone mode
if (isInStandaloneMode()) {
  document.body.classList.add('standalone-mode');
  
  // Prevent default touch behaviors that might interfere with the app
  document.addEventListener('touchmove', (e: TouchEvent) => {
    // Use type assertion for e.scale which isn't in standard TouchEvent type
    if ((e as any).scale !== undefined && (e as any).scale !== 1) {
      e.preventDefault();
    }
  }, { passive: false });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
