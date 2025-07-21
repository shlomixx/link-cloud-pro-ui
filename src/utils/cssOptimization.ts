// CSS optimization utilities for reducing unused CSS

// Critical CSS that should be inlined
export const criticalCSS = `
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
  
  *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
  html{scroll-behavior:smooth;scroll-padding-top:2rem;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;font-size:20px}
  body{background-color:hsl(var(--background));color:hsl(var(--foreground));min-height:100vh;font-family:'Gaegu',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden}
`;

// Function to inline critical CSS
export const inlineCriticalCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingCritical = document.getElementById('critical-css');
  if (existingCritical) return;
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

// Function to defer non-critical CSS
export const deferNonCriticalCSS = () => {
  if (typeof document === 'undefined') return;
  
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('critical')) {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'; this.onload=null;");
    }
  });
};

// Preload critical font subset
export const preloadCriticalFont = () => {
  if (typeof document === 'undefined') return;
  
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400&display=swap&subset=latin';
  fontLink.as = 'style';
  fontLink.onload = function() {
    const link = this as HTMLLinkElement;
    link.onload = null;
    link.rel = 'stylesheet';
  };
  document.head.appendChild(fontLink);
  
  // Load bold weight lazily
  setTimeout(() => {
    const boldFontLink = document.createElement('link');
    boldFontLink.rel = 'stylesheet';
    boldFontLink.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap&subset=latin';
    document.head.appendChild(boldFontLink);
  }, 1000);
};