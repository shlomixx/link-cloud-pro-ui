import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoriesGridProps {
  categories: string[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  isDarkMode: boolean;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  categoryLabels,
  categoryColors,
  isDarkMode,
  onCategorySelect,
  selectedCategory
}) => {
  const allCategories = Object.keys(categoryLabels).filter(cat => cat !== 'custom');
  
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          Browse by Category
        </h2>
        <p className={`text-lg transition-colors duration-300 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Explore your links organized by category
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
        {/* All Categories Button */}
        <button
          onClick={() => onCategorySelect('all')}
          className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            selectedCategory === 'all'
              ? isDarkMode
                ? 'bg-white/20 ring-2 ring-white/30'
                : 'bg-black/10 ring-2 ring-black/20'
              : isDarkMode
                ? 'bg-white/5 hover:bg-white/10'
                : 'bg-black/5 hover:bg-black/10'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              <span className="text-white text-xl font-bold">All</span>
            </div>
            <span className={`text-sm font-medium text-center transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              All Categories
            </span>
            {categories.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {categories.length}
              </Badge>
            )}
          </div>
        </button>

        {/* Category Buttons */}
        {allCategories.map((category) => {
          const hasLinks = categories.includes(category);
          const linkCount = categories.filter(cat => cat === category).length;
          
          return (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              disabled={!hasLinks}
              className={`group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedCategory === category
                  ? isDarkMode
                    ? 'bg-white/20 ring-2 ring-white/30'
                    : 'bg-black/10 ring-2 ring-black/20'
                  : hasLinks
                    ? isDarkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-black/5 hover:bg-black/10'
                    : isDarkMode
                      ? 'bg-white/5 opacity-50 cursor-not-allowed'
                      : 'bg-black/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                  categoryColors[category] || categoryColors.custom
                } flex items-center justify-center transition-transform duration-300 ${
                  hasLinks ? 'group-hover:scale-110' : ''
                }`}>
                  <span className="text-white text-lg font-bold">
                    {getCategoryIcon(category)}
                  </span>
                </div>
                <span className={`text-sm font-medium text-center transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {categoryLabels[category]}
                </span>
                {hasLinks && (
                  <Badge variant="secondary" className="text-xs">
                    {linkCount}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    ai: '🤖',
    shopping: '🛒',
    social: '👥',
    news: '📰',
    streaming: '📺',
    tools: '🔧',
    finance: '💰',
    gaming: '🎮',
    travel: '✈️',
    food: '🍕',
    education: '📚',
    services: '⚙️',
    health: '💪',
    sports: '⚽',
    music: '🎵',
    photography: '📸',
    design: '🎨',
    productivity: '📊',
    communication: '💬',
    entertainment: '🎬',
    business: '💼',
    technology: '💻',
    science: '🔬',
    art: '🎭',
    books: '📖',
    cooking: '👨‍🍳',
    diy: '🔨',
    pets: '🐕',
    automotive: '🚗',
    real_estate: '🏠',
    fashion: '👗',
    weather: '🌤️',
    maps: '🗺️',
    government: '🏛️',
    legal: '⚖️',
    insurance: '🛡️',
    banking: '🏦',
    investing: '📈',
    cryptocurrency: '₿',
    freelance: '💼',
    learning: '🎓',
    languages: '🌍',
    meditation: '🧘',
    dating: '💕',
    parenting: '👶',
    seniors: '👴',
    kids: '🧸',
    local: '📍',
    utilities: '⚡',
    security: '🔒',
  };
  
  return icons[category] || '📁';
}