import { LinkData } from './types';

// Layout component types
export interface LayoutProps {
  category: string;
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  onAddLink: (category: string) => void;
  onEditCategoryName?: (oldCategory: string, newCategory: string) => void;
  links: LinkData[];
  linkItemProps: LinkItemProps;
}

export interface LinkItemProps {
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
}
