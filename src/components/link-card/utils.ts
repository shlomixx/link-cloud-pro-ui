
// Re-export from the new optimized cache system
export { getFaviconUrl } from '@/utils/faviconCache';

export const handleFaviconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.target as HTMLImageElement).style.display = 'none';
};