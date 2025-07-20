import React from 'react';
import {
  Grid,
  List,
  Zap,
  Settings,
  Eye,
  Keyboard,
  Plus,
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
import { ViewMode } from '@/types';

interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showPrivateLinks: boolean;
  onTogglePrivateLinks: () => void;
  onAddLink: () => void;
  onShowShortcuts: () => void;
  linkSize: number;
  onLinkSizeChange: (size: number) => void;
}

export function AppHeader(props: AppHeaderProps) {
  return (
    <header className="pt-16 pb-8">
      <div className="container mx-auto flex items-center justify-between">
        {/* Spacer to keep title centered */}
        <div className="w-10"></div>
        
        {/* Centered Title with updated font and color */}
        <h1 className="text-4xl font-normal text-white tracking-wide text-center flex-grow">
          All Your Favorite Links in One Place
        </h1>
        
        {/* Menu Button */}
        <div className="w-10 flex justify-end">
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
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />

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