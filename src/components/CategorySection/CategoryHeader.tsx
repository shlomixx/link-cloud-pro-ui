import React, { useState } from 'react';
import { Edit2, Check, X, GripVertical, Plus, Trash2, Sparkles } from 'lucide-react';
import { CategoryHeaderProps } from './types';
import { HEADER_STYLES } from './constants';
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
  const colorBarClass = `${styles.colorBar} bg-gradient-to-b ${categoryColors[category]}`;

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
        <div className={colorBarClass}></div>
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm font-bold uppercase tracking-wider bg-transparent border-slate-600 text-white focus:border-purple-500"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveEdit}
              className="h-6 w-6 p-0 hover:bg-green-500/20 text-green-400"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 group">
            <h2 className={styles.title}>
              {categoryLabels[category] || category}
            </h2>
            {onEditCategoryName && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleStartEdit}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/20 text-blue-400"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}

            {onAddCategory && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddCategory(category)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/20 text-purple-400"
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
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-400"
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
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500/20 text-amber-400"
                  >
                    <Sparkles className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onAddPredefinedCategory('adults')}>
                    Add adults category (18+)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddPredefinedCategory('news')}>
                    Add news category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Drag handle - only render if dragHandleProps provided */}
            {dragHandleProps && (
              <button
                {...(dragHandleProps as any)}
                aria-label="Move category"
                className={`h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-200 ${dragHandleProps.className ?? ''}`}
              >
                <GripVertical className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
        <div className={styles.separator}></div>
      </div>
    </div>
  );
});
