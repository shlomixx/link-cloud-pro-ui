import React, { useState, useEffect } from 'react';

interface ScrollCategoryIndicatorProps {
  currentCategory: string;
  categoryLabels: Record<string, string>;
  getCategoryColor: () => string;
}

export const ScrollCategoryIndicator: React.FC<ScrollCategoryIndicatorProps> = ({
  currentCategory,
  categoryLabels,
  getCategoryColor
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentCategory]);

  if (!isVisible || !currentCategory) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 animate-fade-in border border-white/10">
        <div className={`w-2 h-2 rounded-full ${getCategoryColor()}`}></div>
        <span className="text-white text-sm font-medium">
          {categoryLabels[currentCategory] || currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
        </span>
      </div>
    </div>
  );
};