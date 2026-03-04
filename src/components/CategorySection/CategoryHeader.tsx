import React, { useState } from 'react';
import { Edit2, Check, X, GripVertical, Plus, Trash2, Sparkles } from 'lucide-react';
import { CategoryHeaderProps } from './types';
import { HEADER_STYLES, getCategoryAccentColor } from './constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const CategoryHeader: React.FC<CategoryHeaderProps> = React.memo(({
  category,
  categoryColors,
  categoryLabels,
  isMobile = false,
  onEditCategoryName,
  onDeleteCategory,
  onAddCategory,
  onAddPredefinedCategory,
  dragHandleProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const styles = isMobile ? HEADER_STYLES.mobile : HEADER_STYLES.desktop;
  const accentColor = getCategoryAccentColor(category);

  const handleStartEdit = () => {
    setEditValue(categoryLabels[category] || category);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue.trim() !== (categoryLabels[category] || category)) {
      onEditCategoryName?.(category, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1">
            {/* Colored accent bar — always visible even when editing */}
            <div
              className="flex-shrink-0 w-[3px] h-4 rounded-full"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-5 text-[11px] font-semibold uppercase tracking-[0.1em] bg-transparent border-[#E9E9E7] dark:border-white/10 text-[#9CA3AF] dark:text-[#4B5563] focus-visible:ring-1 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-0 rounded-md px-2"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveEdit}
              className="h-5 w-5 p-0 rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#9CA3AF] hover:text-[#18181B] dark:hover:text-[#FAFAFA]"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-5 w-5 p-0 rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#9CA3AF] hover:text-[#18181B] dark:hover:text-[#FAFAFA]"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 group">
            <div className="flex-1">
              <h2 className="category-section-title">
                {categoryLabels[category] || category}
              </h2>
            </div>

            {onEditCategoryName && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartEdit}
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#C8C8C6] hover:text-[#18181B] dark:text-[#2A2A2C] dark:hover:text-[#FAFAFA]"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}

            {onAddCategory && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddCategory(category)}
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#C8C8C6] hover:text-[#18181B] dark:text-[#2A2A2C] dark:hover:text-[#FAFAFA]"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}

            {onDeleteCategory && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const label = categoryLabels[category] || category;
                  if (window.confirm(`Are you sure you want to delete the "${label}" category and all its links?`)) {
                    onDeleteCategory(category);
                  }
                }}
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#C8C8C6] hover:text-red-500 dark:text-[#2A2A2C] dark:hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}

            {onAddPredefinedCategory && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-[#F0F0EE] dark:hover:bg-white/5 text-[#C8C8C6] hover:text-[#18181B] dark:text-[#2A2A2C] dark:hover:text-[#FAFAFA]"
                  >
                    <Sparkles className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="rounded-xl border border-[#E9E9E7] dark:border-white/8 bg-white dark:bg-[#141416] shadow-xl p-1"
                >
                  <DropdownMenuItem
                    className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] cursor-pointer"
                    onClick={() => onAddPredefinedCategory('adults')}
                  >
                    Add adults category (18+)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg text-[13px] text-[#18181B] dark:text-[#FAFAFA] cursor-pointer"
                    onClick={() => onAddPredefinedCategory('news')}
                  >
                    Add news category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Drag handle */}
            {dragHandleProps && (
              <button
                {...(dragHandleProps as any)}
                aria-label="Move category"
                className={`h-5 w-5 p-0 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C8C8C6] hover:text-[#18181B] dark:text-[#2A2A2C] dark:hover:text-[#FAFAFA] ${dragHandleProps.className ?? ''}`}
              >
                <GripVertical className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
