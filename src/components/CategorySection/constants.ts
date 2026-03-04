/**
 * Constants for CategorySection component — Pokilo V4 "Aether"
 *
 * Breathing grid, refined typography, premium spatial design.
 */

// Grid layout classes — responsive auto-fill for all breakpoints (V4)
export const GRID_CLASSES = {
  // auto-fill with 100px min — cards flow responsively at every width
  desktop: 'grid gap-3 w-full',
  mobile: 'links-grid-container px-0 py-0 justify-items-center',

  row: 'links-grid-container',
  rowContainer: 'min-h-[96px] p-0 w-full'
} as const;

// Layout container classes
export const LAYOUT_CLASSES = {
  // Device-specific containers
  desktopContainer: 'hidden md:block mb-10',
  mobileContainer: 'md:hidden mb-8',
  mobileWrapper: 'mx-0 mb-2',

  // Animation and layout classes
  fadeIn: 'animate-fade-in',
  categoryContainer: 'space-y-2 w-full mx-auto',
  rowWrapper: 'relative'
} as const;

// Drag and drop specific classes
export const DRAG_CLASSES = {
  dragging: 'z-50 drop-shadow-2xl',
  dragHandle: 'cursor-grab active:cursor-grabbing',
  dropZone: '',
  dropZoneActive: '',
  container: 'group cursor-pointer'
} as const;

// Category accent colors — unique per category, used as left border on headers
export const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  'ai-tools':     '#7C3AED', // violet
  google:         '#3B82F6', // blue
  search:         '#06B6D4', // cyan
  media:          '#EF4444', // red
  news:           '#0EA5E9', // sky
  shopping:       '#F59E0B', // amber
  travel:         '#14B8A6', // teal
  apps:           '#4F46E5', // indigo
  custom:         '#6B7280', // gray
  adults:         '#64748B', // slate
  ai:             '#6366F1', // violet-indigo
};

/** Returns the accent color for a given category key, falling back to indigo */
export function getCategoryAccentColor(category: string): string {
  return CATEGORY_ACCENT_COLORS[category] ?? '#4F46E5';
}

// Header styles — 13px indigo, with gradient ::after
export const HEADER_STYLES = {
  mobile: {
    container: 'mb-4 mt-2',
    flex: 'flex items-center gap-2 mb-3',
    colorBar: '',
    title: 'category-section-title',
    separator: ''
  },
  desktop: {
    container: 'mb-5 mt-2',
    flex: 'flex items-center gap-2 mb-3',
    colorBar: '',
    title: 'category-section-title',
    separator: ''
  }
} as const;

export const ADD_BUTTON_STYLES = {
  container: 'group cursor-pointer flex items-center justify-center gap-2 min-w-[180px] py-3.5 px-5 rounded-[14px] border-2 border-dashed border-[rgba(99,102,241,0.3)] hover:border-[#6366f1] hover:bg-[rgba(99,102,241,0.04)] dark:border-[rgba(99,102,241,0.25)] dark:hover:border-[#818cf8] dark:hover:bg-[rgba(99,102,241,0.08)] transition-all duration-200 hover:translate-y-[-2px]',
  button: 'flex items-center justify-center gap-2',
  icon: 'h-4.5 w-4.5 text-[#6366f1] dark:text-[#818cf8] transition-colors duration-200',
  label: 'text-[14px] font-medium text-[#6366f1] dark:text-[#818cf8] transition-colors duration-200',
} as const;
