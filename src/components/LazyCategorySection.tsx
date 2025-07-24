import React, { lazy, Suspense } from 'react';
import { LinkData } from '@/types';

const CategorySection = lazy(() => import('./CategorySection'));

interface LazyCategorySectionProps {
  category: string;
  links: LinkData[];
}

const LazyCategorySection: React.FC<LazyCategorySectionProps> = ({ category, links }) => {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    }>
      <CategorySection category={category} links={links} />
    </Suspense>
  );
};

export default LazyCategorySection;