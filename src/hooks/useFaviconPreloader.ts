import { useEffect } from 'react';
import { faviconCache } from '@/utils/faviconCache';
import { LinkData } from '@/types';

export const useFaviconPreloader = (links: LinkData[]) => {
  useEffect(() => {
    // Extract unique URLs from links
    const urls = Array.from(new Set(
      links
        .map(link => link.url || link.defaultUrl)
        .filter(Boolean) as string[]
    ));

    // Batch preload favicons
    faviconCache.batchPreloadFavicons(urls).catch(error => {
      console.warn('Failed to preload some favicons:', error);
    });
  }, [links]);
};