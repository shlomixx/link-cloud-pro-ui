import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

export const ListView: React.FC<BaseLinkCardProps> = ({
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
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    onMouseEnter();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    setIsHovered(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onLinkClick}
          className={`
            group flex items-center gap-6 p-6 rounded-2xl cursor-pointer w-full
            backdrop-blur-sm
          `}
        >
          {isHovered && (
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
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
          <div className="flex items-center gap-6 flex-1">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-slate-700/50
              backdrop-blur-sm
            `}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                loading="lazy"
                decoding="async"
                onError={handleFaviconError}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg text-white">
                  {link.name}
                </h3>
              </div>
              <p className="text-sm text-slate-300 mt-1 opacity-70">
                {link.url || link.defaultUrl}
              </p>
            </div>
          </div>
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
