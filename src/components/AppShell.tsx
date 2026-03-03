import React from "react";
import { Link, useLocation } from "react-router-dom";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!isHome && (
        <header className="border-b border-border/60 bg-white/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-foreground/90 hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm">
                LC
              </span>
              <span className="tracking-tight">Link Cloud</span>
            </Link>

            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden md:inline">Tip: Press</span>
              <kbd className="px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-[11px] font-medium">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded border border-border/70 bg-muted/60 text-[11px] font-medium">
                K
              </kbd>
              <span className="hidden md:inline">to focus search</span>
            </div>
          </div>
        </header>
      )}

      <div className={isHome ? "" : "flex-1"}>
        {children}
      </div>
    </div>
  );
}

