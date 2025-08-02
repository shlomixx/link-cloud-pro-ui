import React from 'react';
import { Edit, Heart, Copy, Trash2 } from 'lucide-react';
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from '@/components/ui/context-menu';
import { LinkData } from './types';

interface ContextMenuProps {
  link: LinkData;
  
  categories: string[];
  onEdit: () => void;
  onCopyUrl: () => void;
  onToggleFavorite: () => void;
  onChangeCategory?: (category: string) => void;
  onDelete?: () => void;
}

export const LinkCardContextMenu: React.FC<ContextMenuProps> = ({
  link,
  
  categories,
  onEdit,
  onCopyUrl,
  onToggleFavorite,
  onChangeCategory,
  onDelete
}) => {
  const handleContextMenuClick = (action: () => void) => {
    return () => {
      action();
    };
  };

  return (
    <ContextMenuContent className="bg-slate-900/95 border-slate-700">
      <ContextMenuItem onClick={handleContextMenuClick(onEdit)}>
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </ContextMenuItem>
      <ContextMenuItem onClick={handleContextMenuClick(onCopyUrl)}>
        <Copy className="w-4 h-4 mr-2" />
        Copy URL
      </ContextMenuItem>
      {categories.length > 0 && onChangeCategory && (
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Edit className="w-4 h-4 mr-2" />
            Change Category
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {categories.filter(cat => cat !== link.category).map((category) => (
              <ContextMenuItem 
                key={category} 
                onClick={handleContextMenuClick(() => onChangeCategory(category))}
              >
                {category}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleContextMenuClick(onDelete || (() => {}))} className="text-red-600">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );
};