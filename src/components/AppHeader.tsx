import React, { useEffect, useRef, useState } from 'react';
import {
  Settings,
  Keyboard,
  Plus,
  FolderPlus,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { PokiLogoMark } from '@/components/LinkCloud';

interface AppHeaderProps {
  onAddLink: () => void;
  onShowShortcuts: () => void;
  onAddCategory: (categoryName: string) => void;
  linkSize: number;
  onLinkSizeChange: (size: number) => void;
  onApplyCuratedLinks?: () => void;
  onResetLocalData?: () => void;
}

export function AppHeader(props: AppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      props.onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
    }
  };

  return (
    <header
      className="app-header-bar"
      aria-label="App controls"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2 select-none" aria-label="pokilo">
        <span className="text-[#18181B] dark:text-[#FAFAFA]">
          <PokiLogoMark size={22} />
        </span>
        <span
          className="text-[17px] font-bold tracking-[-0.04em] text-[#18181B] dark:text-[#FAFAFA] leading-none"
        >
          pokilo
        </span>
      </div>

      {/* Right: Theme toggle + Settings */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-lg text-[#9CA3AF] dark:text-[#4B5563] hover:text-[#18181B] dark:hover:text-[#FAFAFA] hover:bg-black/5 dark:hover:bg-white/6 transition-all duration-150"
          onClick={() => setTheme((resolvedTheme ?? 'light') === 'dark' ? 'light' : 'dark')}
          aria-label={(resolvedTheme ?? 'light') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {(resolvedTheme ?? 'light') === 'dark'
            ? <Sun className="h-4 w-4" />
            : <Moon className="h-4 w-4" />
          }
        </Button>

        {/* Settings dropdown — icon rotates on hover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg text-[#9CA3AF] dark:text-[#4B5563] hover:text-[#18181B] dark:hover:text-[#FAFAFA] hover:bg-black/5 dark:hover:bg-white/6 settings-icon-btn"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl shadow-2xl border border-[#E9E9E7] dark:border-white/8 bg-white dark:bg-[#141416] p-1.5"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] dark:text-[#4B5563]">
              Settings
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E9E9E7] dark:bg-white/5 my-1" />

            <DropdownMenuItem
              onClick={props.onAddLink}
              className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] hover:bg-[#F0F0EE] dark:hover:bg-white/5 cursor-pointer"
            >
              <Plus className="mr-2 h-3.5 w-3.5 text-[#9CA3AF]" />
              <span>Add New Link</span>
            </DropdownMenuItem>

            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] hover:bg-[#F0F0EE] dark:hover:bg-white/5 cursor-pointer"
                >
                  <FolderPlus className="mr-2 h-3.5 w-3.5 text-[#9CA3AF]" />
                  <span>Add New Category</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-2xl border border-[#E9E9E7] dark:border-white/8 bg-white dark:bg-[#141416] shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[15px] font-semibold text-[#18181B] dark:text-[#FAFAFA]">
                    Add New Category
                  </DialogTitle>
                  <DialogDescription className="text-[13px] text-[#757575] dark:text-[#8C8C8C]">
                    Create a new category to organize your links.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category-name" className="text-right text-[13px] text-[#757575] dark:text-[#8C8C8C]">
                      Name
                    </Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="col-span-3 h-9 rounded-lg text-[13px] border-[#E9E9E7] dark:border-white/8 bg-[#F0F0EE] dark:bg-[#1A1A1C]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCategory();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="rounded-lg text-[13px] border-[#E9E9E7] dark:border-white/8 hover:bg-[#F0F0EE] dark:hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="rounded-lg text-[13px] bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#09090B] hover:bg-[#2A2A2E] dark:hover:bg-gray-100"
                  >
                    Add Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator className="bg-[#E9E9E7] dark:bg-white/5 my-1" />

            <DropdownMenuLabel className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] dark:text-[#4B5563]">
              Link Size: {props.linkSize}px
            </DropdownMenuLabel>
            <div className="px-2 py-2">
              <Slider
                defaultValue={[props.linkSize]}
                max={150}
                min={40}
                step={1}
                onValueChange={(value) => props.onLinkSizeChange(value[0])}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
            </div>

            {(props.onApplyCuratedLinks || props.onResetLocalData) && (
              <>
                <DropdownMenuSeparator className="bg-[#E9E9E7] dark:bg-white/5 my-1" />
                {props.onApplyCuratedLinks && (
                  <DropdownMenuItem
                    onClick={props.onApplyCuratedLinks}
                    className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] hover:bg-[#F0F0EE] dark:hover:bg-white/5 cursor-pointer"
                  >
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-[#9CA3AF]" />
                    <span>Apply curated links pack</span>
                  </DropdownMenuItem>
                )}
                {props.onResetLocalData && (
                  <DropdownMenuItem
                    onClick={props.onResetLocalData}
                    className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] hover:bg-[#F0F0EE] dark:hover:bg-white/5 cursor-pointer"
                  >
                    <RotateCcw className="mr-2 h-3.5 w-3.5 text-[#9CA3AF]" />
                    <span>Reset local data</span>
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuSeparator className="bg-[#E9E9E7] dark:bg-white/5 my-1" />

            <DropdownMenuItem
              onClick={props.onShowShortcuts}
              className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] hover:bg-[#F0F0EE] dark:hover:bg-white/5 cursor-pointer"
            >
              <Keyboard className="mr-2 h-3.5 w-3.5 text-[#9CA3AF]" />
              Keyboard Shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
