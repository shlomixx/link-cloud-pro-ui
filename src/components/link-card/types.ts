export interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  clicks?: number;
  createdAt?: string;
  isFavorite?: boolean;
  lastClicked?: string;
}

export interface BaseLinkCardProps {
  link: LinkData;
  
  
  hoveredLink: string | null;
  clickedLink: string | null;
  categories?: string[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
    onToggleFavorite: (linkKey: string) => void;
  onEdit: () => void;
  onCopyUrl: () => void;
  onDelete?: () => void;
  onAdd?: (category: string) => void;
  onChangeCategory?: (newCategory: string) => void;
  onDragStart?: () => void;
  linkSize?: number;
}