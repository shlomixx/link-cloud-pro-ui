// src/components/link-card/GridView.tsx
import React from 'react';
import { Star, MoreHorizontal } from 'lucide-react';
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

  const handleAdd = onAdd ? onAdd : () => console.log('Add action triggered');

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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
              ? 'bg-slate-800/20 hover:bg-slate-700/30 border border-slate-700/50 hover:border-slate-600/70' 
              : 'bg-white/20 hover:bg-white/30 border border-white/20 hover:border-white/40'
            }
            backdrop-blur-sm
            ${isClicked ? 'scale-95' : ''}
            ${isDesktop ? 'cursor-grab active:cursor-grabbing' : ''}
          `}
        >
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleFavorite}
            className={`absolute top-2 left-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
              link.isFavorite ? 'opacity-100' : ''
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${
              link.isFavorite 
                ? 'fill-yellow-400 text-yellow-400' 
                : isDarkMode ? 'text-slate-400 hover:text-yellow-400' : 'text-slate-500 hover:text-yellow-500'
            }`} />
          </Button>

          <div className="relative">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'}
              backdrop-blur-sm transition-all duration-300 group-hover:scale-110
            `}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-12 h-12 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
          </div>
          
          <div className="w-full text-center">
            <h3 className={`font-semibold text-lg truncate ${
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