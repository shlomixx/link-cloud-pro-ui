import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkCard } from '@/components/LinkCard';
import type { LinkData } from '@/components/link-card/types';

interface CategorySectionProps {
  category: string;
  links: LinkData[];
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  hoveredLink: string | null;
  clickedLink: string | null;
  categories: string[];
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onLinkClick: (link: LinkData) => void;
  onToggleFavorite: (e: React.MouseEvent, linkKey: string) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string) => void;
  onDeleteLink?: (linkKey: string) => void;
  onChangeCategory?: (linkKey: string, newCategory: string) => void;
  onAddLink: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  links,
  viewMode,
  isDarkMode,
  hoveredLink,
  clickedLink,
  categories,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  onToggleFavorite,
  onEditLink,
  onCopyUrl,
  onDeleteLink,
  onChangeCategory,
  onAddLink
}) => {
  return (
    <div className="space-y-4 md:space-y-8">
      {/* Enhanced category header for desktop */}
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-category gradient-text-secondary group-hover:scale-105 transition-transform duration-300">
            {category}
          </h2>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-card/30 backdrop-blur-sm border border-border/30">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground font-medium">
              {links.length} {links.length === 1 ? 'link' : 'links'}
            </span>
          </div>
        </div>
        
        {/* Enhanced add button for desktop */}
        <Button
          onClick={onAddLink}
          size="sm"
          className={`
            hidden md:flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
            transition-all duration-300 hover:scale-105 hover:shadow-xl
            ${isDarkMode 
              ? 'bg-gradient-card hover:bg-gradient-hover text-white border border-border/50 hover:border-primary/50' 
              : 'bg-gradient-card hover:bg-gradient-hover text-slate-800 border border-border/30 hover:border-primary/40'
            }
            backdrop-blur-sm shadow-lg hover:shadow-primary/20
          `}
        >
          <Plus className="w-4 h-4" />
          Add Link
        </Button>
      </div>

      {/* Enhanced links grid with improved responsive design */}
      <div className={`
        transition-all duration-500 ease-out
        ${viewMode === 'grid' 
          ? 'grid gap-4 md:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
          : viewMode === 'list' 
          ? 'space-y-3 md:space-y-6' 
          : viewMode === 'compact' 
          ? 'grid gap-3 md:gap-6 grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12' 
          : 'grid gap-2 md:gap-4 grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16'
        }
      `}>
        {links.map((link, index) => (
          <div 
            key={link.key}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <LinkCard
              link={link}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              hoveredLink={hoveredLink}
              clickedLink={clickedLink}
              categories={categories}
              onMouseEnter={() => onMouseEnter(link.key)}
              onMouseLeave={onMouseLeave}
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(e, link.key)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '')}
              onDelete={() => onDeleteLink?.(link.key)}
              onChangeCategory={(newCategory) => onChangeCategory?.(link.key, newCategory)}
            />
          </div>
        ))}
      </div>

      {/* Enhanced empty category state for desktop */}
      {links.length === 0 && (
        <div className="text-center py-12 md:py-20 space-y-6 animate-fade-in">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-card flex items-center justify-center backdrop-blur-sm border border-border/30">
            <Plus className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              No links in {category}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Add your first link to get started
            </p>
          </div>
          <Button
            onClick={onAddLink}
            className="btn-gradient px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Link
          </Button>
        </div>
      )}
    </div>
  );
};
