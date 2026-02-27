import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

export const GridView: React.FC<BaseLinkCardProps> = ({
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
            group relative flex flex-col items-center justify-center gap-3 p-5 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
          `}
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

          {/* Use figure/figcaption for proper semantic structure */}
          <figure className="flex flex-col items-center justify-center gap-2 m-0">
            <div className="relative">
              <div className="w-16 h-16 flex items-center justify-center transition-transform duration-150 group-hover:scale-110">
                <img
                  src={getFaviconUrl(link.url || link.defaultUrl || '')}
                  alt=""
                  className="w-10 h-10 rounded-lg"
                  loading="lazy"
                  decoding="async"
                  onError={handleFaviconError}
                />
              </div>
            </div>
            <figcaption className="w-full text-center">
              <h3 className="font-semibold text-sm text-foreground/90 text-center max-w-full truncate inline-block">
                {link.name}
              </h3>
            </figcaption>
          </figure>
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