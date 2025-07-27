import React, { useMemo, CSSProperties } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { LinkData } from '@/types';
import { LinkCard } from '@/components/LinkCard';

interface CellData {
  links: LinkData[];
  columnCount: number;
  hoveredLink: string | null;
  clickedLink: string | null;
  categories: Array<[string, LinkData[]]>;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: (linkKey: string) => void;
  onLinkClick: (link: LinkData) => void;
  onToggleFavorite: (e: React.MouseEvent, linkKey: string) => void;
  onEditLink: (link: LinkData) => void;
  onCopyLink: (link: LinkData) => void;
  onDeleteLink: (linkKey: string) => void;
  onDragStart: (e: React.DragEvent, link: LinkData) => void;
  onAdd: () => void;
  onChangeCategory: (linkKey: string, newCategory: string) => void;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: CellData;
}

interface VirtualizedLinkGridProps {
  links: LinkData[];
  
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
    // Fixed to compact view
    const itemWidth = Math.max(100, linkSize * 0.8);
    
    const cols = Math.max(1, Math.floor(containerWidth / itemWidth));
    const rows = Math.ceil(links.length / cols);
    
    return {
      columnCount: cols,
      rowCount: rows,
      itemData: {
        links,
        columnCount: cols,
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
  }, [links, linkSize, onLinkClick, onMouseEnter, onMouseLeave, onToggleFavorite, onEditLink, onCopyLink, onDeleteLink, onDragStart, onAdd, categories, hoveredLink, clickedLink, onChangeCategory]);

  const Cell = ({ columnIndex, rowIndex, style, data }: CellProps) => {
    const { links, columnCount } = data;
    const linkIndex = rowIndex * columnCount + columnIndex;
    const link = links[linkIndex];
    
    if (!link) return null;
    
    return (
      <div style={style}>
        <div className="p-1">
          <LinkCard
            link={link}
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

  // Only virtualize if we have many links (>20) to reduce DOM size
  if (links.length <= 20) {
    return (
      <div className="grid gap-2 grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 xl:grid-cols-13">
        {links.map((link) => (
          <LinkCard
            key={link.key}
            link={link}
            
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

  const itemHeight = 80; // Fixed to compact height
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