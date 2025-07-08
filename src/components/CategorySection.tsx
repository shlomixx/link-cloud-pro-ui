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
        return 'grid grid-cols-6 gap-2';
      case 'compact':
        return 'grid grid-cols-4 gap-3';
      case 'grid':
        return 'grid grid-cols-3 gap-4';
      case 'list':
        return 'flex flex-col gap-3';
      default:
        return 'grid grid-cols-4 gap-3';
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
            
            <h2 className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
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

      {/* Enhanced Mobile Layout */}
      <div 
        className="md:hidden mb-6 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Mobile Category Header */}
        <div 
          className={`relative mb-4 cursor-pointer group ${
            isDragOverCategory ? 'scale-[1.02]' : ''
          } transition-transform duration-200`}
          onClick={() => onAddLink(category)}
        >
          {/* Category Background */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-800/40 to-slate-700/30 group-hover:from-slate-800/60 group-hover:to-slate-700/50' 
              : 'bg-gradient-to-r from-slate-50/80 to-white/60 group-hover:from-slate-100/90 group-hover:to-white/80'
          } ${isDragOverCategory ? 'from-purple-100/80 to-purple-50/60 dark:from-purple-900/40 dark:to-purple-800/30' : ''}`}></div>
          
          {/* Content */}
          <div className="relative px-5 py-4">
            <div className="flex items-center gap-4">
              {/* Enhanced Color Indicator */}
              <div className={`relative flex-shrink-0`}>
                <div className={`h-3 w-8 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full shadow-sm`}></div>
                <div className={`absolute -inset-1 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full opacity-20 blur-sm`}></div>
              </div>
              
              {/* Category Title */}
              <div className="flex-1">
                <h2 className={`text-lg font-semibold tracking-tight transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <div className={`text-xs font-medium mt-0.5 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Tap to add new link
                </div>
              </div>
            </div>
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
