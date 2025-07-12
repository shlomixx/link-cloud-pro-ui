
export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    // Using a different favicon service for potentially better results
    return `https://icon.horse/icon/${domain}`;
  } catch {
    return '/link-icon.svg'; // Return a path to a generic link icon
  }
};

export const handleFaviconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  // Fallback to a generic icon if the favicon fails to load
  (e.target as HTMLImageElement).src = '/link-icon.svg';
};