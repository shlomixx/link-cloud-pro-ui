import React from 'react';
import { Plus } from 'lucide-react';
import { AddButtonProps } from './types';
import { ADD_BUTTON_STYLES } from './constants';

export const AddButton: React.FC<AddButtonProps> = React.memo(({ onAddLink, category }) => (
  <div
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onAddLink(category)}
    className={ADD_BUTTON_STYLES.container}
    onClick={() => onAddLink(category)}
    aria-label="Add link"
  >
    <div className={ADD_BUTTON_STYLES.button}>
      <Plus className={ADD_BUTTON_STYLES.icon} />
      <span className={ADD_BUTTON_STYLES.label}>Add link</span>
    </div>
  </div>
));
