// src/components/link-card/DenseView.tsx
import React, { useState } from 'react';
import { Star, GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export const DenseView: React.FC<BaseLinkCardProps> = ({
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
                  group relative flex flex-col items-center gap-1 p-1 rounded cursor-pointer
                  transition-all duration-200 hover:scale-110
                  ${isDarkMode 
                    ? 'hover:bg-white/10' 
                    : 'hover:bg-black/10'
                  }
                  ${isClicked ? 'scale-95' : ''}
                  ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
                `}
              >
                {isHovered && (
                  <div className="absolute top-0 right-0 flex flex-col gap-0.5 z-20">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.();
                      }}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd();
                      }}
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 cursor-grab"
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                )}
                <img
                  src={getFaviconUrl(link.url || link.defaultUrl || '')}
                  alt=""
                  className="w-9 h-9 rounded"
                  onError={handleFaviconError}
                />
                <span className={`text-base font-medium text-center max-w-[70px] leading-tight truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {link.name}
                </span>
                {link.isFavorite && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 absolute -top-0.5 -right-0.5" />
                )}
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
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <div className="font-medium">{link.name}</div>
            <div className="text-muted-foreground">{link.url || link.defaultUrl}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};