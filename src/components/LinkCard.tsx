
import React from 'react';
import { Edit, Heart, ExternalLink, Star, Copy, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LinkData {
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

interface LinkCardProps {
  link: LinkData;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  hoveredLink: string | null;
  clickedLink: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDragStart: () => void;
  onLinkClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onCopyUrl: () => void;
  onDelete?: () => void;
}

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
};

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  viewMode,
  isDarkMode,
  hoveredLink,
  clickedLink,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onLinkClick,
  onToggleFavorite,
  onEdit,
  onCopyUrl,
  onDelete
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStarted, setDragStarted] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isHovered = hoveredLink === link.key;
  const isClicked = clickedLink === link.key;

  const handleTouchStart = (e: React.TouchEvent) => {
    longPressTimerRef.current = setTimeout(() => {
      setDragStarted(true);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setDragStarted(false);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStarted) {
      setIsDragging(true);
      onDragStart();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    longPressTimerRef.current = setTimeout(() => {
      setDragStarted(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setDragStarted(false);
    setIsDragging(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', link.key);
    e.dataTransfer.setData('application/json', JSON.stringify(link));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStarted(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedLinkKey = e.dataTransfer.getData('text/plain');
    
    // Only allow drop if it's a different link
    if (draggedLinkKey && draggedLinkKey !== link.key) {
      // Emit a custom event that the parent can listen to
      const dropEvent = new CustomEvent('linkDrop', {
        detail: {
          draggedLinkKey,
          targetLinkKey: link.key,
          targetCategory: link.category
        }
      });
      window.dispatchEvent(dropEvent);
    }
  };

  const handleContextMenuClick = (action: () => void) => {
    return () => {
      action();
    };
  };

  React.useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const getDropTargetStyles = () => {
    if (isDragOver) {
      return 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50/20';
    }
    return '';
  };

  // Dense view - ultra minimal
  if (viewMode === 'dense') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  draggable={dragStarted}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onClick={!dragStarted ? onLinkClick : undefined}
                  className={`
                    group relative flex flex-col items-center gap-1 p-1 rounded cursor-pointer
                    transition-all duration-200 hover:scale-110
                    ${isDarkMode 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-black/10'
                    }
                    ${isClicked ? 'scale-95' : ''}
                    ${dragStarted ? 'scale-110 shadow-2xl z-50 bg-white/20 backdrop-blur-sm border-2 border-blue-400/50 transform translate-y-[-4px]' : ''}
                    ${getDropTargetStyles()}
                  `}
                >
                  {dragStarted && (
                    <>
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 animate-pulse">
                        <GripVertical className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded blur-sm -z-10" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded pointer-events-none">
                        גרור או לחץ לתפריט
                      </div>
                    </>
                  )}
                  <img
                    src={getFaviconUrl(link.url || link.defaultUrl || '')}
                    alt=""
                    className="w-7 h-7 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className={`text-sm font-medium text-center max-w-[70px] leading-tight truncate ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {link.name}
                  </span>
                  {link.isFavorite && (
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 absolute -top-0.5 -right-0.5" />
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className={isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}>
                <ContextMenuItem onClick={handleContextMenuClick(onEdit)}>
                  <Edit className="w-4 h-4 mr-2" />
                  עריכה
                </ContextMenuItem>
                <ContextMenuItem onClick={handleContextMenuClick(onCopyUrl)}>
                  <Copy className="w-4 h-4 mr-2" />
                  העתק URL
                </ContextMenuItem>
                <ContextMenuItem onClick={handleContextMenuClick(() => onToggleFavorite({} as React.MouseEvent))}>
                  <Heart className="w-4 h-4 mr-2" />
                  {link.isFavorite ? 'הסר מועדפים' : 'הוסף למועדפים'}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleContextMenuClick(onDelete || (() => {}))} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  מחק
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <div className="font-medium">{link.name}</div>
              <div className="text-muted-foreground">{link.url || link.defaultUrl}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Compact view - minimal with icons and names only
  if (viewMode === 'compact') {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            draggable={dragStarted}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={!dragStarted ? onLinkClick : undefined}
            className={`
              group relative flex flex-col items-center gap-2 p-3 rounded cursor-pointer min-w-[80px] max-w-[100px]
              transition-all duration-200 hover:scale-110
              ${isDarkMode 
                ? 'hover:bg-white/10' 
                : 'hover:bg-black/10'
              }
              ${isClicked ? 'scale-95' : ''}
              ${dragStarted ? 'scale-110 shadow-2xl z-50 bg-white/20 backdrop-blur-sm border-2 border-blue-400/50 transform translate-y-[-6px]' : ''}
              ${getDropTargetStyles()}
            `}
          >
            {dragStarted && (
              <>
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 animate-pulse">
                  <GripVertical className="w-3 h-3 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded blur-sm -z-10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded pointer-events-none">
                  גרור או לחץ לתפריט
                </div>
              </>
            )}
            <div className="relative">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {link.isFavorite && (
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
            
            <span className={`font-medium text-sm text-center truncate w-full leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {link.name}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className={isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}>
          <ContextMenuItem onClick={handleContextMenuClick(onEdit)}>
            <Edit className="w-4 h-4 mr-2" />
            עריכה
          </ContextMenuItem>
          <ContextMenuItem onClick={handleContextMenuClick(onCopyUrl)}>
            <Copy className="w-4 h-4 mr-2" />
            העתק URL
          </ContextMenuItem>
          <ContextMenuItem onClick={handleContextMenuClick(() => onToggleFavorite({} as React.MouseEvent))}>
            <Heart className="w-4 h-4 mr-2" />
            {link.isFavorite ? 'הסר מועדפים' : 'הוסף למועדפים'}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleContextMenuClick(onDelete || (() => {}))} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            מחק
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  // Grid view - icons and names only
  if (viewMode === 'grid') {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            draggable={dragStarted}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={!dragStarted ? onLinkClick : undefined}
            className={`
              group relative flex flex-col items-center gap-3 p-5 rounded cursor-pointer
              transition-all duration-200 hover:scale-110
              ${isDarkMode 
                ? 'hover:bg-white/10' 
                : 'hover:bg-black/10'
              }
              ${isClicked ? 'scale-95' : ''}
              ${dragStarted ? 'scale-110 shadow-2xl z-50 bg-white/20 backdrop-blur-sm border-2 border-blue-400/50 transform translate-y-[-8px]' : ''}
              ${getDropTargetStyles()}
            `}
          >
            {dragStarted && (
              <>
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1.5 animate-pulse">
                  <GripVertical className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded blur-sm -z-10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded pointer-events-none">
                  גרור או לחץ לתפריט
                </div>
              </>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleFavorite}
              className={`absolute top-1 right-1 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
                link.isFavorite ? 'opacity-100' : ''
              }`}
            >
              <Star className={`w-3 h-3 ${
                link.isFavorite 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : isDarkMode ? 'text-slate-400 hover:text-yellow-400' : 'text-slate-500 hover:text-yellow-500'
              }`} />
            </Button>

            <div className="relative">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-12 h-12 rounded transition-all duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <div className="w-full text-center">
              <h3 className={`font-medium text-base truncate ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {link.name}
                {link.isPrivate && <span className="ml-1 text-yellow-500">🔒</span>}
              </h3>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className={isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}>
          <ContextMenuItem onClick={handleContextMenuClick(onEdit)}>
            <Edit className="w-4 h-4 mr-2" />
            עריכה
          </ContextMenuItem>
          <ContextMenuItem onClick={handleContextMenuClick(onCopyUrl)}>
            <Copy className="w-4 h-4 mr-2" />
            העתק URL
          </ContextMenuItem>
          <ContextMenuItem onClick={handleContextMenuClick(() => onToggleFavorite({} as React.MouseEvent))}>
            <Heart className="w-4 h-4 mr-2" />
            {link.isFavorite ? 'הסר מועדפים' : 'הוסף למועדפים'}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleContextMenuClick(onDelete || (() => {}))} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            מחק
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  // List view - simplified
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          draggable={dragStarted}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={!dragStarted ? onLinkClick : undefined}
          className={`
            group flex items-center gap-5 p-4 rounded cursor-pointer w-full
            transition-all duration-200 hover:scale-[1.02]
            ${isDarkMode 
              ? 'hover:bg-white/10' 
              : 'hover:bg-black/10'
            }
            ${isClicked ? 'scale-[0.98]' : ''}
            ${dragStarted ? 'scale-[1.05] shadow-2xl z-50 bg-white/20 backdrop-blur-sm border-2 border-blue-400/50 transform translate-y-[-6px]' : ''}
            ${getDropTargetStyles()}
          `}
        >
          {dragStarted && (
            <>
              <div className="absolute left-2 bg-blue-500 rounded-full p-1.5 animate-pulse">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded blur-sm -z-10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded pointer-events-none">
                גרור או לחץ לתפריט
              </div>
            </>
          )}
          <div className="flex items-center gap-5 flex-1">
            <img
              src={getFaviconUrl(link.url || link.defaultUrl || '')}
              alt=""
              className="w-10 h-10 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-medium text-lg ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {link.name}
                </h3>
                {link.isFavorite && (
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                )}
                {link.isPrivate && <span className="text-yellow-500">🔒</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 px-5 py-3"
            >
              <ExternalLink className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className={isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}>
        <ContextMenuItem onClick={handleContextMenuClick(onEdit)}>
          <Edit className="w-4 h-4 mr-2" />
          עריכה
        </ContextMenuItem>
        <ContextMenuItem onClick={handleContextMenuClick(onCopyUrl)}>
          <Copy className="w-4 h-4 mr-2" />
          העתק URL
        </ContextMenuItem>
        <ContextMenuItem onClick={handleContextMenuClick(() => onToggleFavorite({} as React.MouseEvent))}>
          <Heart className="w-4 h-4 mr-2" />
          {link.isFavorite ? 'הסר מועדפים' : 'הוסף למועדפים'}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleContextMenuClick(onDelete || (() => {}))} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          מחק
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
