import React from 'react';
import {
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
  Plus, // Make sure Plus is imported
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ViewMode } from '@/types'; // Import ViewMode

// The props interface should accept the full ViewMode type
interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  showPrivateLinks: boolean;
  onTogglePrivateLinks: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onAddLink: () => void; // Add onAddLink to props
  onShowShortcuts: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  linkSize: number;
  onLinkSizeChange: (size: number) => void;
}

export function AppHeader(props: AppHeaderProps) {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-2xl animate-slide-up">
      <div className="container relative flex h-16 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 px-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        
        {/* Centered Title */}
        <h1 className="gradient-text text-xl font-semibold tracking-tight">
          All Your Favorite Links in One Place
        </h1>
        
        {/* Menu Button - Positioned absolutely to the right */}
        <div className="absolute right-3 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10">
                <Settings className="h-5 w-5 text-slate-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`w-64 rounded-xl border-slate-700/50 bg-slate-900/80 p-2 backdrop-blur-xl`}
            >
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />

              {/* Add New Link Item */}
              <DropdownMenuItem onClick={props.onAddLink} className="rounded-md">
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New Link</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-700/50" />

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
              
              <DropdownMenuLabel>Link Size: {props.linkSize}px</DropdownMenuLabel>
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