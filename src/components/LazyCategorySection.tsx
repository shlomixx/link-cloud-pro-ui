import React, { lazy, Suspense } from 'react';
import { LinkData } from '@/types';

const CategorySection = lazy(() => import('./CategorySection').then(module => ({ default: module.CategorySection })));

interface LazyCategorySectionProps {
  category: string;
  links: LinkData[];
}

export const LazyCategorySection: React.FC<LazyCategorySectionProps> = ({ category, links }) => {
  // Mock props that would normally come from a parent component
  const mockProps = {
    category,
    links,
    categoryLabels: {},
    categoryColors: {},
    draggedItem: null,
    hoveredLink: null,
    clickedLink: null,
    onDragOver: () => {},
    onDrop: () => {},
    onLinkClick: () => {},
    onEditLink: () => {},
    onCopyUrl: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onDragStart: () => {},
    onAddLink: () => {},
    onDropUrl: () => {},
    onReorderLinks: () => {},
    onDeleteLink: () => {},
    onToggleFavorite: () => {},
    linkSize: 64,
  };

  return (
    <Suspense fallback={
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    }>
      <CategorySection {...mockProps} />
    </Suspense>
  );
};