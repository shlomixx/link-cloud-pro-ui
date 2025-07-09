import React from 'react';
import { Plus } from 'lucide-react';
import { LinkCard } from './LinkCard';
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
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-4';
      case 'compact':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-5';
      case 'grid':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-6';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-5';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-5 gap-0.5 px-1 py-1';
      case 'compact':
        return 'grid grid-cols-5 gap-0.5 px-1 py-1';
      case 'grid':
        return 'grid grid-cols-5 gap-0.5 px-1 py-1';
      case 'list':
        return 'flex flex-col gap-1 px-1 py-1';
      default:
        return 'grid grid-cols-5 gap-0.5 px-1 py-1';
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
    
    // First check for internal link drag data
    try {
      const internalData = e.dataTransfer.getData('application/json');
      if (internalData) {
        const parsed = JSON.parse(internalData);
        if (parsed.type === 'link' && parsed.key) {
          onDrop(e, category);
          return;
        }
      }
    } catch (error) {
      // Not internal drag data, continue with URL check
    }
    
    // Then check for external URL drops
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onDropUrl(url, category);
    } else {
      onDrop(e, category);
    }
  };

  const getCategoryColor = () => {
    const colorMap: Record<string, string> = {
      tools: 'bg-orange-400',
      streaming: 'bg-green-400',
      social: 'bg-pink-400',
      shopping: 'bg-yellow-400',
      education: 'bg-blue-400',
      news: 'bg-red-400',
      ai: 'bg-purple-400',
      languages: 'bg-indigo-400',
      learning: 'bg-cyan-400',
      technology: 'bg-teal-400',
      design: 'bg-rose-400',
      business: 'bg-violet-400',
      finance: 'bg-emerald-400',
      entertainment: 'bg-fuchsia-400',
      communication: 'bg-sky-400',
      productivity: 'bg-amber-400',
      health: 'bg-red-500',
      music: 'bg-pink-500',
      photography: 'bg-slate-400',
      art: 'bg-purple-500',
      books: 'bg-indigo-500',
      sports: 'bg-orange-500',
      gaming: 'bg-violet-500',
      investing: 'bg-green-500',
      cryptocurrency: 'bg-yellow-500',
      freelance: 'bg-blue-500',
      meditation: 'bg-cyan-500',
      dating: 'bg-rose-500',
      parenting: 'bg-emerald-500',
      custom: 'bg-purple-400'
    };
    
    return colorMap[category] || 'bg-gray-400';
  };

  const renderAddButton = () => {
    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg h-full cursor-pointer hover:bg-white/5 transition-colors duration-200"
      >
        <Plus className="w-5 h-5 text-white/50 hover:text-white/70" />
        <span className="text-xs text-white/50 hover:text-white/70">Add</span>
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:flex items-start gap-12 mb-10 animate-slide-up"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Minimalistic Category Sidebar - Left Side */}
        <div className="flex items-center gap-3 min-w-[120px] pt-4">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor()}`}></div>
          <h2 className="text-white text-lg font-medium">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
        </div>

        {/* Enhanced Links Grid - Right Side */}
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
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
              onDragStart={() => onDragStart(link.key)}
            />
          ))}
          {renderAddButton()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden mb-4 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Mobile Category Header */}
        <div className="mb-3 px-4">
          <div className="flex items-center justify-center">
            <div className="relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getCategoryColor()} shadow-sm`}></div>
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

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
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
              onDragStart={() => onDragStart(link.key)}
            />
          ))}
          {renderAddButton()}
        </div>
        
        {/* Mobile Category Separator */}
        <div className="mx-4 mt-4 mb-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>
    </>
  );
};
