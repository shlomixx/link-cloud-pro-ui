
import React from 'react';
import { LinkCard } from './LinkCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onAddLink: (category: string) => void;
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
  onDragStart,
  onAddLink
}) => {
  const [isHoveringEmptySpace, setIsHoveringEmptySpace] = React.useState(false);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 2xl:grid-cols-24 gap-1';
      case 'compact':
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-1';
      case 'grid':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-2';
      case 'list':
        return 'flex flex-col gap-1';
      default:
        return 'grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-1';
    }
  };

  return (
    <div 
      className={`flex gap-4 mb-3 animate-fade-in transition-all duration-300 ${
        draggedItem ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, category)}
    >
      {/* Category Label - Left Side */}
      <div className="flex-shrink-0 w-24 pt-1">
        <div className="flex items-center gap-2">
          <div className={`h-1 w-4 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full transition-all duration-300`}></div>
          <h2 className={`text-sm font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
        </div>
      </div>

      {/* Links Grid - Right Side */}
      <div 
        className={`flex-1 ${getGridClasses()} relative`}
        onMouseEnter={() => setIsHoveringEmptySpace(true)}
        onMouseLeave={() => setIsHoveringEmptySpace(false)}
      >
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
        
        {/* Hover Add Button */}
        {isHoveringEmptySpace && viewMode !== 'list' && (
          <div className="flex items-center justify-center">
            <Button
              onClick={() => onAddLink(category)}
              size="sm"
              variant="outline"
              className={`opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 border-dashed ${
                isDarkMode 
                  ? 'border-white/30 text-white/70 hover:border-white/50 hover:text-white hover:bg-white/10' 
                  : 'border-slate-400/50 text-slate-500 hover:border-slate-600 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
