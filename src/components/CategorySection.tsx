import React from 'react';
import { Plus } from 'lucide-react';
import { LinkCard } from './LinkCard';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  clicks?: number;
  createdAt?: string;
  lastClicked?: string;
}

interface CategorySectionProps {
  category: string;
  links: LinkData[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  hoveredLink: string | null;
  clickedLink: string | null;
  onLinkClick: (link: LinkData) => void;
  onEditLink: (link: LinkData) => void;
  onCopyUrl: (url: string, name: string) => void;
  onMouseEnter: (linkKey: string) => void;
  onMouseLeave: () => void;
  onAddLink: (category: string) => void;
  onDeleteLink: (linkKey: string) => void;
  onToggleFavorite: (linkKey: string) => void;
  onReorderLinks: (sourceIndex: number, destinationIndex: number, category: string) => void;
  linkSize: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  links,
  categoryLabels,
  categoryColors,
  hoveredLink,
  clickedLink,
  onLinkClick,
  onEditLink,
  onCopyUrl,
  onMouseEnter,
  onMouseLeave,
  onAddLink,
  onDeleteLink,
  onToggleFavorite,
  onReorderLinks,
  linkSize
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      onReorderLinks(sourceIndex, destinationIndex, category);
    }
  };

  const getGridClasses = () => {
    return 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-6';
  };

  const getMobileGridClasses = () => {
    return 'grid grid-cols-5 gap-4 px-4 py-3';
  };

  const getDesktopSeparator = () => (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${categoryColors[category]} shadow-sm`}></div>
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-[0.1em] drop-shadow-sm">
          {categoryLabels[category] || category}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700/60 to-transparent"></div>
      </div>
    </div>
  );

  const getMobileSeparator = () => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-1 h-4 rounded-full bg-gradient-to-b ${categoryColors[category]} shadow-sm`}></div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider drop-shadow-sm">
          {categoryLabels[category] || category}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700/40 to-transparent"></div>
      </div>
    </div>
  );

  const renderAddButton = () => (
    <div 
      className="group cursor-pointer" 
      onClick={() => onAddLink(category)}
    >
      <div className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-2 border-dashed border-slate-600/60 hover:border-slate-500/80 bg-gradient-to-br from-slate-900/20 to-slate-800/30 hover:from-slate-800/40 hover:to-slate-700/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl backdrop-blur-sm">
        <Plus className="h-6 w-6 text-slate-400 group-hover:text-slate-200 transition-all duration-300 drop-shadow-sm" />
        <span className="text-xs text-slate-500 group-hover:text-slate-300 mt-1.5 font-medium transition-all duration-300">Add Link</span>
      </div>
    </div>
  );

  if (links.length === 0) {
    return (
      <div className="animate-fade-in">
        {/* Desktop Layout */}
        <div className="hidden md:block mb-12">
          {getDesktopSeparator()}
          <div className={getGridClasses()}>
            {renderAddButton()}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden mb-10">
          <div className="mx-4 mb-4">
            {getMobileSeparator()}
          </div>
          <div className={getMobileGridClasses()}>
            {renderAddButton()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="animate-fade-in">
        {/* Desktop Layout */}
        <div className="hidden md:block mb-12">
          {getDesktopSeparator()}
          <Droppable droppableId={`category-${category}`} direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${getGridClasses()} ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl p-6 border-2 border-dashed border-slate-600/60 backdrop-blur-sm' : ''} transition-all duration-300`}
              >
                {links.map((link, index) => (
                  <Draggable key={link.key} draggableId={link.key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? 'z-50 rotate-3 scale-110 drop-shadow-2xl' : ''} transition-all duration-300 ease-out`}
                      >
                        <LinkCard
                          link={link}
                          hoveredLink={hoveredLink}
                          clickedLink={clickedLink}
                          onMouseEnter={() => onMouseEnter(link.key)}
                          onMouseLeave={onMouseLeave}
                          onLinkClick={() => onLinkClick(link)}
                          onToggleFavorite={(e) => {e.stopPropagation(); onToggleFavorite(link.key);}}
                          onEdit={() => onEditLink(link)}
                          onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
                          onDelete={() => onDeleteLink(link.key)}
                          onAdd={(category) => onAddLink(category)}
                          linkSize={linkSize}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {renderAddButton()}
              </div>
            )}
          </Droppable>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden mb-10">
          <div className="mx-4 mb-4">
            {getMobileSeparator()}
          </div>
          <Droppable droppableId={`category-mobile-${category}`} direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${getMobileGridClasses()} ${snapshot.isDraggingOver ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl p-4 border-2 border-dashed border-slate-600/60 backdrop-blur-sm' : ''} transition-all duration-300`}
              >
                {links.map((link, index) => (
                  <Draggable key={link.key} draggableId={`mobile-${link.key}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? 'z-50 rotate-2 scale-110 drop-shadow-2xl' : ''} transition-all duration-300 ease-out`}
                      >
                        <LinkCard
                          link={link}
                          hoveredLink={hoveredLink}
                          clickedLink={clickedLink}
                          onMouseEnter={() => onMouseEnter(link.key)}
                          onMouseLeave={onMouseLeave}
                          onLinkClick={() => onLinkClick(link)}
                          onToggleFavorite={(e) => {e.stopPropagation(); onToggleFavorite(link.key);}}
                          onEdit={() => onEditLink(link)}
                          onCopyUrl={() => onCopyUrl(link.url || link.defaultUrl || '', link.name)}
                          onDelete={() => onDeleteLink(link.key)}
                          onAdd={(category) => onAddLink(category)}
                          linkSize={linkSize}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {renderAddButton()}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};
