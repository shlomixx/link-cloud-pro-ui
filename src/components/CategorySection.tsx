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
        return 'grid grid-cols-6 gap-1 px-4 py-0';
      case 'compact':
        return 'grid grid-cols-4 gap-2 px-4 py-0';
      case 'grid':
        return 'grid grid-cols-3 gap-2 px-4 py-0';
      case 'list':
        return 'flex flex-col gap-1 px-4 py-0';
      default:
        return 'grid grid-cols-4 gap-2 px-4 py-0';
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
      tools: 'text-orange-400',
      streaming: 'text-green-400',
      social: 'text-pink-400',
      shopping: 'text-yellow-400',
      education: 'text-blue-400',
      news: 'text-red-400',
      ai: 'text-purple-400',
      languages: 'text-indigo-400',
      learning: 'text-cyan-400',
      technology: 'text-teal-400',
      design: 'text-rose-400',
      business: 'text-violet-400',
      finance: 'text-emerald-400',
      entertainment: 'text-fuchsia-400',
      communication: 'text-sky-400',
      productivity: 'text-amber-400',
      health: 'text-red-500',
      music: 'text-pink-500',
      photography: 'text-slate-400',
      art: 'text-purple-500',
      books: 'text-indigo-500',
      sports: 'text-orange-500',
      gaming: 'text-violet-500',
      investing: 'text-green-500',
      cryptocurrency: 'text-yellow-500',
      freelance: 'text-blue-500',
      meditation: 'text-cyan-500',
      dating: 'text-rose-500',
      parenting: 'text-emerald-500',
      custom: 'text-purple-400'
    };
    
    return colorMap[category] || 'text-gray-400';
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
          <h2 className={`text-lg font-medium ${getCategoryColor()}`}>
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
        <div 
          className="group cursor-pointer mb-4 relative active:scale-95 transition-all duration-200"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center relative p-3 rounded-2xl transition-all duration-300 group-active:bg-white/5">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className={`text-base font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-105 group-active:scale-102 ${getCategoryColor()}`}>
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
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
      </div>
    </>
  );
};
