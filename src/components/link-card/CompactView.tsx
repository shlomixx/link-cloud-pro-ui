import React, { useState } from 'react';
import { Star, GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export const CompactView: React.FC<BaseLinkCardProps> = ({
  link,
  isDarkMode,
  hoveredLink,
  clickedLink,
  categories = [],
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  onToggleFavorite,
  onEdit,
  onCopyUrl,
  onDelete,
  onChangeCategory,
  onDragStart,
  onAdd,
}) => {
  const isClicked = clickedLink === link.key;
  const isDesktop = useIsDesktop();
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    onMouseEnter();
    setHoverTimeout(setTimeout(() => {
      setIsHovered(true);
    }, 1000));
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(false);
  };

  const handleAdd = onAdd ? onAdd : () => console.log('Add action triggered');

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onLinkClick}
          {...(isDesktop ? { 
            draggable: "true",
            onDragStart: (e: React.DragEvent) => {
              e.stopPropagation();
              e.dataTransfer.setData('application/json', JSON.stringify({ type: 'link', key: link.key }));
              e.dataTransfer.effectAllowed = 'move';
              onDragStart?.();
            }
          } : {})}
          className={`
            group relative flex flex-col items-center gap-2 p-3 cursor-pointer min-w-[60px] max-w-[60px]
            transition-all duration-300 hover:scale-105 hover:translate-y-[-2px]
            ${isClicked ? 'scale-95' : ''}
            ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
        >
          {isHovered && (
             <div className="absolute top-0 right-0 flex flex-col gap-0.5 z-20">
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd();
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
               <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 cursor-grab"
              >
                <GripVertical className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
            {link.isFavorite && (
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1 drop-shadow-lg" />
            )}
          </div>
          
          <span className="text-white/90 text-xs text-center truncate w-full font-medium group-hover:text-white transition-all duration-200">
            {link.name}
          </span>
        </div>
      </ContextMenuTrigger>
      <LinkCardContextMenu
        link={link}
        isDarkMode={isDarkMode}
        categories={categories}
        onEdit={onEdit}
        onCopyUrl={onCopyUrl}
        onToggleFavorite={() => onToggleFavorite({} as React.MouseEvent)}
        onChangeCategory={onChangeCategory}
        onDelete={onDelete}
      />
    </ContextMenu>
  );
};