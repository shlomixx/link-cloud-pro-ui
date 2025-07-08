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

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:block mb-16 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Category Header for Desktop */}
        <div 
          className="flex justify-center mb-12 cursor-pointer group relative"
          onMouseEnter={() => setIsHoveringCategory(true)}
          onMouseLeave={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          <div className="relative flex items-center transition-all duration-700 hover:scale-110">
            {/* Multi-layered Background Effects */}
            <div className={`absolute -inset-12 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-all duration-1000`}></div>
            <div className={`absolute -inset-8 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-8 rounded-2xl blur-xl transition-all duration-700`}></div>
            <div className={`absolute -inset-4 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-10 rounded-xl blur-lg transition-all duration-500`}></div>
            
            {/* Animated Border Ring */}
            <div className={`absolute -inset-6 rounded-full border-2 border-transparent bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-20 transition-all duration-700 animate-pulse`}></div>
            
            {/* Decorative Elements */}
            <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-2">
              <div className={`h-0.5 w-16 bg-gradient-to-r ${getGradientTextClass()} rounded-full`}></div>
              <div className={`h-px w-12 bg-gradient-to-r ${getGradientTextClass()} rounded-full mt-1 opacity-60`}></div>
            </div>
            <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2">
              <div className={`h-0.5 w-16 bg-gradient-to-l ${getGradientTextClass()} rounded-full`}></div>
              <div className={`h-px w-12 bg-gradient-to-l ${getGradientTextClass()} rounded-full mt-1 opacity-60`}></div>
            </div>
            
            {/* Main Title with Enhanced Typography */}
            <h2 className={`text-4xl font-bold tracking-wider transition-all duration-500 bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent relative z-10 font-inter`}>
              <span className="relative inline-block">
                {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
                
                {/* Sophisticated Underline Effect */}
                <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r ${getGradientTextClass()} scale-x-0 group-hover:scale-x-100 transition-all duration-700 rounded-full`}></div>
                <div className={`absolute -bottom-4 left-1/4 right-1/4 h-px bg-gradient-to-r ${getGradientTextClass()} scale-x-0 group-hover:scale-x-100 transition-all duration-500 delay-200 rounded-full opacity-60`}></div>
                
                {/* Floating Accent Dots */}
                <div className={`absolute -top-2 -left-2 w-1 h-1 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300`}></div>
                <div className={`absolute -top-2 -right-2 w-1 h-1 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400`}></div>
              </span>
            </h2>
            
            {/* Subtle Particle Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={`absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-500 animate-pulse`}></div>
              <div className={`absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-700 animate-pulse`}></div>
            </div>
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
        {/* Enhanced Mobile Category Header */}
        <div 
          className="mb-8 cursor-pointer group relative"
          onClick={() => onAddLink(category)}
        >
          <div className="relative flex items-center justify-center transition-all duration-500 group-hover:scale-105">
            {/* Mobile Background Effects */}
            <div className={`absolute -inset-8 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-8 rounded-2xl blur-xl transition-all duration-700`}></div>
            <div className={`absolute -inset-4 bg-gradient-to-r ${getGradientTextClass()} opacity-0 group-hover:opacity-12 rounded-xl blur-lg transition-all duration-500`}></div>
            
            {/* Mobile Title */}
            <h2 className={`text-3xl font-bold tracking-wide transition-all duration-500 bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent relative z-10 font-inter`}>
              <span className="relative inline-block">
                {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
                
                {/* Mobile Underline Effect */}
                <div className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r ${getGradientTextClass()} scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-full`}></div>
                <div className={`absolute -bottom-3 left-1/4 right-1/4 h-px bg-gradient-to-r ${getGradientTextClass()} scale-x-0 group-hover:scale-x-100 transition-all duration-400 delay-100 rounded-full opacity-60`}></div>
              </span>
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
