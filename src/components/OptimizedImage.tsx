import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallback = '/placeholder.svg',
  loading = 'lazy'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = useCallback(() => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  }, [imgSrc, fallback]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      decoding="async"
    />
  );
};