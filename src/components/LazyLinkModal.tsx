import React, { lazy, Suspense } from 'react';

const LinkModal = lazy(() => import('./LinkModal').then(module => ({ default: module.LinkModal })));

interface LazyLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNewLink: boolean;
  formData: {
    name: string;
    url: string;
    category: string;
  };
  onFormDataChange: (data: any) => void;
  onSave: () => void;
  onDelete: () => void;
  isLoading: boolean;
  categoryLabels: Record<string, string>;
}

export const LazyLinkModal: React.FC<LazyLinkModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <LinkModal {...props} />
    </Suspense>
  );
};