
import React from 'react';
import { Edit, Heart, ExternalLink, Star, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  viewMode: 'grid' | 'list' | 'compact';
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
  onCopyUrl
}) => {
  return (
    <Card 
      draggable
      onDragStart={onDragStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group transition-all duration-200 backdrop-blur-sm cursor-move animate-scale-in relative overflow-hidden ${
        isDarkMode 
          ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
          : 'bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/20'
      } ${
        viewMode === 'compact' 
          ? 'min-w-[120px] max-w-[140px]' 
          : viewMode === 'list' 
          ? 'flex-row' 
          : ''
      } ${
        link.isPrivate ? 'ring-1 ring-yellow-500/30' : ''
      } ${
        hoveredLink === link.key ? (viewMode === 'compact' ? 'scale-102' : 'scale-105') + ' shadow-lg' : ''
      } ${
        clickedLink === link.key ? 'scale-95' : ''
      } ${
        link.isFavorite ? 'ring-1 ring-yellow-400/20' : ''
      }`}
    >
      <CardContent className={`${
        viewMode === 'compact' 
          ? 'p-2' 
          : viewMode === 'grid' 
          ? 'p-3' 
          : 'p-3 flex items-center gap-3 w-full'
      } relative`}>
        {/* Compact View */}
        {viewMode === 'compact' && (
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center justify-between w-full">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-4 h-4 rounded transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {link.isFavorite && (
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            
            <a
              href={link.url || link.defaultUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLinkClick}
              className={`font-medium text-xs truncate w-full transition-colors duration-300 hover:underline ${
                isDarkMode 
                  ? 'text-white group-hover:text-purple-200' 
                  : 'text-slate-800 group-hover:text-purple-600'
              }`}
            >
              {link.name}
            </a>
            
            {link.clicks && (
              <p className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {link.clicks}
              </p>
            )}
            
            <div className="flex items-center gap-1 w-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFavorite}
                className="h-5 w-5 p-0"
              >
                <Heart className={`w-3 h-3 transition-all duration-300 ${
                  link.isFavorite 
                    ? 'fill-red-400 text-red-400' 
                    : isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'
                }`} />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-5 w-5 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="flex flex-col items-center text-center space-y-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleFavorite}
              className={`absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
                link.isFavorite ? 'opacity-100' : ''
              }`}
            >
              <Star className={`w-3 h-3 transition-all duration-300 ${
                link.isFavorite 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : isDarkMode ? 'text-slate-400 hover:text-yellow-400' : 'text-slate-500 hover:text-yellow-500'
              }`} />
            </Button>

            <div className={`w-10 h-10 rounded-xl p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              isDarkMode ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/10 group-hover:bg-black/20'
            }`}>
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-6 h-6 rounded transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <div className="w-full">
              <h3 className={`font-medium text-xs truncate transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-white group-hover:text-purple-200' 
                  : 'text-slate-800 group-hover:text-purple-600'
              }`}>
                {link.name}
                {link.isPrivate && <span className="ml-1 text-yellow-500">🔒</span>}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                {link.clicks && (
                  <p className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {link.clicks} clicks
                  </p>
                )}
                {link.isFavorite && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 w-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant="ghost"
                asChild
                size="sm"
                className={`flex-1 h-7 px-2 text-xs transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
              >
                <a
                  href={link.url || link.defaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                  className="flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className={`transition-colors duration-300 ${
                    isDarkMode 
                      ? 'text-slate-300 group-hover:text-white' 
                      : 'text-slate-600 group-hover:text-slate-800'
                  }`}>
                    Open
                  </span>
                </a>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 w-7 p-0 transition-all duration-300 hover:scale-110 ${
                      isDarkMode 
                        ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                        : 'hover:bg-black/10 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`z-50 ${
                  isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'
                }`}>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCopyUrl}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleFavorite}>
                    <Heart className="w-4 h-4 mr-2" />
                    {link.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-3">
              <img
                src={getFaviconUrl(link.url || link.defaultUrl || '')}
                alt=""
                className="w-8 h-8 rounded transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {link.name}
                  </h3>
                  {link.isFavorite && (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )}
                  {link.isPrivate && <span className="text-yellow-500">🔒</span>}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {link.url || link.defaultUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {link.clicks && (
                <Badge variant="outline" className={`${
                  isDarkMode ? 'border-white/20 text-white' : 'border-black/20 text-slate-800'
                }`}>
                  {link.clicks} clicks
                </Badge>
              )}
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
              >
                <a
                  href={link.url || link.defaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className={`transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFavorite}
                className="transition-all duration-300 hover:scale-105"
              >
                <Star className={`w-4 h-4 transition-all duration-300 ${
                  link.isFavorite 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : isDarkMode ? 'text-slate-400 hover:text-yellow-400' : 'text-slate-500 hover:text-yellow-500'
                }`} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
