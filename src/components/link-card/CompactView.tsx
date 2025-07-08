
import React from 'react';
import { Star } from 'lucide-react';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

export const CompactView: React.FC<BaseLinkCardProps> = ({
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
  onChangeCategory
}) => {
  const isClicked = clickedLink === link.key;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onLinkClick}
          className={`
            group relative flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer min-w-[70px] max-w-[90px]
            transition-all duration-200 hover:bg-white/5
            ${isClicked ? 'scale-95' : ''}
          `}
        >
          <div className="relative">
            <img
              src={getFaviconUrl(link.url || link.defaultUrl || '')}
              alt=""
              className="w-7 h-7 rounded-md"
              onError={handleFaviconError}
            />
            {link.isFavorite && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1" />
            )}
          </div>
          
          <span className="font-medium text-xs text-white/80 text-center truncate w-full leading-tight">
            {link.name}
          </span>
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
