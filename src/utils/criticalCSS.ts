// Critical CSS utilities for improved loading performance

// Extract and inline critical CSS
export const inlineCriticalCSS = () => {
  // Critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical styles for initial render */
    body {
      margin: 0;
      font-family: "Gaegu", system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
      min-height: 100vh;
    }
    
    .app-header {
      padding: 2rem 1rem;
      text-align: center;
    }
    
    .main-title {
      font-size: 2.25rem;
      font-weight: 400;
      color: white;
      letter-spacing: 0.025em;
      margin: 0;
    }
    
    .search-container {
      max-width: 32rem;
      margin: 0 auto 2rem;
      position: relative;
    }
    
    /* Loading skeleton for links */
    .link-skeleton {
      animation: pulse 1.5s ease-in-out infinite;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      height: 3rem;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Remove critical CSS after main CSS loads
export const removeCriticalCSS = () => {
  const criticalStyles = document.querySelector('style[data-critical="true"]');
  if (criticalStyles) {
    criticalStyles.remove();
  }
};

// Preload non-critical CSS
export const preloadNonCriticalCSS = () => {
  const links = [
    'https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap'
  ];

  links.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'style';
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};