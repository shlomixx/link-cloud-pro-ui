/**
 * Constants for CategorySection component
 * 
 * Centralized styling and layout configurations for consistency
 * and easy customization across the application.
 */

// Grid layout classes for responsive design
export const GRID_CLASSES = {
  // Traditional grid layouts
  desktop: 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-6',
  mobile: 'grid grid-cols-5 gap-4 px-4 py-3 justify-items-center',
  
  // Row-based flex layouts for drag zones
  row: 'flex items-start flex-wrap gap-2.5',
  rowContainer: 'min-h-[112px] p-3 border-2 border-dashed border-transparent rounded-lg transition-colors duration-150'
} as const;

// Layout container classes
export const LAYOUT_CLASSES = {
  // Device-specific containers
  desktopContainer: 'hidden md:block mb-7',
  mobileContainer: 'md:hidden mb-5',
  mobileWrapper: 'mx-3 mb-2.5',
  
  // Animation and layout classes
  fadeIn: 'animate-fade-in',
  categoryContainer: 'space-y-2.5 max-w-fit mx-auto',
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

// Style configurations
export const HEADER_STYLES = {
  mobile: {
    container: 'mb-5',
    flex: 'flex items-center gap-2.5 mb-2.5',
    colorBar: 'w-1 h-4 rounded-full shadow-sm',
    title: 'text-base font-bold text-slate-300 uppercase tracking-wider drop-shadow-sm',
    separator: ''
  },
  desktop: {
    container: 'mb-7',
    flex: 'flex items-center gap-3 mb-3',
    colorBar: 'w-1.5 h-6 rounded-full shadow-sm',
    title: 'text-lg font-bold text-slate-200 uppercase tracking-[0.08em] drop-shadow-sm',
    separator: ''
  }
} as const;

export const ADD_BUTTON_STYLES = {
  container: 'group cursor-pointer flex items-center justify-center h-16 w-16',
  button: 'flex items-center justify-center',
  icon: 'h-5 w-5 text-white group-hover:scale-105 transition-all duration-150',
} as const;
