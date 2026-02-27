// Types for CategorySection component
export interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  clicks?: number;
  createdAt?: string;
  lastClicked?: string;
}

export interface CategorySectionProps {
  category: string;
  links: LinkData[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  hoveredLink: string | null;
  clickedLink: string | null;
  onLinkClick: (link: LinkData) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onAddLink: (category: string) => void;
  onDeleteLink: (linkKey: string) => void;
  onToggleFavorite: (linkKey: string) => void;
  onReorderLinks: (sourceIndex: number, destinationIndex: number, category: string) => void;
  onEditCategoryName?: (oldCategory: string, newCategory: string) => void;
  onAddCategory?: (category: string | null) => void;
  onDeleteCategory?: (category: string) => void;
  onAddPredefinedCategory?: (template: 'adults' | 'news') => void;
  dragHandleProps?: any;
  linkSize: number;
}

export interface CategoryHeaderProps {
  category: string;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  isMobile?: boolean;
  onEditCategoryName?: (oldCategory: string, newCategory: string) => void;
  onAddCategory?: (category: string | null) => void;
  onDeleteCategory?: (category: string) => void;
  onAddPredefinedCategory?: (template: 'adults' | 'news') => void;
  dragHandleProps?: any;
}

export interface AddButtonProps {
  onAddLink: (category: string) => void;
  category: string;
}

export interface DraggableLinkItemProps {
  link: LinkData;
  index: number;
  hoveredLink: string | null;
  clickedLink: string | null;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onLinkClick: (link: LinkData) => void;
  onToggleFavorite: (linkKey: string) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onDeleteLink: (linkKey: string) => void;
  onAddLink: (category: string) => void;
  linkSize: number;
  isMobile?: boolean;
}
