
import React from 'react';
import { LinkCard } from './LinkCard';
import { 
  Briefcase, 
  Users, 
  Play, 
  Wrench, 
  Newspaper, 
  ShoppingBag, 
  GraduationCap, 
  DollarSign, 
  Heart, 
  Plane, 
  UtensilsCrossed, 
  Trophy, 
  Gamepad2, 
  Music, 
  Camera, 
  Palette, 
  Code, 
  Building, 
  User, 
  MoreHorizontal,
  Sparkles
} from 'lucide-react';

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
        return 'grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 2xl:grid-cols-24 gap-1';
      case 'compact':
        return 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-1';
      case 'grid':
        return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-2';
      case 'list':
        return 'flex flex-col gap-1';
      default:
        return 'grid grid-cols-6 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 gap-1';
    }
  };

  const getMobileGridClasses = () => {
    switch (viewMode) {
      case 'dense':
        return 'grid grid-cols-6 gap-2';
      case 'compact':
        return 'grid grid-cols-4 gap-3';
      case 'grid':
        return 'grid grid-cols-3 gap-4';
      case 'list':
        return 'flex flex-col gap-3';
      default:
        return 'grid grid-cols-4 gap-3';
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
    
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onDropUrl(url, category);
    } else {
      onDrop(e, category);
    }
  };

  const getCategoryGradient = () => {
    const gradientMap: Record<string, string> = {
      work: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
      social: 'bg-gradient-to-br from-pink-500 via-rose-600 to-red-700',
      entertainment: 'bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700',
      tools: 'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700',
      news: 'bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700',
      shopping: 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700',
      education: 'bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-700',
      finance: 'bg-gradient-to-br from-emerald-500 via-green-600 to-lime-700',
      health: 'bg-gradient-to-br from-red-500 via-pink-600 to-rose-700',
      travel: 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700',
      food: 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700',
      sports: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-700',
      gaming: 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700',
      music: 'bg-gradient-to-br from-fuchsia-500 via-pink-600 to-rose-700',
      photography: 'bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-700',
      design: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700',
      development: 'bg-gradient-to-br from-green-500 via-teal-600 to-cyan-700',
      business: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700',
      personal: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700',
      other: 'bg-gradient-to-br from-neutral-500 via-stone-600 to-gray-700',
      custom: 'bg-gradient-to-br from-rainbow-500 via-rainbow-600 to-rainbow-700'
    };
    
    return gradientMap[category] || 'bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700';
  };

  const getCategoryTextColor = () => {
    const textMap: Record<string, string> = {
      work: 'text-blue-400',
      social: 'text-pink-400',
      entertainment: 'text-purple-400',
      tools: 'text-orange-400',
      news: 'text-gray-400',
      shopping: 'text-green-400',
      education: 'text-indigo-400',
      finance: 'text-emerald-400',
      health: 'text-red-400',
      travel: 'text-sky-400',
      food: 'text-yellow-400',
      sports: 'text-amber-400',
      gaming: 'text-violet-400',
      music: 'text-fuchsia-400',
      photography: 'text-slate-400',
      design: 'text-rose-400',
      development: 'text-green-400',
      business: 'text-blue-400',
      personal: 'text-teal-400',
      other: 'text-neutral-400',
      custom: 'text-purple-400'
    };
    
    return textMap[category] || 'text-gray-400';
  };

  const getCategoryGlow = () => {
    const glowMap: Record<string, string> = {
      work: 'group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]',
      social: 'group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]',
      entertainment: 'group-hover:drop-shadow-[0_0_20px_rgba(147,51,234,0.6)]',
      tools: 'group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]',
      news: 'group-hover:drop-shadow-[0_0_20px_rgba(107,114,128,0.6)]',
      shopping: 'group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]',
      education: 'group-hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]',
      finance: 'group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]',
      health: 'group-hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]',
      travel: 'group-hover:drop-shadow-[0_0_20px_rgba(14,165,233,0.6)]',
      food: 'group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      sports: 'group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      gaming: 'group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]',
      music: 'group-hover:drop-shadow-[0_0_20px_rgba(217,70,239,0.6)]',
      photography: 'group-hover:drop-shadow-[0_0_20px_rgba(100,116,139,0.6)]',
      design: 'group-hover:drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]',
      development: 'group-hover:drop-shadow-[0_0_20px_rgba(20,184,166,0.6)]',
      business: 'group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]',
      personal: 'group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]',
      other: 'group-hover:drop-shadow-[0_0_20px_rgba(115,115,115,0.6)]',
      custom: 'group-hover:drop-shadow-[0_0_20px_rgba(147,51,234,0.6)]'
    };
    
    return glowMap[category] || 'group-hover:drop-shadow-[0_0_20px_rgba(107,114,128,0.6)]';
  };

  const getCategoryIcon = () => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      work: Briefcase,
      social: Users,
      entertainment: Play,
      tools: Wrench,
      news: Newspaper,
      shopping: ShoppingBag,
      education: GraduationCap,
      finance: DollarSign,
      health: Heart,
      travel: Plane,
      food: UtensilsCrossed,
      sports: Trophy,
      gaming: Gamepad2,
      music: Music,
      photography: Camera,
      design: Palette,
      development: Code,
      business: Building,
      personal: User,
      other: MoreHorizontal,
      custom: Sparkles
    };
    
    return iconMap[category] || MoreHorizontal;
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:block mb-20 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Enhanced Category Header */}
        <div 
          className="group cursor-pointer mb-12"
          onMouseEnter={() => setIsHoveringCategory(true)}
          onMouseLeave={() => setIsHoveringCategory(false)}
          onClick={() => onAddLink(category)}
        >
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getCategoryGradient()} transition-all duration-500 group-hover:scale-110 ${getCategoryGlow()} shadow-2xl`}>
              <CategoryIcon 
                size={60} 
                className="text-white drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className={`${getGridClasses()}`}>
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
              onDragStart={() => onDragStart(link.key)}
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
            />
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden mb-16 animate-fade-in"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Category Header */}
        <div 
          className="group cursor-pointer mb-8"
          onClick={() => onAddLink(category)}
        >
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getCategoryGradient()} transition-all duration-500 group-hover:scale-105 ${getCategoryGlow()} shadow-2xl`}>
              <CategoryIcon 
                size={40} 
                className="text-white drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Mobile Links Grid */}
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
              onDragStart={() => onDragStart(link.key)}
              onLinkClick={() => onLinkClick(link)}
              onToggleFavorite={(e) => onToggleFavorite(link.key, e)}
              onEdit={() => onEditLink(link)}
              onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
