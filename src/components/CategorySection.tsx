
import React from 'react';
import { Plus } from 'lucide-react';
import { LinkCard } from './LinkCard';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/use-responsive';

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
  onAddLink,
  onDropUrl
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isDragOverCategory, setIsDragOverCategory] = React.useState(false);

  const getGridClasses = () => {
    if (isMobile) {
      switch (viewMode) {
        case 'dense':
          return 'grid grid-cols-4 gap-2';
        case 'compact':
          return 'grid grid-cols-3 gap-3';
        case 'grid':
          return 'grid grid-cols-2 gap-4';
        case 'list':
          return 'flex flex-col gap-3';
        default:
          return 'grid grid-cols-3 gap-3';
      }
    }
    
    if (isTablet) {
      switch (viewMode) {
        case 'dense':
          return 'grid grid-cols-6 gap-2';
        case 'compact':
          return 'grid grid-cols-4 gap-3';
        case 'grid':
          return 'grid grid-cols-3 gap-4';
        case 'list':
          return 'flex flex-col gap-2';
        default:
          return 'grid grid-cols-4 gap-3';
      }
    }

    // Desktop
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

  const renderCategoryHeader = () => {
    const headerSize = isMobile ? 'text-xl' : 'text-2xl';
    const marginBottom = isMobile ? 'mb-10' : 'mb-16';
    const lineWidth = isMobile ? 'w-16' : 'w-24';
    const lineHeight = isMobile ? 'h-0.5' : 'h-1';
    const marginTop = isMobile ? 'mt-4' : 'mt-6';

    return (
      <div 
        className={`group cursor-pointer ${marginBottom} relative`}
        onClick={() => onAddLink(category)}
      >
        <div className="text-center relative">
          <div className={`text-white ${headerSize} font-bold tracking-wide drop-shadow-2xl transition-all duration-300 group-hover:scale-110 text-center`}>
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          
          <div className={marginTop}>
            <div className={`mt-2 ${lineWidth} ${lineHeight} bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full`}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`${isMobile ? 'mb-16' : 'mb-20'} animate-fade-in`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {renderCategoryHeader()}

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
            onLinkClick={() => onLinkClick(link)}
            onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
            onEdit={() => onEditLink(link)}
            onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
            categories={Object.keys(categoryLabels)}
            onChangeCategory={(newCategory) => onDrop({ 
              currentTarget: {}, 
              dataTransfer: { getData: () => link.key } 
            } as unknown as React.DragEvent, newCategory)}
            onDelete={() => {}}
          />
        ))}
        {/* Add Button */}
        {renderAddButton()}
      </div>
    </div>
  );
};
