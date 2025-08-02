import React from 'react';
import { Plus } from 'lucide-react';
import { AddButtonProps } from './types';
import { ADD_BUTTON_STYLES } from './constants';

export const AddButton: React.FC<AddButtonProps> = React.memo(({ onAddLink, category }) => (
  <div 
    className={ADD_BUTTON_STYLES.container}
    onClick={() => onAddLink(category)}
  >
    <div className={ADD_BUTTON_STYLES.button}>
      <Plus className={ADD_BUTTON_STYLES.icon} />
      <span className={ADD_BUTTON_STYLES.text}>Add Link</span>
    </div>
  </div>
));
