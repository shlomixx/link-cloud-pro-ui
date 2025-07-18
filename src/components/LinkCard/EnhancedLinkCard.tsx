import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedLinkCardProps {
  name: string;
  url: string;
  clicks?: number;
  isFavorite?: boolean;
  size?: number;
  variant?: 'compact' | 'grid' | 'list' | 'dense';
  onClick: () => void;
  onToggleFavorite?: () => void;
  className?: string;
}

export const EnhancedLinkCard: React.FC<EnhancedLinkCardProps> = ({
  name,
  url,
  clicks = 0,
  isFavorite = false,
  size = 80,
  variant = 'compact',
  onClick,
  onToggleFavorite,
  className
}) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '/placeholder.svg';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onClick();
  };

  const baseCardClasses = cn(
    "group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer",
    "hover-lift hover:shadow-lg hover:border-primary/20",
    "bg-card text-card-foreground",
    className
  );

  if (variant === 'compact') {
    return (
      <div 
        className={cn(baseCardClasses, "p-4 flex items-center gap-3")}
        onClick={handleCardClick}
        style={{ minHeight: size }}
      >
        <img
          src={getFaviconUrl(url)}
          alt={`${name} favicon`}
          className="w-8 h-8 rounded-md flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground">{clicks} clicks</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="h-8 w-8 p-0"
            >
              <Star 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
              />
            </Button>
          )}
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div 
        className={cn(baseCardClasses, "p-6 text-center")}
        onClick={handleCardClick}
        style={{ minHeight: size + 40 }}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={getFaviconUrl(url)}
            alt={`${name} favicon`}
            className="w-12 h-12 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div>
            <h3 className="font-medium text-sm mb-1">{name}</h3>
            <p className="text-xs text-muted-foreground">{clicks} clicks</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="h-8 w-8 p-0"
              >
                <Star 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  )}
                />
              </Button>
            )}
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div 
        className={cn(baseCardClasses, "p-4 flex items-center justify-between")}
        onClick={handleCardClick}
        style={{ minHeight: size }}
      >
        <div className="flex items-center gap-3">
          <img
            src={getFaviconUrl(url)}
            alt={`${name} favicon`}
            className="w-10 h-10 rounded-lg flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{url}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{clicks} clicks</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="h-8 w-8 p-0"
              >
                <Star 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  )}
                />
              </Button>
            )}
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  // Dense variant
  return (
    <div 
      className={cn(baseCardClasses, "p-2 flex items-center gap-2")}
      onClick={handleCardClick}
      style={{ minHeight: size - 20 }}
    >
      <img
        src={getFaviconUrl(url)}
        alt={`${name} favicon`}
        className="w-6 h-6 rounded flex-shrink-0"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <span className="text-xs font-medium truncate flex-1">{name}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="h-6 w-6 p-0"
          >
            <Star 
              className={cn(
                "h-3 w-3 transition-colors",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </Button>
        )}
      </div>
    </div>
  );
};