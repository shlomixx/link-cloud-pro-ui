
import React from 'react';
import { LinkCard } from './LinkCard';
import { Plus } from 'lucide-react';

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
  onDropUrl: (url: string, category: string) => void;
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
  onAddLink,
  onDropUrl
}) => {
  const [isHoveringCategory, setIsHoveringCategory] = React.useState(false);
  const [isDragOverCategory, setIsDragOverCategory] = React.useState(false);

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

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-5 gap-1';
      case 'compact':
        return 'grid grid-cols-4 gap-1';
      case 'grid':
        return 'grid grid-cols-3 gap-2';
      case 'list':
        return 'flex flex-col gap-1';
      default:
        return 'grid grid-cols-4 gap-1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(true);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(false);
    
    // Check if it's an external URL being dropped
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      // Handle URL drop
      onDropUrl(url, category);
    } else {
      // Handle internal link reordering
      onDrop(e, category);
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className={`hidden md:flex gap-4 mb-3 animate-fade-in transition-all duration-300 ${
          draggedItem || isDragOverCategory ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
        } ${isDragOverCategory ? 'bg-purple-50/50 dark:bg-purple-900/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Category Label - Left Side */}
        <div className="flex-shrink-0 w-24 flex items-start">
          <div 
            className={`flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
              isDragOverCategory ? 'scale-105' : ''
            }`}
            onMouseEnter={() => setIsHoveringCategory(true)}
            onMouseLeave={() => setIsHoveringCategory(false)}
            onClick={() => onAddLink(category)}
          >
            <div className={`h-1 w-4 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full transition-all duration-300`}></div>
            
            {isHoveringCategory || isDragOverCategory ? (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } ${isDragOverCategory ? 'bg-purple-200/50 dark:bg-purple-800/50' : ''}`}>
                <Plus className="w-3 h-3" />
                <span className="text-xs font-medium">{isDragOverCategory ? 'Drop here' : 'Add'}</span>
              </div>
            ) : (
              <h2 className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
            )}
          </div>
        </div>

        {/* Links Grid - Right Side */}
        <div className={`flex-1 ${getGridClasses()}`}>
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

      {/* Mobile Layout */}
      <div 
        className={`md:hidden mb-4 animate-fade-in transition-all duration-300 ${
          draggedItem || isDragOverCategory ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
        } ${isDragOverCategory ? 'bg-purple-50/50 dark:bg-purple-900/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Category Header */}
        <div 
          className={`flex items-center justify-between mb-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/50 hover:bg-slate-800/70' 
              : 'bg-white/50 hover:bg-white/80'
          } ${isDragOverCategory ? 'bg-purple-200/50 dark:bg-purple-800/50' : ''}`}
          onTouchStart={() => setIsHoveringCategory(true)}
          onTouchEnd={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full`}></div>
            <h2 className={`text-base font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-300' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {links.length}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } ${isDragOverCategory ? 'bg-purple-200/50 dark:bg-purple-800/50' : ''}`}>
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">{isDragOverCategory ? 'Drop' : 'Add'}</span>
          </div>
        </div>

        {/* Mobile Links Grid */}
        <div className={`${getMobileGridClasses()}`}>
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
    </>
  );
};
