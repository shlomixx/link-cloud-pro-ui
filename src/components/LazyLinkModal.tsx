import React, { lazy, Suspense, useState } from 'react';

const LinkModal = lazy(() => import('./LinkModal').then(module => ({ default: module.LinkModal })));

export const LazyLinkModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewLink, setIsNewLink] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Mock save operation
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 1000);
  };

  const handleDelete = () => {
    setIsLoading(true);
    // Mock delete operation
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 1000);
  };

  if (!isOpen) return null;

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
      <LinkModal
        isOpen={isOpen}
        onClose={handleClose}
        isNewLink={isNewLink}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSave}
        onDelete={handleDelete}
        isLoading={isLoading}
        categoryLabels={{}}
      />
    </Suspense>
  );
};