import React, { lazy, Suspense } from 'react';

const CategorySection = lazy(() => import('./CategorySection').then(module => ({ default: module.CategorySection })));

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  title: string;
  clicks?: number;
  createdAt?: string;
  lastClicked?: string;
}

interface LazyCategorySectionProps {
  category: string;
  links: LinkData[];
}

const LazyCategorySection: React.FC<LazyCategorySectionProps> = ({ category, links }) => {
  return (
    <Suspense fallback={
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-gray-300 rounded-md w-48 mb-4"></div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    }>
      <CategorySection
        category={category}
        links={links}
        categoryLabels={{}}
        categoryColors={{}}
        draggedItem={null}
        hoveredLink={null}
        clickedLink={null}
        onDragOver={() => {}}
        onDrop={() => {}}
        onLinkClick={() => {}}
        onEditLink={() => {}}
        onCopyUrl={() => {}}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        onDragStart={() => {}}
        onAddLink={() => {}}
        onDropUrl={() => {}}
        onReorderLinks={() => {}}
        onDeleteLink={() => {}}
        onToggleFavorite={() => {}}
        linkSize={80}
      />
    </Suspense>
  );
};

export default LazyCategorySection;