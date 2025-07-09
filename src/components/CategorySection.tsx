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
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'compact':
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'grid':
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'list':
        return 'flex flex-col gap-1 px-2 py-1';
      default:
        return 'grid grid-cols-6 gap-2 px-2 py-1';
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

  const getMobileSeparator = () => {
    const separators: Record<string, JSX.Element> = {
      tools: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-orange-400 rotate-45" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rotate-45" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-orange-400 rotate-45" />
            ))}
          </div>
        </div>
      ),
      streaming: (
        <div className="relative flex items-center">
          <div className="flex-1 h-4 overflow-hidden">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <path d="M0,10 Q25,0 50,10 T100,10" stroke="rgb(34, 197, 94)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-4 overflow-hidden">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <path d="M0,10 Q25,0 50,10 T100,10" stroke="rgb(34, 197, 94)" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      ),
      social: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-pink-400 rounded-full transform rotate-45" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-pink-400 rounded-full transform rotate-45" />
            ))}
          </div>
        </div>
      ),
      shopping: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 border border-yellow-400 rounded-sm" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-sm" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 border border-yellow-400 rounded-sm" />
            ))}
          </div>
        </div>
      ),
      education: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-3 h-2 bg-blue-400 rounded-t-sm" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-400 to-transparent" />
        </div>
      ),
      news: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`w-0.5 ${i % 2 === 0 ? 'h-2' : 'h-1'} bg-red-400`} />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`w-0.5 ${i % 2 === 0 ? 'h-2' : 'h-1'} bg-red-400`} />
            ))}
          </div>
        </div>
      ),
      ai: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-purple-400 transform rotate-45" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-purple-400 transform rotate-45" />
            ))}
          </div>
        </div>
      ),
      technology: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-teal-400 transform rotate-45" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 border-2 border-teal-400 transform rotate-45" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-teal-400 transform rotate-45" />
            ))}
          </div>
        </div>
      ),
      design: (
        <div className="relative flex items-center">
          <div className="flex-1 h-4 overflow-hidden">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <path d="M0,10 C20,0 30,20 50,10 C70,0 80,20 100,10" stroke="rgb(244, 63, 94)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-4 overflow-hidden">
            <svg viewBox="0 0 100 20" className="w-full h-full">
              <path d="M0,10 C20,0 30,20 50,10 C70,0 80,20 100,10" stroke="rgb(244, 63, 94)" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      ),
      music: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`w-0.5 bg-pink-500 ${i % 3 === 0 ? 'h-3' : i % 3 === 1 ? 'h-2' : 'h-1'}`} />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`w-0.5 bg-pink-500 ${i % 3 === 0 ? 'h-3' : i % 3 === 1 ? 'h-2' : 'h-1'}`} />
            ))}
          </div>
        </div>
      ),
      gaming: (
        <div className="relative flex items-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-violet-500 rounded-full" />
            ))}
          </div>
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-500 rounded-sm" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-violet-500 rounded-full" />
            ))}
          </div>
        </div>
      ),
      // Default pattern for other categories
      default: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-white/20" />
          <div className="px-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor()}`} />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-white/20" />
        </div>
      )
    };
    
    return separators[category] || separators.default;
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
        className="md:hidden mb-8 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Unique Category Separator */}
        <div className="mx-4 mb-6">
          {getMobileSeparator()}
        </div>

        {/* Links Grid with Better Spacing */}
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
