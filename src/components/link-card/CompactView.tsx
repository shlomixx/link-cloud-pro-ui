
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
            group relative flex flex-col items-center gap-3 p-4 cursor-pointer min-w-[80px] max-w-[80px]
            transition-all duration-300 hover:scale-105 hover:translate-y-[-4px]
            ${isClicked ? 'scale-95' : ''}
            bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10
            hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/20
          `}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/20">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
            {link.isFavorite && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1 drop-shadow-lg" />
            )}
          </div>
          
          <span className="text-white/90 text-sm text-center truncate w-full font-medium group-hover:text-white transition-all duration-200">
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
