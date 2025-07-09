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

  const getCategoryDesign = () => {
    const designs: Record<string, any> = {
      tools: {
        shape: 'w-2 h-8 rounded-none bg-gradient-to-b from-orange-400 to-orange-600',
        text: 'text-orange-100 text-xl font-bold tracking-wide',
        background: 'bg-gradient-to-r from-orange-500/10 to-transparent',
        icon: '🔧'
      },
      streaming: {
        shape: 'w-3 h-6 rounded-full bg-gradient-to-b from-green-400 to-green-600 animate-pulse',
        text: 'text-green-100 text-xl font-semibold tracking-normal',
        background: 'bg-gradient-to-r from-green-500/10 to-transparent',
        icon: '▶️'
      },
      social: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-500/30',
        text: 'text-pink-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-pink-500/10 to-transparent',
        icon: '💬'
      },
      shopping: {
        shape: 'w-6 h-3 rounded-sm bg-gradient-to-r from-yellow-400 to-yellow-600 rotate-45',
        text: 'text-yellow-100 text-xl font-bold tracking-wider',
        background: 'bg-gradient-to-r from-yellow-500/10 to-transparent',
        icon: '🛒'
      },
      education: {
        shape: 'w-2 h-10 rounded-full bg-gradient-to-t from-blue-400 to-blue-600',
        text: 'text-blue-100 text-xl font-light tracking-widest',
        background: 'bg-gradient-to-r from-blue-500/10 to-transparent',
        icon: '📚'
      },
      news: {
        shape: 'w-8 h-2 rounded-none bg-gradient-to-r from-red-400 to-red-600',
        text: 'text-red-100 text-xl font-black tracking-tight',
        background: 'bg-gradient-to-r from-red-500/10 to-transparent',
        icon: '📰'
      },
      ai: {
        shape: 'w-3 h-3 rounded-none bg-gradient-to-br from-purple-400 to-purple-600 rotate-45 animate-spin-slow',
        text: 'text-purple-100 text-xl font-mono tracking-wide',
        background: 'bg-gradient-to-r from-purple-500/10 to-transparent',
        icon: '🤖'
      },
      languages: {
        shape: 'w-1 h-12 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600',
        text: 'text-indigo-100 text-xl font-serif tracking-wide',
        background: 'bg-gradient-to-r from-indigo-500/10 to-transparent',
        icon: '🗣️'
      },
      learning: {
        shape: 'w-4 h-6 rounded-tr-full rounded-bl-full bg-gradient-to-br from-cyan-400 to-cyan-600',
        text: 'text-cyan-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-cyan-500/10 to-transparent',
        icon: '🎓'
      },
      technology: {
        shape: 'w-5 h-5 rounded-sm bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-teal-300',
        text: 'text-teal-100 text-xl font-semibold tracking-wide',
        background: 'bg-gradient-to-r from-teal-500/10 to-transparent',
        icon: '💻'
      },
      design: {
        shape: 'w-6 h-6 rounded-tl-full rounded-br-full bg-gradient-to-br from-rose-400 to-rose-600',
        text: 'text-rose-100 text-xl font-light tracking-wider',
        background: 'bg-gradient-to-r from-rose-500/10 to-transparent',
        icon: '🎨'
      },
      business: {
        shape: 'w-3 h-8 rounded-sm bg-gradient-to-b from-violet-400 to-violet-600 skew-x-12',
        text: 'text-violet-100 text-xl font-semibold tracking-wide',
        background: 'bg-gradient-to-r from-violet-500/10 to-transparent',
        icon: '💼'
      },
      finance: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30',
        text: 'text-emerald-100 text-xl font-bold tracking-wide',
        background: 'bg-gradient-to-r from-emerald-500/10 to-transparent',
        icon: '💰'
      },
      entertainment: {
        shape: 'w-5 h-5 rounded-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 animate-bounce',
        text: 'text-fuchsia-100 text-xl font-playful tracking-wide',
        background: 'bg-gradient-to-r from-fuchsia-500/10 to-transparent',
        icon: '🎬'
      },
      communication: {
        shape: 'w-2 h-6 rounded-full bg-gradient-to-b from-sky-400 to-sky-600',
        text: 'text-sky-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-sky-500/10 to-transparent',
        icon: '📞'
      },
      productivity: {
        shape: 'w-6 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600',
        text: 'text-amber-100 text-xl font-semibold tracking-wide',
        background: 'bg-gradient-to-r from-amber-500/10 to-transparent',
        icon: '⚡'
      },
      health: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 animate-pulse',
        text: 'text-red-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-red-500/10 to-transparent',
        icon: '❤️'
      },
      music: {
        shape: 'w-3 h-7 rounded-full bg-gradient-to-b from-pink-500 to-pink-700 animate-pulse',
        text: 'text-pink-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-pink-500/10 to-transparent',
        icon: '🎵'
      },
      photography: {
        shape: 'w-5 h-5 rounded-sm bg-gradient-to-br from-slate-400 to-slate-600 border border-slate-300',
        text: 'text-slate-100 text-xl font-light tracking-wide',
        background: 'bg-gradient-to-r from-slate-500/10 to-transparent',
        icon: '📸'
      },
      art: {
        shape: 'w-4 h-6 rounded-tr-full rounded-bl-full bg-gradient-to-br from-purple-500 to-purple-700',
        text: 'text-purple-100 text-xl font-artistic tracking-wide',
        background: 'bg-gradient-to-r from-purple-500/10 to-transparent',
        icon: '🎭'
      },
      books: {
        shape: 'w-2 h-8 rounded-sm bg-gradient-to-b from-indigo-500 to-indigo-700',
        text: 'text-indigo-100 text-xl font-serif tracking-wide',
        background: 'bg-gradient-to-r from-indigo-500/10 to-transparent',
        icon: '📖'
      },
      sports: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 animate-bounce',
        text: 'text-orange-100 text-xl font-bold tracking-wide',
        background: 'bg-gradient-to-r from-orange-500/10 to-transparent',
        icon: '⚽'
      },
      gaming: {
        shape: 'w-5 h-5 rounded-sm bg-gradient-to-br from-violet-500 to-violet-700 animate-pulse',
        text: 'text-violet-100 text-xl font-mono tracking-wide',
        background: 'bg-gradient-to-r from-violet-500/10 to-transparent',
        icon: '🎮'
      },
      investing: {
        shape: 'w-3 h-6 rounded-sm bg-gradient-to-b from-green-500 to-green-700 rotate-12',
        text: 'text-green-100 text-xl font-bold tracking-wide',
        background: 'bg-gradient-to-r from-green-500/10 to-transparent',
        icon: '📈'
      },
      cryptocurrency: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 animate-spin-slow',
        text: 'text-yellow-100 text-xl font-mono tracking-wide',
        background: 'bg-gradient-to-r from-yellow-500/10 to-transparent',
        icon: '₿'
      },
      freelance: {
        shape: 'w-6 h-3 rounded-sm bg-gradient-to-r from-blue-500 to-blue-700 skew-y-6',
        text: 'text-blue-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-blue-500/10 to-transparent',
        icon: '💪'
      },
      meditation: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 animate-pulse',
        text: 'text-cyan-100 text-xl font-light tracking-widest',
        background: 'bg-gradient-to-r from-cyan-500/10 to-transparent',
        icon: '🧘'
      },
      dating: {
        shape: 'w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 animate-pulse',
        text: 'text-rose-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-rose-500/10 to-transparent',
        icon: '💕'
      },
      parenting: {
        shape: 'w-3 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700',
        text: 'text-emerald-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-emerald-500/10 to-transparent',
        icon: '👶'
      },
      custom: {
        shape: 'w-3 h-6 rounded-sm bg-gradient-to-b from-purple-400 to-purple-600 rotate-45',
        text: 'text-purple-100 text-xl font-medium tracking-wide',
        background: 'bg-gradient-to-r from-purple-500/10 to-transparent',
        icon: '⚙️'
      }
    };
    
    return designs[category] || {
      shape: 'w-2 h-8 rounded-full bg-gradient-to-b from-gray-400 to-gray-600',
      text: 'text-gray-100 text-xl font-medium tracking-wide',
      background: 'bg-gradient-to-r from-gray-500/10 to-transparent',
      icon: '📁'
    };
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
        {/* Unique Category Design - Desktop */}
        <div className={`flex items-center gap-4 min-w-[160px] pt-6 px-4 py-3 rounded-lg ${getCategoryDesign().background}`}>
          <div className="flex items-center gap-3">
            <div className={`${getCategoryDesign().shape} flex items-center justify-center`}>
              <span className="text-xs">{getCategoryDesign().icon}</span>
            </div>
            <div>
              <span className="text-lg opacity-60">{getCategoryDesign().icon}</span>
              <h2 className={getCategoryDesign().text}>
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
            </div>
          </div>
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
        {/* Unique Category Design - Mobile */}
        <div className={`mx-4 mb-6 px-4 py-3 rounded-lg ${getCategoryDesign().background}`}>
          <div className="flex items-center gap-3">
            <div className={`${getCategoryDesign().shape} flex items-center justify-center`}>
              <span className="text-xs">{getCategoryDesign().icon}</span>
            </div>
            <div>
              <span className="text-sm opacity-60">{getCategoryDesign().icon}</span>
              <h2 className={getCategoryDesign().text.replace('text-xl', 'text-lg')}>
                {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
            </div>
          </div>
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
