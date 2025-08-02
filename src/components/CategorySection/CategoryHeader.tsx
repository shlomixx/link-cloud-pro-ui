import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { CategoryHeaderProps } from './types';
import { HEADER_STYLES } from './constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CategoryHeader: React.FC<CategoryHeaderProps> = React.memo(({ 
  category, 
  categoryColors, 
  categoryLabels, 
  isMobile = false,
  onEditCategoryName
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
          </div>
        )}
        <div className={styles.separator}></div>
      </div>
    </div>
  );
});
