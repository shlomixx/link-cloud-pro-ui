
import React from 'react';
import { useResponsive } from '@/hooks/use-responsive';
import { MobileHeader } from './mobile/MobileHeader';
import { DesktopHeader } from './desktop/DesktopHeader';

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  onViewModeChange: (mode: 'grid' | 'list' | 'compact' | 'dense') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isCompactHeader: boolean;
  onToggleCompactHeader: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  categoryLabels: Record<string, string>;
  showPrivateLinks: boolean;
  onTogglePrivateLinks: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onAddLink: () => void;
  onShowShortcuts: () => void;
  linksCount: number;
  totalClicks: number;
  favoriteCount: number;
  categoriesCount: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onQuickAction: (action: string) => void;
  recentCount: number;
  popularCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <MobileHeader
        searchTerm={props.searchTerm}
        onSearchChange={props.onSearchChange}
        isDarkMode={props.isDarkMode}
        onToggleDarkMode={props.onToggleDarkMode}
        onAddLink={props.onAddLink}
        favoriteCount={props.favoriteCount}
        recentCount={props.recentCount}
        popularCount={props.popularCount}
        onQuickAction={props.onQuickAction}
        selectedCategory={props.selectedCategory}
        onCategoryChange={props.onCategoryChange}
        categories={props.categories}
        categoryLabels={props.categoryLabels}
      />
    );
  }

  return <DesktopHeader {...props} />;
};
