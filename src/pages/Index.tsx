@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. 
All colors MUST be HSL.
*/

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 20%;
    --card: 329 3% 98%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 5%;
    --primary: 336 78% 57%; /* Mapped from --color-primary */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 4.8% 91%;
    --secondary-foreground: 240 7% 10%;
    --muted: 0 0% 92%;
    --muted-foreground: 0 0% 36%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 72% 40%;
    --destructive-foreground: 0 0% 100%;
    --success: 123 38% 37%;
    --success-foreground: 123 38% 30%;
    --info: 199 92% 36%;
    --border: 240 6% 84%;
    --input: 240 6% 84%;
    --ring: 240 10% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 4% 9%; /* #161618 */
    --foreground: 0 0% 99%;   /* #FCFCFC */
    --card: 212 19% 15%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 5%;
    --popover-foreground: 240 10% 85%;
    --primary: 336 78% 57%; /* Mapped from --color-primary */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 212 12% 27%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 90% 60%;
    --destructive-foreground: 0 0% 100%;
    --success: 123 38% 57%;
    --success-foreground: 123 38% 88%;
    --info: 199 92% 56%;
    --border: 240 3.7% 30%;
    --input: 240 3.7% 30%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 2rem;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  body {
    @apply bg-background text-foreground;
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* ... (rest of the file remains the same) ... */
}