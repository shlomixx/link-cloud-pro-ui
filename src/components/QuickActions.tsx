import React, { useState } from 'react';
import { Plus, Folder, Star, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface QuickActionsProps {
  isDarkMode: boolean;
  onOpenLinkModal: () => void;
  categories: string[];
  onAddCategory: (category: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isDarkMode,
  onOpenLinkModal,
  categories,
  onAddCategory
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced main actions bar for desktop */}
      <div className={`
        flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-8 rounded-2xl md:rounded-3xl
        transition-all duration-500 hover:shadow-2xl
        ${isDarkMode 
          ? 'bg-gradient-card border border-border/50 hover:border-border/70' 
          : 'bg-gradient-card border border-border/30 hover:border-border/50'
        }
        backdrop-blur-sm shadow-xl
      `}>
        {/* Enhanced primary action button */}
        <Button
          onClick={onOpenLinkModal}
          className="btn-gradient px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-base md:text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Link
        </Button>

        {/* Enhanced category management */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-1">
          {!showCategoryInput ? (
            <Button
              onClick={() => setShowCategoryInput(true)}
              variant="outline"
              className={`
                px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105
                ${isDarkMode 
                  ? 'border-border/50 hover:border-primary/50 bg-card/50 hover:bg-card/70' 
                  : 'border-border/30 hover:border-primary/40 bg-card/30 hover:bg-card/50'
                }
                backdrop-blur-sm font-medium
              `}
            >
              <Folder className="w-4 h-4 mr-2" />
              New Category
            </Button>
          ) : (
            <div className="flex gap-2 flex-1">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name..."
                className={`
                  flex-1 rounded-xl border-border/50 font-medium
                  ${isDarkMode ? 'bg-card/50' : 'bg-card/30'}
                  backdrop-blur-sm focus:ring-primary/50
                `}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                autoFocus
              />
              <Button 
                onClick={handleAddCategory}
                size="sm"
                className="btn-gradient px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Add
              </Button>
              <Button 
                onClick={() => {
                  setShowCategoryInput(false);
                  setNewCategory('');
                }}
                variant="outline"
                size="sm"
                className="px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced categories overview for desktop */}
      {categories.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-semibold text-enhanced gradient-text">
              Categories
            </h3>
            <div className="h-px bg-gradient-primary flex-1 opacity-30"></div>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category, index) => (
              <Badge 
                key={category}
                variant="secondary"
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                  transition-all duration-300 hover:scale-105 hover:shadow-lg
                  animate-fade-in
                  ${isDarkMode 
                    ? 'bg-card/50 hover:bg-card/70 border border-border/30 hover:border-primary/40' 
                    : 'bg-card/30 hover:bg-card/50 border border-border/20 hover:border-primary/30'
                  }
                  backdrop-blur-sm
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Folder className="w-3 h-3 mr-1.5" />
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
