
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError } from './utils';
import { LinkCardContextMenu } from './ContextMenuContent';

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
            card-minimal group relative flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer
            transition-all duration-200 hover:scale-[1.02]
            ${isClicked ? 'scale-[0.98]' : ''}
          `}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleFavorite}
            className={`absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 ${
              link.isFavorite ? 'opacity-100' : ''
            }`}
          >
            <Star className={`w-3 h-3 ${
              link.isFavorite 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-white/40 hover:text-yellow-400'
            }`} />
          </Button>

          <div className="relative">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/10">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded-lg"
                onError={handleFaviconError}
              />
            </div>
          </div>
          
          <div className="w-full text-center">
            <h3 className="font-medium text-sm text-white/90 truncate">
              {link.name}
              {link.isPrivate && <span className="ml-1 text-yellow-400/80">🔒</span>}
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
