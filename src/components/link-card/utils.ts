
// Re-export from the new optimized cache system
export { getFaviconUrl } from '@/utils/faviconCache';

/**
 * Generate a deterministic color from a string (name).
 * Returns an HSL string so saturation/lightness stay pleasant.
 */
export function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 55%, 52%)`;
}

export const handleFaviconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
  // Show the sibling fallback element
  const fallback = img.nextElementSibling as HTMLElement | null;
  if (fallback) {
    fallback.style.display = 'flex';
  }
};
