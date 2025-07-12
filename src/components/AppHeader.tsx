import React, { useState } from 'react';
import { Search, Plus, Grid, List, Moon, Sun, Maximize2, Minimize2, Zap, Filter, Settings, Download, Upload, Eye, EyeOff, Keyboard, Heart, Clock, TrendingUp, Menu, X, ArrowUpDown, Trash2, Copy, RotateCcw, Share2, BookmarkPlus, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
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
  categoriesCount: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onQuickAction: (action: string) => void;
  recentCount: number;
  popularCount: number;
  linkSize: number;
  onLinkSizeChange: (size: number) => void;
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
  categoriesCount,
  fileInputRef,
  onQuickAction,
  recentCount,
  popularCount,
  linkSize,
  onLinkSizeChange
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
    <div className={`sticky top-0 z-50 transition-all duration-300`}>
      <div className={`container mx-auto px-4 py-3 border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'} ${isCompactHeader ? 'backdrop-blur-xl bg-transparent' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
              isDarkMode 
                ? 'from-white to-purple-300' 
                : 'from-slate-800 to-purple-600'
            }`}>
              Link Hub
            </h1>
          </div>

          {/* Main Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={`h-9 px-3 z-50 rounded-full ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Menu className="w-4 h-4 mr-2" />
                תפריט
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={`w-80 max-h-[80vh] overflow-y-auto z-50 rounded-xl ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-700 backdrop-blur-sm' 
                  : 'bg-white/90 border-slate-200 backdrop-blur-sm'
              }`}
            >
              {/* Search */}
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="חפש לינקים..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`pl-10 h-9 rounded-md ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400' 
                        : 'bg-black/5 border-black/20 text-slate-800 placeholder:text-slate-500'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-2 border-b border-white/10">
                <div className="text-xs font-medium mb-2 text-muted-foreground px-2">פעולות מהירות</div>
                <div className="grid grid-cols-2 gap-1">
                  <DropdownMenuItem
                    onClick={onAddLink}
                    className="h-8 justify-start cursor-pointer rounded-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    הוסף לינק
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleRandomLink}
                    className="h-8 justify-start cursor-pointer rounded-md"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    לינק אקראי
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onQuickAction('recent')}
                    className="h-8 justify-start cursor-pointer rounded-md"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    אחרונים ({recentCount})
                  </DropdownMenuItem>
                </div>
              </div>

              {/* View Mode */}
              <div className="p-2 border-b border-white/10">
                <div className="text-xs font-medium mb-2 text-muted-foreground px-2">מצב תצוגה</div>
                <div className="grid grid-cols-3 gap-1">
                  <DropdownMenuItem
                    onClick={() => onViewModeChange('compact')}
                    className={`h-8 justify-center cursor-pointer rounded-md ${viewMode === 'compact' ? 'bg-primary/10' : ''}`}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    קומפקטי
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onViewModeChange('grid')}
                    className={`h-8 justify-center cursor-pointer rounded-md ${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
                  >
                    <Grid className="w-4 h-4 mr-1" />
                    רשת
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onViewModeChange('list')}
                    className={`h-8 justify-center cursor-pointer rounded-md ${viewMode === 'list' ? 'bg-primary/10' : ''}`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    רשימה
                  </DropdownMenuItem>
                </div>
              </div>

              {/* Categories */}
              <div className="p-2 border-b border-white/10 max-h-40 overflow-y-auto">
                <div className="text-xs font-medium mb-2 text-muted-foreground px-2">קטגוריות</div>
                <DropdownMenuItem
                  onClick={() => onCategoryChange('all')}
                  className={`h-7 justify-start cursor-pointer mb-1 rounded-md ${selectedCategory === 'all' ? 'bg-primary/10' : ''}`}
                >
                  כל הקטגוריות
                </DropdownMenuItem>
                {categories.slice(0, 6).map(category => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`h-7 justify-start cursor-pointer mb-1 rounded-md ${selectedCategory === category ? 'bg-primary/10' : ''}`}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </DropdownMenuItem>
                ))}
              </div>

              {/* Settings */}
              <div className="p-2">
                <div className="text-xs font-medium mb-2 text-muted-foreground px-2">הגדרות</div>
                <DropdownMenuItem
                  onClick={onToggleDarkMode}
                  className="h-8 justify-start cursor-pointer mb-1 rounded-md"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDarkMode ? 'מצב בהיר' : 'מצב כהה'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onTogglePrivateLinks}
                  className="h-8 justify-start cursor-pointer mb-1 rounded-md"
                >
                  {showPrivateLinks ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPrivateLinks ? 'הסתר פרטיים' : 'הצג פרטיים'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className='bg-white/10 my-2'/>

                <DropdownMenuLabel>Link Size: {linkSize}px</DropdownMenuLabel>
                <div className="p-2">
                  <Slider
                    defaultValue={[linkSize]}
                    max={150}
                    min={40}
                    step={1}
                    onValueChange={(value) => onLinkSizeChange(value[0])}
                  />
                </div>
                
                <DropdownMenuSeparator className='bg-white/10 my-2'/>
                
                <DropdownMenuItem
                  onClick={onExportData}
                  className="h-8 justify-start cursor-pointer mb-1 rounded-md"
                >
                  <Download className="w-4 h-4 mr-2" />
                  ייצא נתונים
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 justify-start cursor-pointer mb-1 rounded-md"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  ייבא נתונים
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onShowShortcuts}
                  className="h-8 justify-start cursor-pointer rounded-md"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  קיצורי מקלדת
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};