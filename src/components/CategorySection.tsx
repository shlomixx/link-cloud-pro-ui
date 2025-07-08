
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
        className="hidden md:block mb-20 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Category Header for Desktop */}
        <div 
          className="flex justify-center mb-16 cursor-pointer group relative"
          onMouseEnter={() => setIsHoveringCategory(true)}
          onMouseLeave={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          <div className="relative flex items-center justify-center transition-all duration-700 group-hover:scale-105">
            {/* Always Visible Background for Better Text Visibility */}
            <div className={`absolute -inset-16 bg-gradient-to-br ${getGradientTextClass()} opacity-5 rounded-3xl blur-2xl`}></div>
            <div className={`absolute -inset-8 bg-gradient-to-r ${getGradientTextClass()} opacity-8 rounded-2xl blur-xl`}></div>
            
            {/* Enhanced Hover Effects */}
            <div className={`absolute -inset-24 bg-gradient-radial ${getGradientTextClass()} opacity-0 group-hover:opacity-15 rounded-full blur-3xl transition-all duration-1500`}></div>
            <div className={`absolute -inset-16 bg-gradient-to-br ${getGradientTextClass()} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-all duration-1000`}></div>
            
            {/* Category Title with Enhanced Visibility */}
            <div className="relative z-10 text-center">
              <h2 className={`text-7xl font-black tracking-widest transition-all duration-700 bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent relative font-inter drop-shadow-2xl`}>
                <span className="relative inline-block">
                  {/* Text Shadow for Better Visibility */}
                  <span className={`absolute inset-0 text-7xl font-black tracking-widest bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent blur-sm opacity-30`}>
                    {categoryName}
                  </span>
                  
                  {/* Main Text */}
                  <span className="relative z-10">
                    {categoryName}
                  </span>
                  
                  {/* Enhanced Underline Effects */}
                  <div className={`absolute -bottom-6 left-0 right-0 h-2 bg-gradient-to-r ${getGradientTextClass()} scale-x-100 group-hover:scale-x-110 transition-all duration-700 rounded-full shadow-lg opacity-60 group-hover:opacity-100`}></div>
                  <div className={`absolute -bottom-8 left-1/6 right-1/6 h-1 bg-gradient-to-r ${getGradientTextClass()} scale-x-100 group-hover:scale-x-110 transition-all duration-500 delay-200 rounded-full opacity-40 group-hover:opacity-70`}></div>
                  
                  {/* Accent Elements */}
                  <div className={`absolute -top-4 -left-4 w-3 h-3 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-70 group-hover:opacity-100 transition-all duration-700 delay-300 animate-pulse shadow-lg`}></div>
                  <div className={`absolute -top-4 -right-4 w-3 h-3 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-70 group-hover:opacity-100 transition-all duration-700 delay-500 animate-pulse shadow-lg`}></div>
                </span>
              </h2>
              
              {/* Always Visible Subtitle */}
              <div className="mt-6 opacity-80 group-hover:opacity-100 transition-all duration-500">
                <p className={`text-lg font-bold tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent`}>
                  {links.length} {links.length === 1 ? 'קישור' : 'קישורים'}
                </p>
              </div>
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
        className="md:hidden mb-16 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Mobile Category Header */}
        <div 
          className="mb-12 cursor-pointer group relative"
          onClick={() => onAddLink(category)}
        >
          <div className="relative flex items-center justify-center transition-all duration-700 group-hover:scale-105">
            {/* Always Visible Mobile Background */}
            <div className={`absolute -inset-12 bg-gradient-to-br ${getGradientTextClass()} opacity-8 rounded-3xl blur-2xl`}></div>
            <div className={`absolute -inset-6 bg-gradient-to-r ${getGradientTextClass()} opacity-12 rounded-2xl blur-xl`}></div>
            
            {/* Mobile Title with Enhanced Visibility */}
            <div className="relative z-10 text-center">
              <h2 className={`text-5xl font-black tracking-wide transition-all duration-700 bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent relative font-inter drop-shadow-xl`}>
                <span className="relative inline-block">
                  {/* Mobile Text Shadow */}
                  <span className={`absolute inset-0 text-5xl font-black tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent blur-sm opacity-25`}>
                    {categoryName}
                  </span>
                  
                  {/* Main Mobile Text */}
                  <span className="relative z-10">
                    {categoryName}
                  </span>
                  
                  {/* Mobile Underline */}
                  <div className={`absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r ${getGradientTextClass()} scale-x-100 group-hover:scale-x-110 transition-all duration-700 rounded-full shadow-md opacity-60 group-hover:opacity-100`}></div>
                  
                  {/* Mobile Accent Dots */}
                  <div className={`absolute -top-2 -left-2 w-2 h-2 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-70 group-hover:opacity-100 transition-all duration-500 delay-300 animate-pulse`}></div>
                  <div className={`absolute -top-2 -right-2 w-2 h-2 bg-gradient-to-r ${getGradientTextClass()} rounded-full opacity-70 group-hover:opacity-100 transition-all duration-500 delay-500 animate-pulse`}></div>
                </span>
              </h2>
              
              {/* Always Visible Mobile Subtitle */}
              <div className="mt-4 opacity-80 group-hover:opacity-100 transition-all duration-400">
                <p className={`text-sm font-bold tracking-wide bg-gradient-to-r ${getGradientTextClass()} bg-clip-text text-transparent`}>
                  {links.length} {links.length === 1 ? 'קישור' : 'קישורים'}
                </p>
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
