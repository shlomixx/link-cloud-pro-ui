
import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkData } from '@/types';

interface MobileLinkCardProps {
  link: LinkData;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  isHovered: boolean;
  isClicked: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onEdit: () => void;
}

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
};

export const MobileLinkCard: React.FC<MobileLinkCardProps> = ({
  link,
  viewMode,
  isDarkMode,
  isHovered,
  isClicked,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  onToggleFavorite,
  onEdit
}) => {
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    longPressTimerRef.current = setTimeout(() => {
      onEdit();
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  React.useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Dense view for mobile
  if (viewMode === 'dense') {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onLinkClick}
        className={`
          group relative flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer
          transition-all duration-300 active:scale-95
          ${isDarkMode 
            ? 'hover:bg-white/10 active:bg-white/20' 
            : 'hover:bg-black/10 active:bg-black/20'
          }
          ${isClicked ? 'scale-95' : ''}
        `}
      >
        <div className="relative">
          <img
            src={getFaviconUrl(link.url || link.defaultUrl || '')}
            alt=""
            className="w-10 h-10 rounded-lg shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {link.isFavorite && (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1 drop-shadow-sm" />
          )}
        </div>
        
        <span className={`text-sm font-medium text-center max-w-[80px] leading-tight truncate ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          {link.name}
        </span>
      </div>
    );
  }

  // Compact view for mobile
  if (viewMode === 'compact') {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onLinkClick}
        className={`
          group relative flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer
          transition-all duration-300 active:scale-95
          ${isDarkMode 
            ? 'hover:bg-white/10 active:bg-white/20' 
            : 'hover:bg-black/10 active:bg-black/20'
          }
          ${isClicked ? 'scale-95' : ''}
        `}
      >
        <div className="relative">
          <img
            src={getFaviconUrl(link.url || link.defaultUrl || '')}
            alt=""
            className="w-12 h-12 rounded-lg shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {link.isFavorite && (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute -top-1 -right-1 drop-shadow-sm" />
          )}
        </div>
        
        <span className={`text-sm font-medium text-center max-w-[100px] leading-tight truncate ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          {link.name}
        </span>
      </div>
    );
  }

  // Grid view for mobile
  if (viewMode === 'grid') {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onLinkClick}
        className={`
          group relative flex flex-col items-center gap-4 p-5 rounded-lg cursor-pointer
          transition-all duration-300 active:scale-95
          ${isDarkMode 
            ? 'hover:bg-white/10 active:bg-white/20' 
            : 'hover:bg-black/10 active:bg-black/20'
          }
          ${isClicked ? 'scale-95' : ''}
        `}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          className={`absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            link.isFavorite ? 'opacity-100' : ''
          }`}
        >
          <Star className={`w-4 h-4 ${
            link.isFavorite 
              ? 'fill-yellow-400 text-yellow-400' 
              : isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`} />
        </Button>

        <img
          src={getFaviconUrl(link.url || link.defaultUrl || '')}
          alt=""
          className="w-16 h-16 rounded-lg shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        
        <div className="w-full text-center">
          <h3 className={`text-base font-medium truncate ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {link.name}
            {link.isPrivate && <span className="ml-1 text-yellow-500">🔒</span>}
          </h3>
        </div>
      </div>
    );
  }

  // List view for mobile
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onLinkClick}
      className={`
        group flex items-center gap-4 p-4 rounded-lg cursor-pointer w-full
        transition-all duration-300 active:scale-[0.98]
        ${isDarkMode 
          ? 'hover:bg-white/10 active:bg-white/20' 
          : 'hover:bg-black/10 active:bg-black/20'
        }
        ${isClicked ? 'scale-[0.98]' : ''}
      `}
    >
      <img
        src={getFaviconUrl(link.url || link.defaultUrl || '')}
        alt=""
        className="w-12 h-12 rounded-lg shadow-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-medium truncate ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {link.name}
          </h3>
          {link.isFavorite && (
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
          )}
          {link.isPrivate && <span className="text-yellow-500 flex-shrink-0">🔒</span>}
        </div>
      </div>
      
      <Button
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 active:scale-95 px-4 py-2 flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onLinkClick();
        }}
      >
        <ExternalLink className="w-5 h-5" />
      </Button>
    </div>
  );
};
