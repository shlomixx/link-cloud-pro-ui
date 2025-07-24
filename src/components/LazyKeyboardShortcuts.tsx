import React, { lazy, Suspense } from 'react';

const KeyboardShortcuts = lazy(() => import('./KeyboardShortcuts').then(module => ({ default: module.KeyboardShortcuts })));

interface LazyKeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LazyKeyboardShortcuts: React.FC<LazyKeyboardShortcutsProps> = (props) => {
  if (!props.isOpen) return null;

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
      <KeyboardShortcuts {...props} />
    </Suspense>
  );
};

// Simplified version for when no shortcuts are needed
export const SimpleKeyboardShortcuts: React.FC = () => {
  return null;
};

export default SimpleKeyboardShortcuts;