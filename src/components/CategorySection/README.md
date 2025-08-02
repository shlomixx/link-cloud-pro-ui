# CategorySection Component

A highly optimized and modular React component for displaying and managing categorized links with drag-and-drop functionality.

## Features

- ✅ **Responsive Design** - Adapts to desktop and mobile layouts
- ✅ **Drag and Drop** - Full support for react-beautiful-dnd
- ✅ **Cross-Category Dragging** - Move links between categories
- ✅ **Modular Architecture** - Split into focused sub-components
- ✅ **TypeScript** - Full type safety
- ✅ **Performance Optimized** - Minimal re-renders

## Structure

```
CategorySection/
├── index.ts                 # Main exports
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Style constants and configurations
├── CategoryHeader.tsx       # Header component with category info
├── AddButton.tsx           # Add new link button
├── DraggableLinkItem.tsx   # Individual draggable link item
└── README.md               # This documentation
```

## Usage

```tsx
import { CategorySection } from './components/CategorySection';

<CategorySection
  category="work"
  links={workLinks}
  categoryLabels={{ work: "Work Tools" }}
  categoryColors={{ work: "from-blue-500 to-blue-600" }}
  hoveredLink={hoveredLink}
  clickedLink={clickedLink}
  onLinkClick={handleLinkClick}
  onEditLink={handleEdit}
  onCopyUrl={handleCopy}
  onMouseEnter={setHoveredLink}
  onMouseLeave={() => setHoveredLink(null)}
  onAddLink={handleAddLink}
  onDeleteLink={handleDeleteLink}
  onToggleFavorite={handleToggleFavorite}
  onReorderLinks={handleReorderLinks}
  linkSize={80}
/>
```

## Props

### CategorySectionProps

| Prop | Type | Description |
|------|------|-------------|
| `category` | `string` | Category identifier |
| `links` | `LinkData[]` | Array of links in this category |
| `categoryLabels` | `Record<string, string>` | Display names for categories |
| `categoryColors` | `Record<string, string>` | Tailwind gradient classes for category colors |
| `hoveredLink` | `string \| null` | Currently hovered link key |
| `clickedLink` | `string \| null` | Currently clicked link key |
| `linkSize` | `number` | Size of link cards in pixels |

### Event Handlers

| Handler | Type | Description |
|---------|------|-------------|
| `onLinkClick` | `(link: LinkData) => void` | Handle link click events |
| `onEditLink` | `(link: LinkData) => void` | Handle edit link events |
| `onCopyUrl` | `(url: string, name: string) => void` | Handle copy URL events |
| `onMouseEnter` | `(linkKey: string) => void` | Handle mouse enter events |
| `onMouseLeave` | `() => void` | Handle mouse leave events |
| `onAddLink` | `(category: string) => void` | Handle add new link events |
| `onDeleteLink` | `(linkKey: string) => void` | Handle delete link events |
| `onToggleFavorite` | `(linkKey: string) => void` | Handle favorite toggle events |
| `onReorderLinks` | `(sourceIndex: number, destinationIndex: number, category: string) => void` | Handle link reordering |

## Components

### CategoryHeader
Displays the category title with color-coded indicator and separator line.

### AddButton
Interactive button for adding new links to the category.

### DraggableLinkItem
Wrapper component that makes LinkCard components draggable using react-beautiful-dnd.

## Constants

### GRID_CLASSES
Responsive grid configurations for different screen sizes.

### LAYOUT_CLASSES
Layout utility classes for containers and responsive visibility.

### HEADER_STYLES
Predefined styles for mobile and desktop header variants.

### ADD_BUTTON_STYLES
Comprehensive styling for the add button component.

## Architecture Benefits

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Sub-components can be used independently
3. **Maintainability** - Easy to modify individual pieces
4. **Testability** - Components can be tested in isolation
5. **Type Safety** - Full TypeScript coverage
6. **Performance** - Optimized for minimal re-renders

## Performance Optimizations

- Constants extracted to prevent re-calculations
- Props consolidation to reduce object creation
- Modular components for granular updates
- Optimized class name generation
- Efficient drag and drop handling
