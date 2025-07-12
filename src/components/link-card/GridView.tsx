import React, { useState } from 'react';
import { Star, GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export const GridView: React.FC<BaseLinkCardProps> = ({
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
            group relative flex flex-col items-center gap-3 p-6 rounded-xl cursor-pointer
            transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl
            ${isDarkMode 
              ? 'bg-slate-800/20 hover:bg-slate-700/30' 
              : 'bg-white/20 hover:bg-white/30'
            }
            backdrop-blur-sm
            ${isClicked ? 'scale-95' : ''}
            ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
        >
          {isHovered && (
             <div className="absolute top-1 right-1 flex flex-col gap-1 z-20">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="relative">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'}
              backdrop-blur-sm transition-all duration-300 group-hover:scale-110
            `}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-10 h-10 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
          </div>
          
          <div className="w-full text-center">
            <h3 className={`font-semibold text-base truncate ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {link.name}
              {link.isPrivate && <span className="ml-1 text-yellow-500">🔒</span>}
            </h3>
          </div>
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