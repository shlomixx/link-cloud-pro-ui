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
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-3';
      case 'compact':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-4';
      case 'grid':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-5';
      case 'list':
        return 'flex flex-col gap-3';
      default:
        return 'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-4';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-5 gap-6 px-6 py-4';
      case 'compact':
        return 'grid grid-cols-5 gap-6 px-6 py-4';
      case 'grid':
        return 'grid grid-cols-5 gap-6 px-6 py-4';
      case 'list':
        return 'flex flex-col gap-4 px-6 py-4';
      default:
        return 'grid grid-cols-5 gap-6 px-6 py-4';
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

  const getCategoryGradientColors = () => {
    const gradientMap: Record<string, { from: string; via1: string; via2: string; to: string }> = {
      tools: { from: 'from-orange-500/20', via1: 'via-orange-400', via2: 'via-orange-300', to: 'to-orange-500/20' },
      streaming: { from: 'from-green-500/20', via1: 'via-green-400', via2: 'via-green-300', to: 'to-green-500/20' },
      social: { from: 'from-pink-500/20', via1: 'via-pink-400', via2: 'via-pink-300', to: 'to-pink-500/20' },
      shopping: { from: 'from-yellow-500/20', via1: 'via-yellow-400', via2: 'via-yellow-300', to: 'to-yellow-500/20' },
      education: { from: 'from-blue-500/20', via1: 'via-blue-400', via2: 'via-blue-300', to: 'to-blue-500/20' },
      news: { from: 'from-red-500/20', via1: 'via-red-400', via2: 'via-red-300', to: 'to-red-500/20' },
      ai: { from: 'from-purple-500/20', via1: 'via-purple-400', via2: 'via-purple-300', to: 'to-purple-500/20' },
      languages: { from: 'from-indigo-500/20', via1: 'via-indigo-400', via2: 'via-indigo-300', to: 'to-indigo-500/20' },
      learning: { from: 'from-cyan-500/20', via1: 'via-cyan-400', via2: 'via-cyan-300', to: 'to-cyan-500/20' },
      technology: { from: 'from-teal-500/20', via1: 'via-teal-400', via2: 'via-teal-300', to: 'to-teal-500/20' },
      design: { from: 'from-rose-500/20', via1: 'via-rose-400', via2: 'via-rose-300', to: 'to-rose-500/20' },
      business: { from: 'from-violet-500/20', via1: 'via-violet-400', via2: 'via-violet-300', to: 'to-violet-500/20' },
      finance: { from: 'from-emerald-500/20', via1: 'via-emerald-400', via2: 'via-emerald-300', to: 'to-emerald-500/20' },
      entertainment: { from: 'from-fuchsia-500/20', via1: 'via-fuchsia-400', via2: 'via-fuchsia-300', to: 'to-fuchsia-500/20' },
      communication: { from: 'from-sky-500/20', via1: 'via-sky-400', via2: 'via-sky-300', to: 'to-sky-500/20' },
      productivity: { from: 'from-amber-500/20', via1: 'via-amber-400', via2: 'via-amber-300', to: 'to-amber-500/20' },
      health: { from: 'from-red-600/20', via1: 'via-red-500', via2: 'via-red-400', to: 'to-red-600/20' },
      music: { from: 'from-pink-600/20', via1: 'via-pink-500', via2: 'via-pink-400', to: 'to-pink-600/20' },
      photography: { from: 'from-slate-500/20', via1: 'via-slate-400', via2: 'via-slate-300', to: 'to-slate-500/20' },
      art: { from: 'from-purple-600/20', via1: 'via-purple-500', via2: 'via-purple-400', to: 'to-purple-600/20' },
      books: { from: 'from-indigo-600/20', via1: 'via-indigo-500', via2: 'via-indigo-400', to: 'to-indigo-600/20' },
      sports: { from: 'from-orange-600/20', via1: 'via-orange-500', via2: 'via-orange-400', to: 'to-orange-600/20' },
      gaming: { from: 'from-violet-600/20', via1: 'via-violet-500', via2: 'via-violet-400', to: 'to-violet-600/20' },
      investing: { from: 'from-green-600/20', via1: 'via-green-500', via2: 'via-green-400', to: 'to-green-600/20' },
      cryptocurrency: { from: 'from-yellow-600/20', via1: 'via-yellow-500', via2: 'via-yellow-400', to: 'to-yellow-600/20' },
      freelance: { from: 'from-blue-600/20', via1: 'via-blue-500', via2: 'via-blue-400', to: 'to-blue-600/20' },
      meditation: { from: 'from-cyan-600/20', via1: 'via-cyan-500', via2: 'via-cyan-400', to: 'to-cyan-600/20' },
      dating: { from: 'from-rose-600/20', via1: 'via-rose-500', via2: 'via-rose-400', to: 'to-rose-600/20' },
      parenting: { from: 'from-emerald-600/20', via1: 'via-emerald-500', via2: 'via-emerald-400', to: 'to-emerald-600/20' },
    };
    
    return gradientMap[category] || { from: 'from-purple-500/20', via1: 'via-purple-400', via2: 'via-purple-300', to: 'to-purple-500/20' };
  };

  const getMobileSeparator = () => {
    return (
      <div className="relative flex items-center py-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="px-6">
          <span className="text-white/90 text-lg font-semibold uppercase tracking-wide">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent" />
      </div>
    );
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
      {/* Desktop Layout - Minimalist Design */}
      <div 
        className="hidden md:block mb-8 animate-slide-up"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Minimalist Category Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-2xl font-light text-white/90 tracking-wide">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent ml-8" />
        </div>

        {/* Clean Links Grid */}
        <div className={`${getGridClasses()} min-h-[120px]`}>
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
        className="md:hidden mb-8 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Larger Category Separator for Mobile */}
        <div className="mx-4 mb-6">
          {getMobileSeparator()}
        </div>

        {/* Links Grid */}
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
