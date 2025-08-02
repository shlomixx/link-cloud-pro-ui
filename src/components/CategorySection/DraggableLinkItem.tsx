import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { LinkCard } from '../LinkCard';
import { DraggableLinkItemProps } from './types';
import { DRAG_CLASSES } from './constants';

export const DraggableLinkItem: React.FC<DraggableLinkItemProps> = ({ 
  link, 
  index, 
  hoveredLink, 
  clickedLink, 
  onMouseEnter, 
  onMouseLeave, 
  onLinkClick, 
  onToggleFavorite, 
  onEditLink, 
  onCopyUrl, 
  onDeleteLink, 
  onAddLink, 
  linkSize,
  isMobile = false
}) => {
  const draggableId = isMobile ? `mobile-${link.key}` : link.key;
  
  return (
    <Draggable key={link.key} draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? DRAG_CLASSES.dragging : ''}
        >
          <LinkCard
            link={link}
            hoveredLink={hoveredLink}
            clickedLink={clickedLink}
            onMouseEnter={() => onMouseEnter(link.key)}
            onMouseLeave={onMouseLeave}
            onLinkClick={() => onLinkClick(link)}
            onToggleFavorite={(e) => {
              e.stopPropagation(); 
              onToggleFavorite(link.key);
            }}
            onEdit={() => onEditLink(link)}
            onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
            onDelete={() => onDeleteLink(link.key)}
            onAdd={(category) => onAddLink(category)}
            linkSize={linkSize}
          />
        </div>
      )}
    </Draggable>
  );
};
