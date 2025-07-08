
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
        className="hidden md:block mb-24 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Modern Category Card */}
        <div 
          className="relative group cursor-pointer mb-12"
          onMouseEnter={() => setIsHoveringCategory(true)}
          onMouseLeave={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          {/* Card Background with Glass Effect */}
          <div className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl transition-all duration-700 group-hover:shadow-3xl group-hover:bg-card/60 group-hover:border-border/80 overflow-hidden">
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientTextClass()} opacity-5 group-hover:opacity-10 transition-all duration-700 rounded-3xl`}></div>
            
            {/* Animated Border Glow */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-30 blur-sm transition-all duration-700 rounded-3xl`}></div>
            
            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Category Title */}
              <div className="mb-4">
                <h2 className={`text-5xl font-black tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent transition-all duration-500 group-hover:scale-105 drop-shadow-lg font-sans`}>
                  {categoryName}
                </h2>
                
                {/* Decorative Underline */}
                <div className={`mt-3 h-1 w-24 mx-auto bg-gradient-to-r ${getGradientTextClass()} rounded-full transition-all duration-500 group-hover:w-32 group-hover:h-1.5 shadow-lg`}></div>
              </div>
              
              {/* Stats Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-sm font-medium text-muted-foreground transition-all duration-300 group-hover:bg-background/90 group-hover:text-foreground">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getGradientTextClass()}`}></div>
                <span>{links.length} {links.length === 1 ? 'קישור' : 'קישורים'}</span>
              </div>
              
              {/* Hover Indicator */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-muted-foreground">
                לחץ להוספת קישור חדש
              </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-50 group-hover:opacity-100 transition-all duration-700 animate-pulse`}></div>
            <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-30 group-hover:opacity-80 transition-all duration-500 delay-200 animate-pulse`}></div>
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
        className="md:hidden mb-20 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Category Card */}
        <div 
          className="relative group cursor-pointer mb-8"
          onClick={() => onAddLink(category)}
        >
          {/* Mobile Card Background */}
          <div className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:bg-card/60 group-hover:border-border/80 overflow-hidden">
            {/* Mobile Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientTextClass()} opacity-5 group-hover:opacity-10 transition-all duration-500 rounded-2xl`}></div>
            
            {/* Mobile Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Mobile Title */}
              <div className="mb-3">
                <h2 className={`text-3xl font-black tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 drop-shadow-md font-sans`}>
                  {categoryName}
                </h2>
                
                {/* Mobile Decorative Line */}
                <div className={`mt-2 h-0.5 w-16 mx-auto bg-gradient-to-r ${getGradientTextClass()} rounded-full transition-all duration-300 group-hover:w-20`}></div>
              </div>
              
              {/* Mobile Stats */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium text-muted-foreground transition-all duration-300 group-hover:bg-background/90">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getGradientTextClass()}`}></div>
                <span>{links.length} {links.length === 1 ? 'קישור' : 'קישורים'}</span>
              </div>
            </div>
            
            {/* Mobile Decorative Elements */}
            <div className={`absolute top-3 right-3 w-2 h-2 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse`}></div>
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
