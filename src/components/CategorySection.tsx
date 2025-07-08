
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

  const getCategoryGradient = () => {
    const gradientMap: Record<string, string> = {
      work: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      social: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-600 shadow-[0_0_40px_rgba(236,72,153,0.3)]',
      entertainment: 'bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 shadow-[0_0_40px_rgba(147,51,234,0.3)]',
      tools: 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 shadow-[0_0_40px_rgba(249,115,22,0.3)]',
      news: 'bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600 shadow-[0_0_40px_rgba(107,114,128,0.3)]',
      shopping: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-[0_0_40px_rgba(34,197,94,0.3)]',
      education: 'bg-gradient-to-br from-indigo-400 via-blue-500 to-cyan-600 shadow-[0_0_40px_rgba(99,102,241,0.3)]',
      finance: 'bg-gradient-to-br from-emerald-400 via-green-500 to-lime-600 shadow-[0_0_40px_rgba(16,185,129,0.3)]',
      health: 'bg-gradient-to-br from-red-400 via-pink-500 to-rose-600 shadow-[0_0_40px_rgba(239,68,68,0.3)]',
      travel: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-[0_0_40px_rgba(14,165,233,0.3)]',
      food: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-[0_0_40px_rgba(245,158,11,0.3)]',
      sports: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 shadow-[0_0_40px_rgba(245,158,11,0.3)]',
      gaming: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 shadow-[0_0_40px_rgba(139,92,246,0.3)]',
      music: 'bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-600 shadow-[0_0_40px_rgba(217,70,239,0.3)]',
      photography: 'bg-gradient-to-br from-slate-400 via-gray-500 to-zinc-600 shadow-[0_0_40px_rgba(100,116,139,0.3)]',
      design: 'bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 shadow-[0_0_40px_rgba(244,63,94,0.3)]',
      development: 'bg-gradient-to-br from-green-400 via-teal-500 to-cyan-600 shadow-[0_0_40px_rgba(20,184,166,0.3)]',
      business: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600 shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      personal: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 shadow-[0_0_40px_rgba(6,182,212,0.3)]',
      other: 'bg-gradient-to-br from-neutral-400 via-stone-500 to-gray-600 shadow-[0_0_40px_rgba(115,115,115,0.3)]',
      custom: 'bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 shadow-[0_0_40px_rgba(147,51,234,0.3)]'
    };
    
    return gradientMap[category] || 'bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600 shadow-[0_0_40px_rgba(107,114,128,0.3)]';
  };

  const renderAddButton = () => {
    if (viewMode === 'list') {
      return (
        <Button
          onClick={() => onAddLink(category)}
          variant="ghost"
          className="group flex items-center gap-5 p-4 rounded cursor-pointer w-full transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-5 flex-1">
            <Plus className="w-6 h-6 text-white/50 transition-colors duration-200 group-hover:text-white/70" />
            <div className="flex-1">
              <h3 className="font-medium text-lg text-white/50 transition-colors duration-200 group-hover:text-white/70">
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
      grid: 'flex flex-col items-center justify-center gap-3 p-5 rounded h-full'
    };

    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className={`
          group relative ${containerClasses[viewMode]}
          transition-all duration-200 hover:scale-110 cursor-pointer
        `}
      >
        <Plus className={`
          ${viewMode === 'dense' ? 'w-5 h-5' : viewMode === 'compact' ? 'w-6 h-6' : 'w-8 h-8'}
          text-white/50 transition-colors duration-200 group-hover:text-white/70
        `} />
        
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
        className="hidden md:block mb-20 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Simplified Category Header */}
        <div 
          className="group cursor-pointer mb-16 relative"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center relative">
            {/* Category text label only */}
            <div className="text-white text-2xl font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-110 text-center">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            
            {/* Only the line under the category name */}
            <div className="mt-6">
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Links Grid with Add Button */}
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
          {/* Add Button */}
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
            {/* Mobile Category text label only */}
            <div className="text-white text-xl font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-105 text-center">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            
            {/* Mobile line under category name */}
            <div className="mt-4">
              <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Mobile Links Grid with Add Button */}
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
          {/* Add Button */}
          {renderAddButton()}
        </div>
      </div>
    </>
  );
};
