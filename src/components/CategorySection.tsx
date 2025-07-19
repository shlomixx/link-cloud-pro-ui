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
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onDragStart: (linkKey: string) => void;
  onAddLink: (category: string) => void;
  onDropUrl: (url: string, category: string) => void;
  onReorderLinks: (draggedKey: string, targetKey: string, category: string) => void;
  onDeleteLink: (linkKey: string) => void;
  onToggleFavorite: (linkKey: string) => void;
  linkSize: number;
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
  onEditLink,
  onCopyUrl,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onAddLink,
  onDropUrl,
  onReorderLinks,
  onDeleteLink,
  onToggleFavorite,
  linkSize
}) => {
  const [isHoveringCategory, setIsHoveringCategory] = React.useState(false);
  const [isDragOverCategory, setIsDragOverCategory] = React.useState(false);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-1';
      case 'compact':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-2';
      case 'grid':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3';
      case 'list':
        return 'flex flex-col gap-1';
      default:
        return 'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-5 gap-1 px-6 py-2';
      case 'compact':
        return 'grid grid-cols-5 gap-1 px-6 py-2';
      case 'grid':
        return 'grid grid-cols-5 gap-1 px-6 py-2';
      case 'list':
        return 'flex flex-col gap-1 px-6 py-2';
      default:
        return 'grid grid-cols-5 gap-1 px-6 py-2';
    }
  };

  const getMobileSeparator = () => {
    return (
      <div className="relative flex items-center py-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="px-4">
          <span className="text-white text-2xl font-semibold uppercase tracking-wide">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent" />
      </div>
    );
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
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(false);
    setDragOverIndex(null);
    
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
      // Not internal drag data, continue
    }
    
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onDropUrl(url, category);
    } else {
      onDrop(e, category);
    }
  };

  const handleLinkDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const parsed = JSON.parse(dragData);
        if (parsed.type === 'link' && parsed.key) {
          const draggedLink = links.find(link => link.key === parsed.key);
          if (draggedLink && draggedLink.category === category) {
            setDragOverIndex(index);
          }
        }
      }
    } catch (error) {
      if (draggedItem) {
        const draggedLink = links.find(link => link.key === draggedItem);
        if (draggedLink && draggedLink.category === category) {
          setDragOverIndex(index);
        }
      }
    }
  };

  const handleLinkDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const parsed = JSON.parse(dragData);
        
        if (parsed.type === 'link' && parsed.key) {
          const draggedLink = links.find(link => link.key === parsed.key);
          const targetLink = links[targetIndex];
          
          if (draggedLink && targetLink && draggedLink.category === category && targetLink.category === category) {
            onReorderLinks(parsed.key, targetLink.key, category);
            return;
          }
        }
      }
    } catch (error) {
      // Fallback for old drag method
    }
    
    if (draggedItem) {
      const draggedLink = links.find(link => link.key === draggedItem);
      const targetLink = links[targetIndex];
      
      if (draggedLink && targetLink && draggedLink.category === category && targetLink.category === category) {
        onReorderLinks(draggedItem, targetLink.key, category);
        return;
      }
    }
    
    handleDrop(e);
  };

  const renderAddButton = () => {
    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg h-full cursor-pointer hover:bg-white/5 transition-colors duration-200"
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="text-xs text-white/50 hover:text-white/70">Add</span>
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Layout - Minimalist Design */}
      <div 
        className="hidden md:block mb-1 animate-slide-up"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between mb-1 px-1">
          <h2 className="text-4xl font-normal text-white tracking-wide">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent ml-8" />
        </div>

        <div className={`${getGridClasses()} min-h-[120px] relative`}>
          {links.map((link, index) => (
            <div
              key={link.key}
              onDragOver={(e) => handleLinkDragOver(e, index)}
              onDrop={(e) => handleLinkDrop(e, index)}
              className={`relative ${dragOverIndex === index ? 'ring-2 ring-blue-400 rounded-lg' : ''}`}
            >
              <LinkCard
                link={link}
                viewMode={viewMode}
                isDarkMode={isDarkMode}
                hoveredLink={hoveredLink}
                clickedLink={clickedLink}
                onMouseEnter={() => onMouseEnter(link.key)}
                onMouseLeave={onMouseLeave}
                onLinkClick={() => onLinkClick(link)}
                onToggleFavorite={(e) => {e.stopPropagation(); onToggleFavorite(link.key);}}
                onEdit={() => onEditLink(link)}
                onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
                onDragStart={() => onDragStart(link.key)}
                onDelete={() => onDeleteLink(link.key)}
                linkSize={linkSize}
              />
            </div>
          ))}
          {renderAddButton()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden mb-1 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-4 mb-1">
          {getMobileSeparator()}
        </div>

        <div className={`${getMobileGridClasses()} relative`}>
          {links.map((link, index) => (
            <div
              key={link.key}
              onDragOver={(e) => handleLinkDragOver(e, index)}
              onDrop={(e) => handleLinkDrop(e, index)}
              className={`relative ${dragOverIndex === index ? 'ring-2 ring-blue-400 rounded-lg' : ''}`}
            >
              <LinkCard
                link={link}
                viewMode={viewMode}
                isDarkMode={isDarkMode}
                hoveredLink={hoveredLink}
                clickedLink={clickedLink}
                onMouseEnter={() => onMouseEnter(link.key)}
                onMouseLeave={onMouseLeave}
                onLinkClick={() => onLinkClick(link)}
                onToggleFavorite={(e) => {e.stopPropagation(); onToggleFavorite(link.key);}}
                onEdit={() => onEditLink(link)}
                onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
                onDragStart={() => onDragStart(link.key)}
                onDelete={() => onDeleteLink(link.key)}
                linkSize={linkSize}
              />
            </div>
          ))}
          {renderAddButton()}
        </div>
      </div>
    </>
  );
};