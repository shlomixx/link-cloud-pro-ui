import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inlineCriticalCSS } from './utils/criticalCSS'

// Apply critical CSS immediately for faster initial render
inlineCriticalCSS();

createRoot(document.getElementById("root")!).render(<App />);
