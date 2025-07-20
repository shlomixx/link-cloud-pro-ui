import React, { useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { LinkData, ViewMode } from '@/types';
import { LinkCard } from '@/components/LinkCard';

interface VirtualizedLinkGridProps {
  links: LinkData[];
  viewMode: ViewMode;
  onLinkClick: (link: LinkData) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: (linkKey: string) => void;
  onToggleFavorite: (e: React.MouseEvent, linkKey: string) => void;
  onEditLink: (link: LinkData) => void;
  onCopyLink: (link: LinkData) => void;
  onDeleteLink: (linkKey: string) => void;
  onDragStart: (linkKey: string) => void;
  onAdd: () => void;
  categories: string[];
  hoveredLink: string | null;
  clickedLink: string | null;
  linkSize: number;
  onChangeCategory: (linkKey: string, newCategory: string) => void;
}

export const VirtualizedLinkGrid: React.FC<VirtualizedLinkGridProps> = ({
  links,
  viewMode,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
  onToggleFavorite,
  onEditLink,
  onCopyLink,
  onDeleteLink,
  onDragStart,
  onAdd,
  categories,
  hoveredLink,
  clickedLink,
  linkSize,
  onChangeCategory
}) => {
  const { columnCount, rowCount, itemData } = useMemo(() => {
    // Calculate grid dimensions based on viewport and view mode
    const containerWidth = window.innerWidth - 64; // Account for padding
    let itemWidth: number;
    
    switch (viewMode) {
      case 'grid':
        itemWidth = linkSize + 16; // Link size + gap
        break;
      case 'compact':
        itemWidth = Math.max(100, linkSize * 0.8);
        break;
      case 'dense':
        itemWidth = Math.max(80, linkSize * 0.6);
        break;
      default:
        itemWidth = 200;
    }
    
    const cols = Math.max(1, Math.floor(containerWidth / itemWidth));
    const rows = Math.ceil(links.length / cols);
    
    return {
      columnCount: cols,
      rowCount: rows,
      itemData: {
        links,
        columnCount: cols,
        viewMode,
        onLinkClick,
        onMouseEnter,
        onMouseLeave,
        onToggleFavorite,
        onEditLink,
        onCopyLink,
        onDeleteLink,
        onDragStart,
        onAdd,
        categories,
        hoveredLink,
        clickedLink,
        linkSize,
        onChangeCategory
      }
    };
  }, [links, viewMode, linkSize, onLinkClick, onMouseEnter, onMouseLeave, onToggleFavorite, onEditLink, onCopyLink, onDeleteLink, onDragStart, onAdd, categories, hoveredLink, clickedLink, onChangeCategory]);

  const Cell = ({ columnIndex, rowIndex, style, data }: any) => {
    const { links, columnCount } = data;
    const linkIndex = rowIndex * columnCount + columnIndex;
    const link = links[linkIndex];
    
    if (!link) return null;
    
    return (
      <div style={style}>
        <div className="p-1">
          <LinkCard
            link={link}
            viewMode={data.viewMode}
            hoveredLink={data.hoveredLink}
            clickedLink={data.clickedLink}
            categories={data.categories}
            onMouseEnter={() => data.onMouseEnter(link.key)}
            onMouseLeave={() => data.onMouseLeave(link.key)}
            onLinkClick={() => data.onLinkClick(link)}
            onToggleFavorite={(e) => data.onToggleFavorite(e, link.key)}
            onEdit={() => data.onEditLink(link)}
            onCopyUrl={() => data.onCopyLink(link)}
            onDelete={() => data.onDeleteLink(link.key)}
            onAdd={data.onAdd}
            onChangeCategory={(newCategory) => data.onChangeCategory(link.key, newCategory)}
            onDragStart={() => data.onDragStart?.(link.key)}
            linkSize={data.linkSize}
          />
        </div>
      </div>
    );
  };

  // Only virtualize if we have many links (>50)
  if (links.length <= 50) {
    return (
      <div className={`grid gap-2 ${
        viewMode === 'grid' ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12' :
        viewMode === 'compact' ? 'grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 xl:grid-cols-13' :
        viewMode === 'dense' ? 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14' :
        'grid-cols-1'
      }`}>
        {links.map((link) => (
          <LinkCard
            key={link.key}
            link={link}
            viewMode={viewMode}
            hoveredLink={hoveredLink}
            clickedLink={clickedLink}
            categories={categories}
            onMouseEnter={() => onMouseEnter(link.key)}
            onMouseLeave={() => onMouseLeave(link.key)}
            onLinkClick={() => onLinkClick(link)}
            onToggleFavorite={(e) => onToggleFavorite(e, link.key)}
            onEdit={() => onEditLink(link)}
            onCopyUrl={() => onCopyLink(link)}
            onDelete={() => onDeleteLink(link.key)}
            onAdd={onAdd}
            onChangeCategory={(newCategory) => onChangeCategory(link.key, newCategory)}
            onDragStart={() => onDragStart?.(link.key)}
            linkSize={linkSize}
          />
        ))}
      </div>
    );
  }

  const itemHeight = viewMode === 'dense' ? 60 : viewMode === 'compact' ? 80 : 100;
  const containerHeight = Math.min(600, rowCount * itemHeight); // Max height to prevent excessive scrolling

  return (
    <Grid
      columnCount={columnCount}
      rowCount={rowCount}
      columnWidth={Math.floor((window.innerWidth - 64) / columnCount)}
      rowHeight={itemHeight}
      height={containerHeight}
      width={window.innerWidth - 64}
      itemData={itemData}
    >
      {Cell}
    </Grid>
  );
};