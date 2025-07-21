import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inlineCriticalCSS } from './utils/criticalCSS'



createRoot(document.getElementById("root")!).render(<App />);
