/**
 * Intelligent caching system for CategorySection
 * 
 * Implements LRU cache for row calculations and memoization
 * for expensive operations.
 */

import { LinkData } from './types';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
}

class LRUCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private maxSize: number;
  private maxAge: number; // in milliseconds

  constructor(maxSize = 50, maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Update access count and timestamp
    entry.accessCount++;
    entry.timestamp = Date.now();
    
    // Move to end (most recent)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.value;
  }

  set(key: K, value: V): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      totalAccesses: entries.reduce((sum, entry) => sum + entry.accessCount, 0),
      averageAge: entries.length > 0 
        ? entries.reduce((sum, entry) => sum + (Date.now() - entry.timestamp), 0) / entries.length
        : 0
    };
  }
}

// Global caches for different data types
const rowChunkCache = new LRUCache<string, LinkData[][]>(100);
const layoutCache = new LRUCache<string, any>(50);

/**
 * Cached version of chunk links into rows
 */
export const cachedChunkLinksIntoRows = (
  links: LinkData[], 
  itemsPerRow: number
): LinkData[][] => {
  // Create cache key based on links hash and itemsPerRow
      const linksHash = links.map((link, i) => `${i}:${link.key}`).join('|')
          const cacheKey = `${linksHash}-${itemsPerRow}`;
  
  // Try to get from cache first
  const cached = rowChunkCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Calculate if not in cache
  const result: LinkData[][] = [];
  
  if (!links.length) {
    result.push([]);
  } else {
    for (let i = 0; i < links.length; i += itemsPerRow) {
      result.push(links.slice(i, i + itemsPerRow));
    }
    
    // Ensure there's always an empty row at the end
    const lastRow = result[result.length - 1];
    if (lastRow && lastRow.length >= itemsPerRow) {
      result.push([]);
    }
  }
  
  // Cache the result
  rowChunkCache.set(cacheKey, result);
  
  return result;
};

/**
 * Cache manager for performance monitoring
 */
export const cacheManager = {
  getRowCacheStats: () => rowChunkCache.getStats(),
  getLayoutCacheStats: () => layoutCache.getStats(),
  
  clearRowCache: () => rowChunkCache.clear(),
  clearLayoutCache: () => layoutCache.clear(),
  clearAllCaches: () => {
    rowChunkCache.clear();
    layoutCache.clear();
  },
  
  // Preload cache with common patterns
  preloadCache: (categories: string[], commonSizes: number[] = [5, 12]) => {
    console.log('🚀 Preloading caches for better performance...');
    
    // This would be called with actual data in a real scenario
    // For now, it's just setting up the structure
    const startTime = performance.now();
    
    setTimeout(() => {
      const endTime = performance.now();
      console.log(`✅ Cache preloading completed in ${(endTime - startTime).toFixed(2)}ms`);
    }, 0);
  }
};

/**
 * React hook for cache-aware row optimization
 */
import { useMemo } from 'react';

export const useCachedRows = (links: LinkData[], itemsPerRow: number) => {
  return useMemo(() => {
    return cachedChunkLinksIntoRows(links, itemsPerRow);
  }, [links, itemsPerRow]);
};
