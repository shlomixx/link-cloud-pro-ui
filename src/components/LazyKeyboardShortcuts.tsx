import React, { lazy, Suspense, useState, useEffect } from 'react';

const KeyboardShortcuts = lazy(() => import('./KeyboardShortcuts').then(module => ({ default: module.KeyboardShortcuts })));

export const LazyKeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Listen for keyboard shortcut to open (e.g., '?' key)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <div className="text-sm text-muted-foreground">Loading shortcuts...</div>
          </div>
        </div>
      </div>
    }>
      <KeyboardShortcuts
        isOpen={isOpen}
        onClose={handleClose}
      />
    </Suspense>
  );
};