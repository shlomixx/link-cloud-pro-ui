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
    <ContextMenuContent className="min-w-[190px] rounded-xl border border-slate-800 bg-slate-950/95 px-2 py-2 shadow-xl backdrop-blur-xl">
      <ContextMenuItem
        onClick={handleContextMenuClick(onEdit)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:bg-slate-800/80"
      >
        <Edit className="w-4 h-4" />
        <span>Edit</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={handleContextMenuClick(onCopyUrl)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:bg-slate-800/80"
      >
        <Copy className="w-4 h-4" />
        <span>Copy URL</span>
      </ContextMenuItem>
      {categories.length > 0 && onChangeCategory && (
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:bg-slate-800/80">
            <Edit className="w-4 h-4" />
            <span>Change Category</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="rounded-xl border border-slate-800 bg-slate-950/95 px-1 py-1 shadow-xl backdrop-blur-xl">
            {categories.filter(cat => cat !== link.category).map((category) => (
              <ContextMenuItem 
                key={category} 
                onClick={handleContextMenuClick(() => onChangeCategory(category))}
                className="rounded-lg px-2 py-1.5 text-sm text-slate-100 focus:bg-slate-800/80"
              >
                {category}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )}
      <ContextMenuSeparator className="my-1 bg-slate-800/80" />
      <ContextMenuItem
        onClick={handleContextMenuClick(onDelete || (() => {}))}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-400 focus:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};