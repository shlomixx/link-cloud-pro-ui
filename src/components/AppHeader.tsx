import React, { useState } from 'react';
import {
  Search,
  Plus,
  Grid,
  List,
  Moon,
  Sun,
  Zap,
  Settings,
  Download,
  Upload,
  Eye,
  EyeOff,
  Keyboard,
  Shuffle,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

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

export function AppHeader(props: AppHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="hidden text-xl font-bold text-foreground sm:block">
            Link Hub
          </h1>
        </div>

        {/* Search */}
        <div
          className={`relative flex-1 transition-all duration-300 sm:max-w-xs ${
            isSearchOpen ? 'max-w-full' : 'max-w-[40px] sm:max-w-xs'
          }`}
        >
          <Search
            className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all ${
              isSearchOpen ? 'opacity-100' : 'opacity-0 sm:opacity-100'
            }`}
          />
          <Input
            ref={props.searchInputRef}
            type="text"
            placeholder="חפש לינקים..."
            value={props.searchTerm}
            onChange={(e) => props.onSearchChange(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
            className={`h-10 w-full rounded-full border-transparent bg-white/5 pl-10 pr-4 transition-all duration-300 focus:border-purple-500/50 focus:bg-white/10 focus:ring-purple-500/20`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={props.onAddLink}
          >
            <Plus className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`w-64 rounded-xl border-white/10 bg-slate-900/80 p-2 backdrop-blur-xl`}
            >
              <DropdownMenuLabel>תצוגה</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => props.onViewModeChange('compact')}
                className="rounded-md"
              >
                <Zap className="mr-2 h-4 w-4" /> קומפקטי
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => props.onViewModeChange('grid')}
                className="rounded-md"
              >
                <Grid className="mr-2 h-4 w-4" /> רשת
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => props.onViewModeChange('list')}
                className="rounded-md"
              >
                <List className="mr-2 h-4 w-4" /> רשימה
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuLabel>גודל לינקים: {props.linkSize}px</DropdownMenuLabel>
              <div className="p-2">
                <Slider
                  defaultValue={[props.linkSize]}
                  max={150}
                  min={40}
                  step={1}
                  onValueChange={(value) => props.onLinkSizeChange(value[0])}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`w-64 rounded-xl border-white/10 bg-slate-900/80 p-2 backdrop-blur-xl`}
            >
              <DropdownMenuLabel>הגדרות</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={props.onToggleDarkMode}
                className="rounded-md"
              >
                {props.isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {props.isDarkMode ? 'מצב בהיר' : 'מצב כהה'}
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={props.showPrivateLinks}
                onCheckedChange={props.onTogglePrivateLinks}
                className="rounded-md"
              >
                <Eye className="mr-2 h-4 w-4" /> הצג לינקים פרטיים
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={props.onExportData} className="rounded-md">
                <Download className="mr-2 h-4 w-4" />
                ייצא נתונים
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => props.fileInputRef.current?.click()}
                className="rounded-md"
              >
                <Upload className="mr-2 h-4 w-4" />
                ייבא נתונים
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={props.onShowShortcuts}
                className="rounded-md"
              >
                <Keyboard className="mr-2 h-4 w-4" />
                קיצורי מקלדת
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
