
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
    if (viewMode === 'list') {
      return (
        <Button
          onClick={() => onAddLink(category)}
          variant="ghost"
          className={`
            group flex items-center gap-6 p-5 rounded-xl cursor-pointer w-full
            transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
            ${isDarkMode 
              ? 'bg-slate-800/20 hover:bg-slate-700/30 border border-slate-700/50 hover:border-slate-600/70' 
              : 'bg-white/20 hover:bg-white/30 border border-white/20 hover:border-white/40'
            }
            backdrop-blur-sm
          `}
        >
          <div className="flex items-center gap-6 flex-1">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'}
              backdrop-blur-sm
            `}>
              <Plus className="w-8 h-8 text-white/60 transition-colors duration-200 group-hover:text-white/80" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white/60 transition-colors duration-200 group-hover:text-white/80">
                Add New Link
              </h3>
            </div>
          </div>
        </Button>
      );
    }

    // For grid, compact, and dense views
    const containerClasses = {
      dense: 'flex flex-col items-center justify-center gap-1 p-2 rounded min-w-[70px] h-full',
      compact: 'flex flex-col items-center justify-center gap-2 p-3 rounded min-w-[80px] max-w-[100px] h-full',
      grid: `
        flex flex-col items-center justify-center gap-3 p-6 rounded-xl h-full
        transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl
        ${isDarkMode 
          ? 'bg-slate-800/20 hover:bg-slate-700/30 border border-slate-700/50 hover:border-slate-600/70' 
          : 'bg-white/20 hover:bg-white/30 border border-white/20 hover:border-white/40'
        }
        backdrop-blur-sm
      `
    };

    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className={`
          group relative cursor-pointer
          ${containerClasses[viewMode]}
        `}
      >
        <div className={`
          ${viewMode === 'grid' ? 'w-16 h-16 rounded-2xl' : ''} 
          flex items-center justify-center
          ${viewMode === 'grid' ? (isDarkMode ? 'bg-slate-700/50' : 'bg-white/50') : ''}
          ${viewMode === 'grid' ? 'backdrop-blur-sm transition-all duration-300 group-hover:scale-110' : ''}
        `}>
          <Plus className={`
            ${viewMode === 'dense' ? 'w-5 h-5' : viewMode === 'compact' ? 'w-6 h-6' : 'w-10 h-10'}
            text-white/50 transition-colors duration-200 group-hover:text-white/70
          `} />
        </div>
        
        <span className={`
          font-medium text-center truncate w-full leading-tight
          ${viewMode === 'dense' ? 'text-xs max-w-[70px]' : 'text-sm'}
          text-white/50 transition-colors duration-200 group-hover:text-white/70
        `}>
          Add Link
        </span>
      </Button>
    );
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
        {/* Enhanced Minimalist Category Header for Desktop */}
        <div className="flex items-center gap-4 mb-8 group cursor-pointer hover:translate-x-1 transition-all duration-200">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor()} shadow-lg group-hover:scale-125 transition-all duration-200`}></div>
          <h2 className="text-white text-xl font-semibold tracking-wide group-hover:text-white/90 transition-all duration-200">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent"></div>
        </div>

        {/* Enhanced Clean Links Grid */}
        <div className="flex flex-wrap gap-6 mb-8">
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
            />
          ))}
          {renderAddButton()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden mb-16 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Simplified Mobile Category Header */}
        <div 
          className="group cursor-pointer mb-10 relative"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center relative">
            <div className="text-white text-xl font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-105 text-center">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            
            <div className="mt-4">
              <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
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
            />
          ))}
          {renderAddButton()}
        </div>
      </div>
    </>
  );
};
