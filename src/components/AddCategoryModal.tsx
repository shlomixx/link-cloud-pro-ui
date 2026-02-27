import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryName: string) => void;
  isLoading: boolean;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  isLoading,
}) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAdd = () => {
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md transition-all duration-300 bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Category</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new category to organize your links.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="category-name" className="text-slate-300">
              Category Name
            </Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Social Media"
              className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 bg-slate-800/50 border-slate-600 text-white focus:border-purple-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="transition-all duration-300 hover:scale-105 border-slate-600 text-white hover:bg-slate-800/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd} 
            disabled={isLoading || !categoryName.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : null}
            Add Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
