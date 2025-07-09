import React from 'react';
import { Plus } from 'lucide-react';
import { LinkCard } from './LinkCard';
import { Button } from '@/components/ui/button';

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

interface CategorySectionProps {
  category: string;
  links: LinkData[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  viewMode: 'grid' | 'list' | 'compact' | 'dense';
  isDarkMode: boolean;
  draggedItem: string | null;
  hoveredLink: string | null;
  clickedLink: string | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, category: string) => void;
  onLinkClick: (link: LinkData) => void;
  onToggleFavorite: (linkKey: string, e: React.MouseEvent) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onDragStart: (linkKey: string) => void;
  onAddLink: (category: string) => void;
  onDropUrl: (url: string, category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  links,
  categoryLabels,
  categoryColors,
  viewMode,
  isDarkMode,
  draggedItem,
  hoveredLink,
  clickedLink,
  onDragOver,
  onDrop,
  onLinkClick,
  onToggleFavorite,
  onEditLink,
  onCopyUrl,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onAddLink,
  onDropUrl
}) => {
  const [isHoveringCategory, setIsHoveringCategory] = React.useState(false);
  const [isDragOverCategory, setIsDragOverCategory] = React.useState(false);

  const getGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 2xl:grid-cols-16 gap-4';
      case 'compact':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-5';
      case 'grid':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-6';
      case 'list':
        return 'flex flex-col gap-4';
      default:
        return 'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-5';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'compact':
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'grid':
        return 'grid grid-cols-6 gap-2 px-2 py-1';
      case 'list':
        return 'flex flex-col gap-1 px-2 py-1';
      default:
        return 'grid grid-cols-6 gap-2 px-2 py-1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(true);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCategory(false);
    
    // First check for internal link drag data
    try {
      const internalData = e.dataTransfer.getData('application/json');
      if (internalData) {
        const parsed = JSON.parse(internalData);
        if (parsed.type === 'link' && parsed.key) {
          onDrop(e, category);
          return;
        }
      }
    } catch (error) {
      // Not internal drag data, continue with URL check
    }
    
    // Then check for external URL drops
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onDropUrl(url, category);
    } else {
      onDrop(e, category);
    }
  };

  const getCategoryColor = () => {
    const colorMap: Record<string, string> = {
      tools: 'bg-orange-400',
      streaming: 'bg-green-400',
      social: 'bg-pink-400',
      shopping: 'bg-yellow-400',
      education: 'bg-blue-400',
      news: 'bg-red-400',
      ai: 'bg-purple-400',
      languages: 'bg-indigo-400',
      learning: 'bg-cyan-400',
      technology: 'bg-teal-400',
      design: 'bg-rose-400',
      business: 'bg-violet-400',
      finance: 'bg-emerald-400',
      entertainment: 'bg-fuchsia-400',
      communication: 'bg-sky-400',
      productivity: 'bg-amber-400',
      health: 'bg-red-500',
      music: 'bg-pink-500',
      photography: 'bg-slate-400',
      art: 'bg-purple-500',
      books: 'bg-indigo-500',
      sports: 'bg-orange-500',
      gaming: 'bg-violet-500',
      investing: 'bg-green-500',
      cryptocurrency: 'bg-yellow-500',
      freelance: 'bg-blue-500',
      meditation: 'bg-cyan-500',
      dating: 'bg-rose-500',
      parenting: 'bg-emerald-500',
      custom: 'bg-purple-400'
    };
    
    return colorMap[category] || 'bg-gray-400';
  };

  const getMobileSeparator = () => {
    const separators: Record<string, JSX.Element> = {
      tools: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-400 via-orange-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-orange-300 via-orange-400 to-transparent" />
        </div>
      ),
      streaming: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-400 via-green-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-300 via-green-400 to-transparent" />
        </div>
      ),
      social: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-400 via-pink-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-pink-300 via-pink-400 to-transparent" />
        </div>
      ),
      shopping: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400 via-yellow-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-300 via-yellow-400 to-transparent" />
        </div>
      ),
      education: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 via-blue-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-300 via-blue-400 to-transparent" />
        </div>
      ),
      learning: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400 via-cyan-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-300 via-cyan-400 to-transparent" />
        </div>
      ),
      news: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 via-red-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-red-300 via-red-400 to-transparent" />
        </div>
      ),
      ai: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 via-purple-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-300 via-purple-400 to-transparent" />
        </div>
      ),
      languages: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-400 via-indigo-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-300 via-indigo-400 to-transparent" />
        </div>
      ),
      technology: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-400 via-teal-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-teal-300 via-teal-400 to-transparent" />
        </div>
      ),
      design: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-400 via-rose-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-300 via-rose-400 to-transparent" />
        </div>
      ),
      business: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-400 via-violet-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-violet-300 via-violet-400 to-transparent" />
        </div>
      ),
      finance: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 via-emerald-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-300 via-emerald-400 to-transparent" />
        </div>
      ),
      entertainment: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-fuchsia-400 via-fuchsia-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-fuchsia-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-fuchsia-300 via-fuchsia-400 to-transparent" />
        </div>
      ),
      communication: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-400 via-sky-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-sky-300 via-sky-400 to-transparent" />
        </div>
      ),
      productivity: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 via-amber-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-300 via-amber-400 to-transparent" />
        </div>
      ),
      health: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500 via-red-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-red-400 via-red-500 to-transparent" />
        </div>
      ),
      music: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-500 via-pink-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-pink-400 via-pink-500 to-transparent" />
        </div>
      ),
      photography: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-400 via-slate-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 via-slate-400 to-transparent" />
        </div>
      ),
      art: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 via-purple-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-400 via-purple-500 to-transparent" />
        </div>
      ),
      books: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500 via-indigo-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-400 via-indigo-500 to-transparent" />
        </div>
      ),
      sports: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500 via-orange-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-orange-400 via-orange-500 to-transparent" />
        </div>
      ),
      gaming: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500 via-violet-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-violet-400 via-violet-500 to-transparent" />
        </div>
      ),
      investing: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-500 via-green-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-400 via-green-500 to-transparent" />
        </div>
      ),
      cryptocurrency: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 via-yellow-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-400 via-yellow-500 to-transparent" />
        </div>
      ),
      freelance: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500 via-blue-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-400 via-blue-500 to-transparent" />
        </div>
      ),
      meditation: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500 via-cyan-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400 via-cyan-500 to-transparent" />
        </div>
      ),
      dating: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-500 via-rose-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-400 via-rose-500 to-transparent" />
        </div>
      ),
      parenting: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500 via-emerald-400 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-400 via-emerald-500 to-transparent" />
        </div>
      ),
      custom: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 via-purple-300 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-300 via-purple-400 to-transparent" />
        </div>
      ),
      // Default pattern for other categories
      default: (
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 via-white/10 to-transparent" />
          <div className="px-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getCategoryColor()}`} />
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 via-white/20 to-transparent" />
        </div>
      )
    };
    
    return separators[category] || separators.default;
  };

  const renderAddButton = () => {
    return (
      <Button
        onClick={() => onAddLink(category)}
        variant="ghost"
        className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg h-full cursor-pointer hover:bg-white/5 transition-colors duration-200"
      >
        <Plus className="w-5 h-5 text-white/50 hover:text-white/70" />
        <span className="text-xs text-white/50 hover:text-white/70">Add</span>
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:flex items-start gap-12 mb-10 animate-slide-up"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Minimalistic Category Sidebar - Left Side */}
        <div className="flex items-center gap-3 min-w-[120px] pt-4">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor()}`}></div>
          <h2 className="text-white text-lg font-medium">
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
        </div>

        {/* Enhanced Links Grid - Right Side */}
        <div className={`flex-1 ${getGridClasses()}`}>
          {links.map((link) => (
            <LinkCard
              key={link.key}
              link={link}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              hoveredLink={hoveredLink}
              clickedLink={clickedLink}
              onMouseEnter={() => onMouseEnter(link.key)}
              onMouseLeave={onMouseLeave}
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
              onDragStart={() => onDragStart(link.key)}
            />
          ))}
          {renderAddButton()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden mb-8 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Unique Category Separator */}
        <div className="mx-4 mb-6">
          {getMobileSeparator()}
        </div>

        {/* Links Grid with Better Spacing */}
        <div className={`${getMobileGridClasses()}`}>
          {links.map((link) => (
            <LinkCard
              key={link.key}
              link={link}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              hoveredLink={hoveredLink}
              clickedLink={clickedLink}
              onMouseEnter={() => onMouseEnter(link.key)}
              onMouseLeave={onMouseLeave}
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
              onDragStart={() => onDragStart(link.key)}
            />
          ))}
          {renderAddButton()}
        </div>
      </div>
    </>
  );
};
