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
  linkSize = 90, // Default size
}) => {
  const isClicked = clickedLink === link.key;
  const isDesktop = useIsDesktop();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    onMouseEnter();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    setIsHovered(false);
  };

  const handleAdd = onAdd ? onAdd : () => console.log('Add action triggered');

  const containerSize = linkSize;
  const iconContainerSize = containerSize * 0.7;
  const iconSize = iconContainerSize * 0.7;

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
            group relative flex flex-col items-center gap-2 p-3 cursor-pointer
            transition-all duration-300 hover:scale-105 hover:translate-y-[-2px]
            ${isClicked ? 'scale-95' : ''}
            ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
          style={{ minWidth: `${containerSize}px`, maxWidth: `${containerSize}px` }}
        >
          {isHovered && (
             <div className="absolute top-0 left-0 flex flex-col gap-0.5 z-20">
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
            </div>
          )}
          <div className="relative">
            <div className="rounded-xl flex items-center justify-center transition-all duration-300" style={{ width: `${iconContainerSize}px`, height: `${iconContainerSize}px`}}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="rounded-lg"
                style={{ width: `${iconSize}px`, height: `${iconSize}px`}}
                onError={handleFaviconError}
              />
            </div>
          </div>
          
          <span className="text-white/90 text-base text-center truncate w-full font-medium group-hover:text-white transition-all duration-200">
            {link.name}
          </span>
        </div>
      </ContextMenuTrigger>
      <LinkCardContextMenu
        link={link}
        
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