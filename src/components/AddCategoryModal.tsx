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
      <DialogContent className="max-w-md transition-all duration-300 bg-white border-gray-200 text-gray-900 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Category</DialogTitle>
          <DialogDescription className="text-gray-500">
            Create a new category to organize your links.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="category-name" className="text-gray-800">
              Category Name
            </Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Social Media"
              className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="transition-all duration-300 hover:scale-105 border-gray-300 text-gray-800 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd} 
            disabled={isLoading || !categoryName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105"
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
