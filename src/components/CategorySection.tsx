
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LinkCard } from './LinkCard';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  isPrivate?: boolean;
  clicks?: number;
  createdAt?: string;
  isFavorite?: boolean;
  lastClicked?: string;
}

interface CategorySectionProps {
  category: string;
  links: LinkData[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  draggedItem: string | null;
  hoveredLink: string | null;
  clickedLink: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, category: string) => void;
  onLinkClick: (link: LinkData) => void;
  onToggleFavorite: (linkKey: string, e: React.MouseEvent) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onDragStart: (linkKey: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  links,
  categoryLabels,
  categoryColors,
  viewMode,
  isDarkMode,
  draggedItem,
  hoveredLink,
  clickedLink,
  onDragOver,
  onDrop,
  onLinkClick,
  onToggleFavorite,
  onEditLink,
  onCopyUrl,
  onMouseEnter,
  onMouseLeave,
  onDragStart
}) => {
  const getGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-1';
      case 'compact':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2';
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3';
      case 'list':
        return 'flex flex-col gap-2';
      default:
        return 'grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2';
    }
  };

  return (
    <div 
      className={`mb-4 animate-fade-in transition-all duration-300 ${
        draggedItem ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, category)}
    >
      {/* Category Header - More compact */}
      <div className={`flex items-center gap-2 ${viewMode === 'dense' ? 'mb-2' : 'mb-3'}`}>
        <div className={`h-1 w-6 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full transition-all duration-300 hover:w-8`}></div>
        <h2 className={`${viewMode === 'dense' ? 'text-sm' : 'text-lg'} font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <Badge variant="secondary" className={`text-xs transition-all duration-300 hover:scale-110 ${
          isDarkMode 
            ? 'bg-white/10 text-white border-white/20' 
            : 'bg-black/10 text-slate-800 border-black/20'
        }`}>
          {links.length}
        </Badge>
      </div>

      {/* Links Layout */}
      <div className={getGridClasses()}>
        {links.map((link) => (
          <LinkCard
            key={link.key}
            link={link}
            viewMode={viewMode}
            isDarkMode={isDarkMode}
            hoveredLink={hoveredLink}
            clickedLink={clickedLink}
            onMouseEnter={() => onMouseEnter(link.key)}
            onMouseLeave={onMouseLeave}
            onDragStart={() => onDragStart(link.key)}
            onLinkClick={() => onLinkClick(link)}
            onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
            onEdit={() => onEditLink(link)}
            onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
          />
        ))}
      </div>
    </div>
  );
};
