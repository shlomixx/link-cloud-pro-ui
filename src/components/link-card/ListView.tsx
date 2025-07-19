import React, { useState } from 'react';
import { Star, ExternalLink, GripVertical, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';
import { useIsDesktop } from '@/hooks/use-is-desktop';

export const ListView: React.FC<BaseLinkCardProps> = ({
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

  const handleMouseEnter = () => {
    onMouseEnter();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
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
            group flex items-center gap-6 p-5 rounded-xl cursor-pointer w-full
            transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
            ${isDarkMode 
              ? 'bg-slate-800/20 hover:bg-slate-700/30' 
              : 'bg-white/20 hover:bg-white/30'
            }
            backdrop-blur-sm
            ${isClicked ? 'scale-[0.98]' : ''}
            ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
        >
          {isHovered && (
             <div className="absolute top-1 left-1 flex gap-1 z-20">
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
          <div className="flex items-center gap-6 flex-1">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'}
              backdrop-blur-sm
            `}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {link.name}
                </h3>
                {link.isPrivate && <span className="text-yellow-500">🔒</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className={`
                px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105
                ${isDarkMode 
                  ? 'bg-slate-700/50 hover:bg-slate-600/60 text-white' 
                  : 'bg-white/50 hover:bg-white/70 text-slate-800'
                }
                backdrop-blur-sm
              `}
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
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