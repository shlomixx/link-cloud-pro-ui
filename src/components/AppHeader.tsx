import React, { useState } from 'react';
import {
  Settings,
  Keyboard,
  Plus,
  FolderPlus,
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
}

export function AppHeader(props: AppHeaderProps) {
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