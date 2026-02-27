import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center focus:outline-none"
      >
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
          404
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          Page not found.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center rounded-full px-4 py-2 text-sm text-foreground/90 hover:text-foreground hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to home
        </a>
      </main>
    </div>
  );
};

export default NotFound;
