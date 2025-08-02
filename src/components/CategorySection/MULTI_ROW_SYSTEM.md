# Multi-Row Drag & Drop System

## 🎯 Overview

The CategorySection component now supports **multi-row drag zones**, where each row acts as an independent droppable area. This allows for better organization and more intuitive drag-and-drop interactions.

## 🏗️ Architecture

### Row-Based Structure
```
Category
├── Row 1 (Droppable Zone)
│   ├── Link 1-12 (Desktop) / 1-5 (Mobile)
│   └── Add Button (if last row)
├── Row 2 (Droppable Zone)
│   ├── Link 13-24 (Desktop) / 6-10 (Mobile)
│   └── Add Button (if last row)
└── Row N...
```

### Key Components

#### 1. **RowDropZone**
- **Purpose**: Individual droppable area for each row
- **Features**: 
  - Visual feedback on drag over
  - Responsive layout (desktop/mobile)
  - Smart Add button placement
  - Proper drag zone boundaries

#### 2. **Utils Functions**
- `chunkLinksIntoRows()`: Splits links array into row-based chunks
- `flattenRowsToLinks()`: Converts rows back to flat array
- `getRowIndex()`: Calculates which row a link belongs to
- `getPositionInRow()`: Gets position within specific row

### 🎛️ Configuration

#### Items Per Row
```typescript
export const ITEMS_PER_ROW = {
  desktop: 12, // 12 items per row on desktop
  mobile: 5    // 5 items per row on mobile
} as const;
```

#### Drag Zone IDs
- **Desktop**: `category-{categoryName}-row-{rowIndex}`
- **Mobile**: `category-mobile-{categoryName}-row-{rowIndex}`

## 🎨 Visual Features

### Drag Feedback
- **Hover State**: Dashed border appears on hover
- **Drag Over**: Blue border and background highlight
- **Smooth Transitions**: 200ms transition for all states

### Layout Classes
```css
.rowContainer {
  min-height: 120px;
  padding: 1rem;
  border: 2px dashed transparent;
  border-radius: 0.5rem;
  transition: colors 200ms;
}

.rowContainer:hover {
  border-color: rgba(107, 114, 128, 0.3);
}

.dragOver {
  border-color: rgba(59, 130, 246, 0.5);
  background-color: rgba(59, 130, 246, 0.05);
}
```

## 🔄 Drag & Drop Behavior

### Row Restrictions
- Links can only be moved within the same row by default
- Cross-row movement requires specific handling
- Each row maintains its own drop zone

### Index Management
```typescript
// Calculate global index from row position
const globalIndex = rowIndex * itemsPerRow + indexInRow;

// Find row from global index  
const rowIndex = Math.floor(globalIndex / itemsPerRow);
const positionInRow = globalIndex % itemsPerRow;
```

## 📱 Responsive Design

### Desktop Layout
- **12 items per row**
- **Flex wrap layout** with gaps
- **Visual drag zones** with borders
- **Horizontal scrolling** within rows

### Mobile Layout  
- **5 items per row**
- **Grid layout** optimized for touch
- **Compact spacing**
- **Touch-friendly drag handles**

## 🚀 Benefits

### 1. **Better Organization**
- Links are grouped in logical rows
- Easier to scan and find items
- Clear visual separation

### 2. **Improved Performance** 
- Smaller drag zones reduce calculation overhead
- Row-based virtualization possible
- Better memory management

### 3. **Enhanced UX**
- Clear drop targets
- Intuitive drag behavior
- Visual feedback on all interactions
- Prevents accidental cross-row moves

### 4. **Scalability**
- Supports unlimited rows
- Configurable items per row
- Easy to add row-specific features

## 🔧 Usage Examples

### Basic Implementation
```tsx
<CategorySection
  category="work"
  links={workLinks}
  // ... other props
/>
```

### Custom Row Configuration
```typescript
// Modify items per row
const CUSTOM_ITEMS_PER_ROW = {
  desktop: 8,  // 8 items per row
  mobile: 4    // 4 items per row
};
```

### Handling Row-Based Events
```typescript
const handleLinkMove = (dragResult) => {
  const { draggableId, source, destination } = dragResult;
  
  // Extract row information from droppableId
  const sourceRow = extractRowFromId(source.droppableId);
  const destRow = extractRowFromId(destination.droppableId);
  
  if (sourceRow !== destRow) {
    // Handle cross-row movement
    handleCrossRowMove(dragResult);
  } else {
    // Handle same-row reorder
    handleSameRowReorder(dragResult);
  }
};
```

## 🎯 Future Enhancements

### Planned Features
1. **Cross-Row Drag**: Enable dragging between rows
2. **Row Management**: Add/remove/reorder rows
3. **Row Labels**: Custom labels for each row
4. **Row Collapsing**: Collapse/expand rows
5. **Row Templates**: Predefined row layouts

### Advanced Features
1. **Virtual Scrolling**: For large numbers of rows
2. **Row Filtering**: Show/hide specific rows
3. **Row Grouping**: Nested row categories
4. **Row Analytics**: Track row usage and performance

This multi-row system provides a solid foundation for scalable, organized link management with excellent drag-and-drop UX! 🎉
