import { trackVisit } from '../RecentlyVisited';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

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
  linkSize = 100, // Default size
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onLinkClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={link.name}
          className={`
            group relative flex flex-col items-center justify-center gap-3 p-4 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
          `}
          style={{ minWidth: `${containerSize}px`, maxWidth: `${containerSize}px` }}
        >
          {isHovered && (
            <div className="absolute -top-2 -left-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                className="p-2 hover:bg-black/5 rounded-full transition-all duration-200"
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
                {/* Google-style three dots vertical */}
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
              </button>
            </div>
          )}
          
          {/* Card inner wrapper - bypasses react-beautiful-dnd transform block */}
          <div className="card-inner flex flex-col items-center justify-center gap-2 w-full rounded-xl p-3">
            <figure className="flex flex-col items-center justify-center gap-2 m-0">
              <div className="relative flex justify-center items-center">
                <div className="rounded-xl flex items-center justify-center" style={{ width: `${iconContainerSize}px`, height: `${iconContainerSize}px`}}>
                  <img
                    src={getFaviconUrl(link.url || link.defaultUrl || '')}
                    alt=""
                    className="rounded-lg object-contain"
                    loading="lazy"
                    decoding="async"
                    style={{ width: `${iconSize}px`, height: `${iconSize}px`}}
                    onError={handleFaviconError}
                  />
                </div>
              </div>
              <figcaption className="w-full text-center">
                <span className="text-foreground/90 text-base font-medium leading-tight text-center max-w-full truncate inline-block">
                  {link.name}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </ContextMenuTrigger>
      <LinkCardContextMenu
        link={link}
        
        categories={categories}
        onEdit={onEdit}
        onCopyUrl={onCopyUrl}
        onToggleFavorite={() => onToggleFavorite(link.key)}
        onChangeCategory={onChangeCategory}
        onDelete={onDelete}
      />
    </ContextMenu>
  );
};