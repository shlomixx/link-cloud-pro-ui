import React, { useState } from 'react';
import { Star, GripVertical, Plus, X, MoreVertical } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseEnter = () => {
    onMouseEnter();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    setIsHovered(false);
  };

  const handleAdd = onAdd ? () => onAdd(link.category) : () => console.log('Add action triggered for category:', link.category);

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
          className={`
            group relative flex flex-col items-center gap-4 p-5 cursor-pointer rounded-2xl
            ${isDragging ? 'opacity-50' : ''}
          `}
          style={{ minWidth: `${containerSize}px`, maxWidth: `${containerSize}px` }}
        >
          {isHovered && (
            <div className="absolute -top-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-gradient-to-br from-slate-600/80 to-slate-700/80 hover:from-slate-500/90 hover:to-slate-600/90 rounded-full shadow-lg backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // Trigger context menu programmatically
                  const contextMenuEvent = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    clientX: e.clientX,
                    clientY: e.clientY
                  });
                  e.currentTarget.parentElement?.parentElement?.dispatchEvent(contextMenuEvent);
                }}
              >
                <MoreVertical className="h-3.5 w-3.5 text-white drop-shadow-sm" />
              </Button>
            </div>
          )}
          <div className="relative">
            <div className="rounded-xl flex items-center justify-center" style={{ width: `${iconContainerSize}px`, height: `${iconContainerSize}px`}}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="rounded-lg"
                loading="lazy"
                decoding="async"
                style={{ width: `${iconSize}px`, height: `${iconSize}px`}}
                onError={handleFaviconError}
              />
            </div>
          </div>
          
          <span className="text-white/90 text-base text-center truncate w-full font-medium">
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