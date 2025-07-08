import React, { useState } from 'react';
import { Search, Plus, Grid, List, Moon, Sun, Maximize2, Minimize2, Zap, Filter, Settings, Download, Upload, Eye, EyeOff, Keyboard, Heart, Clock, TrendingUp, Menu, X, ArrowUpDown, Trash2, Copy, RotateCcw, Share2, BookmarkPlus, Shuffle } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // New handler functions for additional controls
  const handleSortAction = (sortType: string) => {
    console.log(`Sorting by ${sortType}`);
    // This would be implemented in the parent component
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`);
    // This would be implemented in the parent component
  };

  const handleRandomLink = () => {
    console.log('Opening random link');
    // This would be implemented in the parent component
  };

  const handleShareCollection = () => {
    console.log('Sharing collection');
    // This would be implemented in the parent component
  };

  const handleBackup = () => {
    console.log('Creating backup');
    // This would be implemented in the parent component
  };

  return (
    <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black/30 border-white/10' 
        : 'bg-white/30 border-black/10'
    }`}>
      <div className="container mx-auto px-4 py-2">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between gap-6 py-4">
          {/* Logo & Stats */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'from-white via-purple-200 to-blue-200' 
                  : 'from-slate-800 via-purple-600 to-blue-600'
              }`}>
                Link Router Pro
              </h1>
            </div>
            
            {/* Desktop Stats */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDarkMode 
                  ? 'bg-white/10 text-white/70 border border-white/20' 
                  : 'bg-black/10 text-slate-600 border border-black/20'
              }`}>
                {linksCount} links
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isDarkMode 
                  ? 'bg-white/10 text-white/70 border border-white/20' 
                  : 'bg-black/10 text-slate-600 border border-black/20'
              }`}>
                {totalClicks} clicks
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <Input
                ref={searchInputRef}
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 hover:bg-white/20"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onQuickAction('favorites')}
                size="sm"
                variant="outline"
                className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                {favoriteCount}
              </Button>
              
              <Button
                onClick={() => onQuickAction('popular')}
                size="sm"
                variant="outline"
                className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {popularCount}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1 gap-1">
              <Button
                onClick={() => onViewModeChange('compact')}
                size="sm"
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                className={`h-8 px-3 transition-all duration-200 ${
                  viewMode === 'compact' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'hover:bg-white/20 text-white/70'
                }`}
              >
                <Zap className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onViewModeChange('grid')}
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                className={`h-8 px-3 transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'hover:bg-white/20 text-white/70'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onViewModeChange('list')}
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                className={`h-8 px-3 transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'hover:bg-white/20 text-white/70'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              onClick={onAddLink}
              size="sm"
              className="h-10 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onToggleDarkMode}
              className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-10 px-4 transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onShowShortcuts}>
                  <Keyboard className="w-4 h-4 mr-2" />
                  Shortcuts
                </DropdownMenuItem>
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
                  {showPrivateLinks ? 'Hide' : 'Show'} Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between gap-2">
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
            {/* Random Link Button */}
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

            {/* Add Button */}
            <Button
              onClick={onAddLink}
              size="sm"
              className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
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

            {/* Mobile Menu Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleMobileMenu}
              className={`h-9 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search (always visible on mobile) */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 h-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 ${
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-3 p-4 rounded-lg border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700 backdrop-blur-sm' 
              : 'bg-white/95 border-slate-200 backdrop-blur-sm'
          }`}>
            {/* Quick Actions */}
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Quick Actions</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('favorites');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`h-12 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{favoriteCount}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('recent');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`h-12 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{recentCount}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onQuickAction('popular');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`h-12 flex flex-col items-center justify-center gap-1 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">{popularCount}</span>
                </Button>
              </div>
            </div>

            {/* Additional Tools */}
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleRandomLink();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`h-10 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="text-xs">Random</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleShareCollection();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`h-10 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>

            {/* View Mode */}
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>View Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'compact' ? 'default' : 'outline'}
                  onClick={() => {
                    onViewModeChange('compact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="h-10 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">Compact</span>
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => {
                    onViewModeChange('grid');
                    setIsMobileMenuOpen(false);
                  }}
                  className="h-10 flex items-center justify-center gap-2"
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-xs">Grid</span>
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => {
                    onViewModeChange('list');
                    setIsMobileMenuOpen(false);
                  }}
                  className="h-10 flex items-center justify-center gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="text-xs">List</span>
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Categories</h3>
              <div className="space-y-1">
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  onClick={() => {
                    onCategoryChange('all');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
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
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start h-8"
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="border-t pt-4">
              <h3 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>Settings</h3>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onToggleCompactHeader();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  {isCompactHeader ? <Maximize2 className="w-4 h-4 mr-2" /> : <Minimize2 className="w-4 h-4 mr-2" />}
                  {isCompactHeader ? 'Expand Header' : 'Compact Header'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onTogglePrivateLinks();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  {showPrivateLinks ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showPrivateLinks ? 'Hide' : 'Show'} Private Links
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleBackup();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onExportData();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onShowShortcuts();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start h-8"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
