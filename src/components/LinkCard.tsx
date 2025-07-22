
import React from 'react';
import { BaseLinkCardProps } from './link-card/types';
import { DenseView } from './link-card/DenseView';
import { CompactView } from './link-card/CompactView';
import { GridView } from './link-card/GridView';
import { ListView } from './link-card/ListView';

// Re-export types for backward compatibility
export type { LinkData } from './link-card/types';

interface LinkCardProps extends BaseLinkCardProps {}

export const LinkCard: React.FC<LinkCardProps> = (props) => {
  // Fixed to compact view
  return <CompactView {...props} />;
};
