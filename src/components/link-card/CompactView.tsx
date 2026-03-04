import React from 'react';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { BaseLinkCardProps } from './types';
import { getFaviconUrl, handleFaviconError, nameToColor } from './utils';
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
  linkSize = 100,
}) => {
  const firstLetter = (link.name || '?').charAt(0).toUpperCase();
  const fallbackColor = nameToColor(link.name || 'link');

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
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
          className="link-item group"
        >
          <div className="card-inner">
            <div className="link-favicon-wrapper">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="link-favicon"
                loading="lazy"
                decoding="async"
                onError={handleFaviconError}
              />
              <span
                className="link-fallback"
                style={{
                  display: 'none',
                  backgroundColor: fallbackColor,
                }}
                aria-hidden="true"
              >
                {firstLetter}
              </span>
            </div>
            <span
              className="link-label text-[14px] font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-tight truncate transition-colors duration-150 group-hover:text-[#1a1a1a] dark:group-hover:text-[#e5e5e5]"
              title={link.name}
            >
              {link.name}
            </span>
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