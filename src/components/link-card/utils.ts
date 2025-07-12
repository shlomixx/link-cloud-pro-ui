import React from 'react';
import { BaseLinkCardProps } from './link-card/types';
import { DenseView } from './link-card/DenseView';
import { CompactView } from './link-card/CompactView';
import { GridView } from './link-card/GridView';
import { ListView } from './link-card/ListView';
import { getFaviconUrl, handleFaviconError } from './link-card/utils';

// Re-export types for backward compatibility
export type { LinkData } from './link-card/types';

interface LinkCardProps extends BaseLinkCardProps {}

export const LinkCard: React.FC<LinkCardProps> = (props) => {
  const { viewMode } = props;

  switch (viewMode) {
    case 'dense':
      return <DenseView {...props} />;
    case 'compact':
      return <CompactView {...props} />;
    case 'grid':
      return <GridView {...props} />;
    case 'list':
      return <ListView {...props} />;
    default:
      return <CompactView {...props} />;
  }
};