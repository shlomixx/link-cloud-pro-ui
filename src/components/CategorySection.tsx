
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
  viewMode: 'grid' | 'list' | 'compact';
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
  return (
    <div 
      className={`mb-6 animate-fade-in transition-all duration-300 ${
        draggedItem ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, category)}
    >
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`h-1 w-8 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full transition-all duration-300 hover:w-12`}></div>
        <h2 className={`text-lg font-bold transition-colors duration-300 ${
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
      <div className={`${
        viewMode === 'compact' 
          ? 'flex flex-wrap gap-2' 
          : viewMode === 'grid'
          ? 'grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2' 
          : 'flex flex-col gap-2'
      }`}>
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
