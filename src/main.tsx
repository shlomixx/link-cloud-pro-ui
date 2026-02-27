import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'lenis/dist/lenis.css'

// Remove loading fallback once app is ready
const removeLoadingFallback = () => {
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.remove();
  }
};

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Remove loading fallback after initial render
setTimeout(removeLoadingFallback, 100);
