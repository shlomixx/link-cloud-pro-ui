import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onLinkClick}
          layout
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`
            group flex items-center gap-6 p-6 rounded-2xl cursor-pointer w-full
            backdrop-blur-sm
          `}
        >
          {isHovered && (
            <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
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
                {/* Google-style three dots - vertical */}
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
              </button>
            </div>
          )}
          <div className="flex items-center gap-6 flex-1">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-gray-100
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
                <h3 className="font-semibold text-lg text-gray-900">
                  {link.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-1 opacity-90">
                {link.url || link.defaultUrl}
              </p>
            </div>
          </div>
        </motion.div>
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
