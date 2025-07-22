
export interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  isPrivate?: boolean;
  clicks?: number;
  createdAt?: string;
  isFavorite?: boolean;
  lastClicked?: string;
}

export interface FormData {
  name: string;
  url: string;
  category: string;
  isPrivate: boolean;
}

export type SortBy = 'name' | 'clicks' | 'recent' | 'favorites' | 'custom';
