
import React from 'react';
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
    
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onDropUrl(url, category);
    } else {
      onDrop(e, category);
    }
  };

  const getGradientTextClass = () => {
    const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.custom;
    return colorClass.replace('from-', 'from-').replace('to-', 'to-');
  };

  const categoryName = categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:block mb-16 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Simple Category Header */}
        <div 
          className="group cursor-pointer mb-8"
          onMouseEnter={() => setIsHoveringCategory(true)}
          onMouseLeave={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          <div className="text-center">
            {/* Category Title Only */}
            <h2 className={`text-4xl font-bold tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 font-sans`}>
              {categoryName}
            </h2>
          </div>
        </div>

        {/* Links Grid */}
        <div className={`${getGridClasses()}`}>
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
        className="md:hidden mb-12 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Category Header */}
        <div 
          className="group cursor-pointer mb-6"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center">
            {/* Mobile Category Title Only */}
            <h2 className={`text-3xl font-bold tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 font-sans`}>
              {categoryName}
            </h2>
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
