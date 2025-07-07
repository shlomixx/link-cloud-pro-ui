
import React from 'react';
import { Search, Plus, Grid, List, Moon, Sun, Maximize2, Minimize2, Zap, Filter, Settings, Download, Upload, Eye, EyeOff, Keyboard, Heart, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Star } from 'lucide-react';

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  viewMode: 'grid' | 'list' | 'compact';
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isCompactHeader: boolean;
  onToggleCompactHeader: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  categoryLabels: Record<string, string>;
  showPrivateLinks: boolean;
  onTogglePrivateLinks: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onAddLink: () => void;
  onShowShortcuts: () => void;
  linksCount: number;
  totalClicks: number;
  favoriteCount: number;
  categoriesCount: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onQuickAction: (action: string) => void;
  recentCount: number;
  popularCount: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchTerm,
  onSearchChange,
  searchInputRef,
  viewMode,
  onViewModeChange,
  isDarkMode,
  onToggleDarkMode,
  isCompactHeader,
  onToggleCompactHeader,
  selectedCategory,
  onCategoryChange,
  categories,
  categoryLabels,
  showPrivateLinks,
  onTogglePrivateLinks,
  onExportData,
  onImportData,
  onAddLink,
  onShowShortcuts,
  linksCount,
  totalClicks,
  favoriteCount,
  categoriesCount,
  fileInputRef,
  onQuickAction,
  recentCount,
  popularCount
}) => {
  return (
    <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black/30 border-white/10' 
        : 'bg-white/30 border-black/10'
    }`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`${isCompactHeader ? 'hidden lg:block' : ''}`}>
              <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'from-white to-purple-200' 
                  : 'from-slate-800 to-purple-600'
              }`}>
                Link Router Pro
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {/* Enhanced Search */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search links... (Ctrl+K)"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`pl-10 h-9 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              {/* Quick Filter Actions */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickAction('favorites')}
                className={`h-9 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Heart className="w-4 h-4 mr-1" />
                {favoriteCount}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickAction('recent')}
                className={`h-9 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Clock className="w-4 h-4 mr-1" />
                {recentCount}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onQuickAction('popular')}
                className={`h-9 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {popularCount}
              </Button>

              {/* View Mode Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`h-9 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    {viewMode === 'compact' && <Zap className="w-4 h-4" />}
                    {viewMode === 'grid' && <Grid className="w-4 h-4" />}
                    {viewMode === 'list' && <List className="w-4 h-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`z-50 ${
                  isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'
                }`}>
                  <DropdownMenuItem onClick={() => onViewModeChange('compact')}>
                    <Zap className="w-4 h-4 mr-2" />
                    Compact
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewModeChange('grid')}>
                    <Grid className="w-4 h-4 mr-2" />
                    Grid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewModeChange('list')}>
                    <List className="w-4 h-4 mr-2" />
                    List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter & Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`h-9 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`z-50 ${
                  isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'
                }`}>
                  <DropdownMenuItem onClick={() => onCategoryChange('all')}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map(category => (
                    <DropdownMenuItem key={category} onClick={() => onCategoryChange(category)}>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Header Toggle */}
              <Button
                size="sm"
                variant="outline"
                onClick={onToggleCompactHeader}
                className={`h-9 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                {isCompactHeader ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>

              {/* Theme Toggle */}
              <Button
                size="sm"
                variant="outline"
                onClick={onToggleDarkMode}
                className={`h-9 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`h-9 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`z-50 ${
                  isDarkMode ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'
                }`}>
                  <DropdownMenuItem onClick={onExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onTogglePrivateLinks}>
                    {showPrivateLinks ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {showPrivateLinks ? 'Hide' : 'Show'} Private Links
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShowShortcuts}>
                    <Keyboard className="w-4 h-4 mr-2" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                onClick={onAddLink}
                size="sm"
                className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
