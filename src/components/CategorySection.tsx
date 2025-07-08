
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
        return 'grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 2xl:grid-cols-24 gap-2';
      case 'compact':
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-3';
      case 'grid':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-4';
      case 'list':
        return 'flex flex-col gap-3';
      default:
        return 'grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-3';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-6 gap-3';
      case 'compact':
        return 'grid grid-cols-4 gap-4';
      case 'grid':
        return 'grid grid-cols-3 gap-5';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-4 gap-4';
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
            group flex items-center gap-6 p-6 rounded-2xl cursor-pointer w-full
            transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl
            bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/15
            border border-white/20 hover:border-white/40
            backdrop-blur-lg hover-lift
          `}
        >
          <div className="flex items-center gap-6 flex-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-300 shadow-xl">
              <Plus className="w-10 h-10 text-white/70 transition-all duration-300 group-hover:text-white group-hover:rotate-90" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-white/70 transition-all duration-300 group-hover:text-white group-hover:gradient-text-primary">
                Add New Link
              </h3>
              <p className="text-sm text-white/40 group-hover:text-white/60 transition-all duration-300">
                Click to create a new link
              </p>
            </div>
          </div>
        </Button>
      );
    }

    // Enhanced styling for grid, compact, and dense views
    const containerClasses = {
      dense: 'flex flex-col items-center justify-center gap-2 p-3 rounded-xl min-w-[80px] h-full transition-all duration-300 hover:scale-110 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/15 border border-white/20 hover:border-white/40 backdrop-blur-lg hover-lift',
      compact: 'flex flex-col items-center justify-center gap-3 p-4 rounded-xl min-w-[90px] max-w-[110px] h-full transition-all duration-300 hover:scale-110 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/15 border border-white/20 hover:border-white/40 backdrop-blur-lg hover-lift',
      grid: 'flex flex-col items-center justify-center gap-4 p-8 rounded-2xl h-full transition-all duration-500 hover:scale-[1.08] bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/15 border border-white/30 hover:border-white/50 backdrop-blur-lg hover-lift shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.25)]'
    };

    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className={`group relative cursor-pointer ${containerClasses[viewMode]}`}
      >
        <div className={`
          ${viewMode === 'grid' ? 'w-20 h-20 rounded-3xl' : viewMode === 'compact' ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-xl'} 
          flex items-center justify-center
          bg-gradient-to-br from-white/20 to-white/10 group-hover:from-white/30 group-hover:to-white/20
          backdrop-blur-sm transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl
        `}>
          <Plus className={`
            ${viewMode === 'dense' ? 'w-6 h-6' : viewMode === 'compact' ? 'w-8 h-8' : 'w-12 h-12'}
            text-white/60 transition-all duration-300 group-hover:text-white group-hover:rotate-90
          `} />
        </div>
        
        <span className={`
          font-semibold text-center truncate w-full leading-tight
          ${viewMode === 'dense' ? 'text-xs max-w-[80px]' : 'text-sm'}
          text-white/60 transition-all duration-300 group-hover:text-white
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
        className="hidden md:block mb-7 animate-slide-up"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Modern Enhanced Category Header for Desktop */}
        <div className="flex items-center gap-6 mb-5 group cursor-pointer hover:translate-x-2 transition-all duration-500 ease-out">
          <div className="relative">
            <div className={`w-4 h-4 rounded-full ${getCategoryColor()} shadow-2xl group-hover:scale-150 transition-all duration-500 ease-out`}></div>
            <div className={`absolute inset-0 w-4 h-4 rounded-full ${getCategoryColor()} opacity-30 group-hover:scale-[2] group-hover:opacity-10 transition-all duration-700 ease-out`}></div>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight group-hover:gradient-text-primary transition-all duration-300 drop-shadow-lg">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent group-hover:from-white/50 group-hover:via-white/20 transition-all duration-500"></div>
        </div>

        {/* Enhanced Clean Links Grid */}
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
        className="md:hidden mb-7 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Modern Mobile Category Header */}
        <div 
          className="group cursor-pointer mb-7 relative"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center relative">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor()} shadow-xl group-hover:scale-125 transition-all duration-300`}></div>
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${getCategoryColor()} opacity-20 group-hover:scale-[1.8] group-hover:opacity-5 transition-all duration-500`}></div>
              </div>
              <div className="text-white text-xl font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:gradient-text-primary">
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="mt-2 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto rounded-full group-hover:via-white/70 transition-all duration-300"></div>
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
