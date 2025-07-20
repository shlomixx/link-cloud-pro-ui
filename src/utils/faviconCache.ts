// Favicon caching system to reduce external requests
interface FaviconCache {
  [domain: string]: {
    url: string;
    timestamp: number;
    failed?: boolean;
  };
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 1000;

class FaviconCacheManager {
  private cache: FaviconCache = {};
  private storageKey = 'faviconCache';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.cache = JSON.parse(stored);
        this.cleanExpired();
      }
    } catch (error) {
      console.warn('Failed to load favicon cache:', error);
      this.cache = {};
    }
  }

  private saveToStorage() {
    try {
      // Limit cache size
      const entries = Object.entries(this.cache);
      if (entries.length > MAX_CACHE_SIZE) {
        // Keep only the most recent entries
        entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        this.cache = Object.fromEntries(entries.slice(0, MAX_CACHE_SIZE));
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save favicon cache:', error);
    }
  }

  private cleanExpired() {
    const now = Date.now();
    Object.keys(this.cache).forEach(domain => {
      if (now - this.cache[domain].timestamp > CACHE_DURATION) {
        delete this.cache[domain];
      }
    });
  }

  getCachedFavicon(url: string): string | null {
    try {
      const domain = new URL(url).hostname;
      const cached = this.cache[domain];
      
      if (cached && !cached.failed) {
        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
        if (!isExpired) {
          return cached.url;
        } else {
          delete this.cache[domain];
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  cacheFavicon(url: string, faviconUrl: string, failed = false) {
    try {
      const domain = new URL(url).hostname;
      this.cache[domain] = {
        url: failed ? '' : faviconUrl,
        timestamp: Date.now(),
        failed
      };
      this.saveToStorage();
    } catch (error) {
      console.warn('Failed to cache favicon:', error);
    }
  }

  preloadFavicon(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check cache first
      const cached = this.getCachedFavicon(url);
      if (cached) {
        resolve(cached);
        return;
      }

      try {
        const domain = new URL(url).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
          this.cacheFavicon(url, faviconUrl);
          resolve(faviconUrl);
        };
        img.onerror = () => {
          this.cacheFavicon(url, '', true);
          reject(new Error('Failed to load favicon'));
        };
        img.src = faviconUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  // Batch preload favicons for better performance
  async batchPreloadFavicons(urls: string[]): Promise<void> {
    const chunks = [];
    const chunkSize = 10; // Process 10 at a time to avoid overwhelming the browser
    
    for (let i = 0; i < urls.length; i += chunkSize) {
      chunks.push(urls.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(url => this.preloadFavicon(url))
      );
      // Small delay between chunks to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

export const faviconCache = new FaviconCacheManager();

export const getFaviconUrl = (url: string): string => {
  const cached = faviconCache.getCachedFavicon(url);
  if (cached) return cached;
  
  try {
    const domain = new URL(url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    // Cache asynchronously
    faviconCache.preloadFavicon(url).catch(() => {
      // Silently handle errors
    });
    
    return faviconUrl;
  } catch {
    return '';
  }
};
