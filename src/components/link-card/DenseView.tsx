import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

export const DenseView: React.FC<BaseLinkCardProps> = ({
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onLinkClick}
                className={`
                  group relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer
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
                <figure className="flex flex-col items-center justify-center gap-1 m-0">
                  <div className="relative">
                    <img
                      src={getFaviconUrl(link.url || link.defaultUrl || '')}
                      alt=""
                      className="w-10 h-10 rounded-xl shadow-sm"
                      loading="lazy"
                      decoding="async"
                      onError={handleFaviconError}
                    />
                  </div>
                  <figcaption className="flex justify-center items-center w-full">
                    <span className="text-xs font-semibold text-center max-w-[90px] leading-tight text-white bg-black/30 backdrop-blur-sm rounded px-1 py-0.5 shadow-sm truncate inline-block">
                      {link.name}
                    </span>
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