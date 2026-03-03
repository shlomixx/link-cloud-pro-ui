import React, { useEffect, useRef, useState } from 'react';
import {
  Settings,
  Keyboard,
  Plus,
  FolderPlus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
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
  const headerRef = useRef<HTMLElement | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      document.documentElement.style.setProperty(
        "--app-header-h",
        `${el.offsetHeight}px`
      );
    };

    setVar();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => setVar());
      ro.observe(el);
    }

    window.addEventListener("resize", setVar);
    return () => {
      window.removeEventListener("resize", setVar);
      ro?.disconnect();
    };
  }, []);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      props.onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
    }
  };
  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 pt-3 sm:pt-4 pb-2 sm:pb-3 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-end">
          <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />

              <DropdownMenuItem onClick={props.onAddLink} className="rounded-md">
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New Link</span>
              </DropdownMenuItem>

              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-md">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <span>Add New Category</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category to organize your links.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="col-span-3"
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
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Add Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenuSeparator className="bg-gray-200" />
              
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

              {(props.onApplyCuratedLinks || props.onResetLocalData) && (
                <>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  {props.onApplyCuratedLinks && (
                    <DropdownMenuItem onClick={props.onApplyCuratedLinks} className="rounded-md">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Apply curated links pack</span>
                    </DropdownMenuItem>
                  )}
                  {props.onResetLocalData && (
                    <DropdownMenuItem onClick={props.onResetLocalData} className="rounded-md">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      <span>Reset local data</span>
                    </DropdownMenuItem>
                  )}
                </>
              )}

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
      </div>
    </header>
  );
}