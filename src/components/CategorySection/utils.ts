/**
 * Utility functions for row-based drag zones
 * 
 * These functions handle the conversion between flat link arrays
 * and row-based structures for optimal drag-and-drop UX.
 */

import { LinkData } from './types';

// Configuration for items per row
export const ITEMS_PER_ROW = {
  desktop: 10, // Fewer orphaned single-item rows on common screen widths
  mobile: 5    // Touch-friendly for mobile devices
} as const;

/**
 * Splits a flat array of links into rows of specified size
 * 
 * @param links - Array of links to chunk
 * @param itemsPerRow - Number of items per row (default: desktop)
 * @returns Array of link arrays representing rows
 */
export const chunkLinksIntoRows = (
  links: LinkData[], 
  itemsPerRow: number = ITEMS_PER_ROW.desktop
): LinkData[][] => {
  if (!links.length) return [[]]; // Always have at least one empty row
  
  const rows: LinkData[][] = [];
  
  for (let i = 0; i < links.length; i += itemsPerRow) {
    rows.push(links.slice(i, i + itemsPerRow));
  }
  
  // Ensure there's always an empty row at the end for adding new items
  const lastRow = rows[rows.length - 1];
  if (lastRow && lastRow.length >= itemsPerRow) {
    rows.push([]);
  }
  
  return rows;
};

/**
 * Flattens row-based structure back to a single array
 * 
 * @param rows - Array of link rows
 * @returns Flat array of links with empty slots removed
 */
export const flattenRowsToLinks = (rows: LinkData[][]): LinkData[] => {
  return rows
    .flat()
    .filter((link): link is LinkData => Boolean(link));
};

/**
 * Calculates which row a link belongs to based on its index
 * 
 * @param linkIndex - Global index of the link
 * @param itemsPerRow - Number of items per row
 * @returns Row index (0-based)
 */
export const getRowIndex = (linkIndex: number, itemsPerRow: number): number => {
  return Math.floor(linkIndex / itemsPerRow);
};

/**
 * Calculates position within a row based on global index
 * 
 * @param linkIndex - Global index of the link
 * @param itemsPerRow - Number of items per row
 * @returns Position within row (0-based)
 */
export const getPositionInRow = (linkIndex: number, itemsPerRow: number): number => {
  return linkIndex % itemsPerRow;
};

/**
 * Validates if a row has capacity for more items
 * 
 * @param row - Array of links in the row
 * @param itemsPerRow - Maximum items per row
 * @returns True if row can accept more items
 */
export const hasRowCapacity = (row: LinkData[], itemsPerRow: number): boolean => {
  return row.length < itemsPerRow;
};

const DOMAIN_TO_SECTION: Record<string, string> = {
  chatgpt: 'AI & Search',
  claude: 'AI & Search',
  gemini: 'AI & Search',
  perplexity: 'AI & Search',
  midjourney: 'AI & Search',
  leonardo: 'AI & Search',
  google: 'Google Workspace',
  gmail: 'Google Workspace',
  drive: 'Google Workspace',
  calendar: 'Google Workspace',
  maps: 'Google Workspace',
  photos: 'Google Workspace',
  translate: 'Google Workspace',
  youtube: 'Media & Social',
  spotify: 'Media & Social',
  netflix: 'Media & Social',
  soundcloud: 'Media & Social',
  facebook: 'Media & Social',
  instagram: 'Media & Social',
  twitter: 'Media & Social',
  reddit: 'Media & Social',
  cnn: 'News & Knowledge',
  nytimes: 'News & Knowledge',
  foxnews: 'News & Knowledge',
  wikipedia: 'News & Knowledge',
  imdb: 'News & Knowledge',
  amazon: 'Shopping & Services',
  ebay: 'Shopping & Services',
  walmart: 'Shopping & Services',
  aliexpress: 'Shopping & Services',
  paypal: 'Shopping & Services',
  airbnb: 'Travel & Mobility',
  booking: 'Travel & Mobility',
  uber: 'Travel & Mobility',
  waze: 'Travel & Mobility',
  weather: 'Travel & Mobility',
  app: 'Apps & Cloud',
  apple: 'Apps & Cloud',
  icloud: 'Apps & Cloud',
  dropbox: 'Apps & Cloud',
};

export function getLinkSectionLabel(link: LinkData): string {
  const raw = link.defaultUrl || link.url;
  if (!raw) return 'General';
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '');
    const segment = host.split('.')[0]?.toLowerCase() ?? '';
    return DOMAIN_TO_SECTION[segment] || 'General';
  } catch {
    return 'General';
  }
}

/**
 * Extracts row information from a droppable ID
 * 
 * @param droppableId - ID in format "category-{name}-row-{index}" or "category-mobile-{name}-row-{index}"
 * @returns Object with category and row information
 */
export const parseDroppableId = (droppableId: string) => {
  const parts = droppableId.split('-');
  const rowIndex = parseInt(parts[parts.length - 1], 10);
  const isMobile = droppableId.includes('mobile');
  
  let category: string;
  if (isMobile) {
    // Format: "category-mobile-{category}-row-{rowIndex}"
    // Remove "category", "mobile", "row", "{rowIndex}"
    category = parts.slice(2, -2).join('-');
  } else {
    // Format: "category-{category}-row-{rowIndex}"
    // Remove "category", "row", "{rowIndex}"
    category = parts.slice(1, -2).join('-');
  }
  
  return {
    category,
    rowIndex,
    isMobile,
    isValid: !isNaN(rowIndex) && category.length > 0
  };
};
