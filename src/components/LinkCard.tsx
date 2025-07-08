
import React from 'react';
import { useResponsive } from '@/hooks/use-responsive';
import { MobileLinkCard } from './mobile/MobileLinkCard';
import { DesktopLinkCard } from './desktop/DesktopLinkCard';
import { LinkData } from '@/types';

interface LinkCardProps {
  link: LinkData;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  hoveredLink: string | null;
  clickedLink: string | null;
  categories?: string[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onCopyUrl: () => void;
  onDelete?: () => void;
  onChangeCategory?: (newCategory: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  viewMode,
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
  const { isMobile } = useResponsive();
  
  const isHovered = hoveredLink === link.key;
  const isClicked = clickedLink === link.key;

  const commonProps = {
    link,
    viewMode,
    isDarkMode,
    isHovered,
    isClicked,
    onMouseEnter,
    onMouseLeave,
    onLinkClick,
    onToggleFavorite,
    onEdit,
  };

  if (isMobile) {
    return <MobileLinkCard {...commonProps} />;
  }

  return (
    <DesktopLinkCard
      {...commonProps}
      categories={categories}
      onCopyUrl={onCopyUrl}
      onDelete={onDelete}
      onChangeCategory={onChangeCategory}
    />
  );
};
