import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inlineCriticalCSS, preloadCriticalFont } from './utils/cssOptimization'

// Optimize CSS loading
inlineCriticalCSS();
preloadCriticalFont();

createRoot(document.getElementById("root")!).render(<App />);
