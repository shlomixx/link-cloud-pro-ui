import { LinkData } from './types';

// Test utilities for CategorySection component
export const createMockLink = (overrides: Partial<LinkData> = {}): LinkData => ({
  key: `link-${Date.now()}`,
  name: 'Test Link',
  url: 'https://example.com',
  category: 'test',
  clicks: 0,
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockLinks = (count: number, category = 'test'): LinkData[] => 
  Array.from({ length: count }, (_, index) => 
    createMockLink({ 
      key: `link-${index}`,
      name: `Link ${index + 1}`,
      category 
    })
  );

export const mockCategoryColors = {
  work: 'from-blue-500 to-blue-600',
  personal: 'from-green-500 to-green-600',
  tools: 'from-purple-500 to-purple-600',
  test: 'from-gray-500 to-gray-600'
};

export const mockCategoryLabels = {
  work: 'Work',
  personal: 'Personal',
  tools: 'Tools',
  test: 'Test Category'
};

export const createMockProps = (overrides = {}) => ({
  category: 'test',
  links: createMockLinks(3),
  categoryLabels: mockCategoryLabels,
  categoryColors: mockCategoryColors,
  hoveredLink: null,
  clickedLink: null,
  onLinkClick: () => {},
  onEditLink: () => {},
  onCopyUrl: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onAddLink: () => {},
  onDeleteLink: () => {},
  onToggleFavorite: () => {},
  onReorderLinks: () => {},
  linkSize: 80,
  ...overrides
});
