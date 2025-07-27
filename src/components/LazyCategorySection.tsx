import React, { lazy, Suspense } from 'react';
import type { LinkData } from '@/types';

const CategorySection = lazy(() => import('./CategorySection'));

interface LazyCategorySectionProps {
  category: string;
  links: LinkData[];
}

const LazyCategorySection: React.FC<LazyCategorySectionProps> = ({ category, links }) => {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <CategorySection 
        category={category} 
        links={links} 
        categoryLabels={{}}
      />
    </Suspense>
  );
};

export default LazyCategorySection;