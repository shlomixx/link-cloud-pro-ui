
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
            group relative flex flex-col items-center gap-2 p-3 cursor-pointer min-w-[60px] max-w-[60px]
            transition-all duration-300 hover:scale-105 hover:translate-y-[-2px]
            ${isClicked ? 'scale-95' : ''}
          `}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
            {link.isFavorite && (
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1 drop-shadow-lg" />
            )}
          </div>
          
          <span className="text-white/90 text-xs text-center truncate w-full font-medium group-hover:text-white transition-all duration-200">
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
