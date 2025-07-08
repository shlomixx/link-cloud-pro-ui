
import React, { useState } from 'react';
import { Search, Plus, Menu, X, Sun, Moon, Filter, Heart, Clock, TrendingUp, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MobileHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onAddLink: () => void;
  favoriteCount: number;
  recentCount: number;
  popularCount: number;
  onQuickAction: (action: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  categoryLabels: Record<string, string>;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchTerm,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  onAddLink,
  favoriteCount,
  recentCount,
  popularCount,
  onQuickAction,
  selectedCategory,
  onCategoryChange,
  categories,
  categoryLabels
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRandomLink = () => {
    onQuickAction('random');
  };

  return (
    <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black/30 border-white/10' 
        : 'bg-white/30 border-black/10'
    }`}>
      <div className="container mx-auto px-4 py-2">
        {/* Main Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
              isDarkMode 
                ? 'from-white to-purple-200' 
                : 'from-slate-800 to-purple-600'
            }`}>
              Link Router Pro
            </h1>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRandomLink}
              size="sm"
              variant="outline"
              className={`h-9 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button
              onClick={onAddLink}
              size="sm"
              className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onToggleDarkMode}
              className={`h-9 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`h-9 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
              }`}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <Input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 placeholder:text-slate-500 focus:bg-black/10'
              }`}
            />
            {searchTerm && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 text-lg"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`mt-3 p-4 rounded-lg border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' 
              : 'bg-white/95 border-slate-200 backdrop-blur-sm'
          }`}>
            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('favorites');
                    setIsMenuOpen(false);
                  }}
                  className={`h-16 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-xs font-medium">{favoriteCount}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('recent');
                    setIsMenuOpen(false);
                  }}
                  className={`h-16 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-medium">{recentCount}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('popular');
                    setIsMenuOpen(false);
                  }}
                  className={`h-16 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs font-medium">{popularCount}</span>
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className={`text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Categories</h3>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  onClick={() => {
                    onCategoryChange('all');
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start h-10"
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start h-10"
                  >
                    {categoryLabels[category]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
