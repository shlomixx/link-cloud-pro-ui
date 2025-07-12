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
  Keyboard,
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 rounded-full border border-slate-700/50 bg-slate-900/50 px-4 shadow-lg backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-slate-300" />
          <h1 className="hidden text-lg font-normal text-slate-300 sm:block">
            Link Hub
          </h1>
        </div>

        {/* Search */}
        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-xs">
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
            />
            <Input
              ref={props.searchInputRef}
              type="text"
              placeholder="Search links..."
              value={props.searchTerm}
              onChange={(e) => props.onSearchChange(e.target.value)}
              className={`h-9 w-full rounded-full border-transparent bg-white/5 pl-10 pr-4 transition-all duration-300 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>
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
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`w-64 rounded-xl border-slate-700/50 bg-slate-900/80 p-2 backdrop-blur-xl`}
            >
              <DropdownMenuLabel>Display</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-md">
                  <Grid className="mr-2 h-4 w-4" />
                  <span>View Mode</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="rounded-xl border-slate-700/50 bg-slate-900/80 p-1 backdrop-blur-xl">
                  <DropdownMenuItem
                    onClick={() => props.onViewModeChange('compact')}
                    className="rounded-md"
                  >
                    <Zap className="mr-2 h-4 w-4" /> Compact
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => props.onViewModeChange('grid')}
                    className="rounded-md"
                  >
                    <Grid className="mr-2 h-4 w-4" /> Grid
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => props.onViewModeChange('list')}
                    className="rounded-md"
                  >
                    <List className="mr-2 h-4 w-4" /> List
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuLabel className="pt-2">Link Size: {props.linkSize}px</DropdownMenuLabel>
              <div className="p-2">
                <Slider
                  defaultValue={[props.linkSize]}
                  max={150}
                  min={40}
                  step={1}
                  onValueChange={(value) => props.onLinkSizeChange(value[0])}
                />
              </div>

              <DropdownMenuSeparator className="bg-slate-700/50" />
              
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={props.onToggleDarkMode}
                className="rounded-md"
              >
                {props.isDarkMode ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{props.isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={props.showPrivateLinks}
                onCheckedChange={props.onTogglePrivateLinks}
                className="rounded-md"
              >
                <Eye className="mr-2 h-4 w-4" /> Show Private Links
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuSeparator className="bg-slate-700/50" />

              <DropdownMenuItem onClick={props.onExportData} className="rounded-md">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => props.fileInputRef.current?.click()}
                className="rounded-md"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={props.onShowShortcuts}
                className="rounded-md"
              >
                <Keyboard className="mr-2 h-4 w-4" />
                Keyboard Shortcuts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
