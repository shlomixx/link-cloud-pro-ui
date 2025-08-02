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
  mobile: 'grid grid-cols-5 gap-4 px-4 py-3',
  
  // Row-based flex layouts for drag zones
  row: 'flex flex-wrap gap-6 items-start',
  rowContainer: 'min-h-[120px] p-4 border-2 border-dashed border-transparent rounded-lg transition-colors duration-200'
} as const;

// Layout container classes
export const LAYOUT_CLASSES = {
  // Device-specific containers
  desktopContainer: 'hidden md:block mb-12',
  mobileContainer: 'md:hidden mb-10',
  mobileWrapper: 'mx-4 mb-4',
  
  // Animation and layout classes
  fadeIn: 'animate-fade-in',
  categoryContainer: 'space-y-4',
  rowWrapper: 'relative'
} as const;

// Drag and drop specific classes
export const DRAG_CLASSES = {
  dragging: 'z-50 drop-shadow-2xl transform rotate-3 scale-105',
  dragHandle: 'cursor-grab active:cursor-grabbing',
  dropZone: 'transition-all duration-200',
  dropZoneActive: '',
  container: 'group cursor-pointer'
} as const;

// Style configurations
export const HEADER_STYLES = {
  mobile: {
    container: 'mb-6',
    flex: 'flex items-center gap-3 mb-4',
    colorBar: 'w-1 h-4 rounded-full shadow-sm',
    title: 'text-xs font-bold text-slate-300 uppercase tracking-wider drop-shadow-sm',
    separator: 'flex-1 h-px bg-gradient-to-r from-slate-700/40 to-transparent'
  },
  desktop: {
    container: 'mb-8',
    flex: 'flex items-center gap-4 mb-6',
    colorBar: 'w-1.5 h-6 rounded-full shadow-sm',
    title: 'text-sm font-bold text-slate-200 uppercase tracking-[0.1em] drop-shadow-sm',
    separator: 'flex-1 h-px bg-gradient-to-r from-slate-700/60 to-transparent'
  }
} as const;

export const ADD_BUTTON_STYLES = {
  container: 'group cursor-pointer',
  button: 'flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-2 border-dashed border-slate-600/60 hover:border-slate-500/80 bg-gradient-to-br from-slate-900/20 to-slate-800/30 hover:from-slate-800/40 hover:to-slate-700/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl backdrop-blur-sm',
  icon: 'h-6 w-6 text-slate-400 group-hover:text-slate-200 transition-all duration-300 drop-shadow-sm',
  text: 'text-xs text-slate-500 group-hover:text-slate-300 mt-1.5 font-medium transition-all duration-300'
} as const;
