/**
 * Animation optimization utilities for CategorySection
 * 
 * Provides smooth, 60fps animations with minimal performance impact.
 * Includes GPU acceleration and frame rate monitoring.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook for optimized drag animations
 * 
 * Uses requestAnimationFrame for smooth animations and
 * GPU acceleration for better performance.
 */
export const useDragAnimation = (isDragging: boolean) => {
  const animationRef = useRef<number>();
  const elementRef = useRef<HTMLElement>();

  // Optimized animation styles with GPU acceleration
  const animationStyles = useMemo(() => ({
    transform: isDragging 
      ? 'translateZ(0) rotate(3deg) scale(1.05)' // Force GPU layer
      : 'translateZ(0) rotate(0deg) scale(1)',
    transition: isDragging 
      ? 'none' // Disable transitions during drag for performance
      : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: isDragging ? 'transform' : 'auto', // Optimize for animations
    backfaceVisibility: 'hidden' as const, // Prevent flickering
  }), [isDragging]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    animationStyles,
    elementRef
  };
};

/**
 * Hook for optimized hover animations
 * 
 * Debounces hover events and uses efficient CSS transforms.
 */
export const useHoverAnimation = (isHovered: boolean, delay = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isDelayedHovered = useRef(false);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isDelayedHovered.current = isHovered;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, delay]);

  const hoverStyles = useMemo(() => ({
    transform: isDelayedHovered.current 
      ? 'translateY(-2px) translateZ(0)' // GPU accelerated
      : 'translateY(0) translateZ(0)',
    boxShadow: isDelayedHovered.current 
      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, box-shadow'
  }), []);

  return hoverStyles;
};

/**
 * Frame rate monitor for animation performance
 */
export const useFrameRateMonitor = (enabled = process.env.NODE_ENV === 'development') => {
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const frameCountRef = useRef<number>(0);

  const measureFrameRate = useCallback(() => {
    if (!enabled) return;

    const now = performance.now();
    
    if (!startTimeRef.current) {
      startTimeRef.current = now;
    }

    frameCountRef.current++;

    // Calculate FPS every second
    if (now - startTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - startTimeRef.current));
      
      if (fps < 50) {
        console.warn(`⚠️ Low FPS detected: ${fps}fps in animations`);
      }

      // Reset counters
      frameCountRef.current = 0;
      startTimeRef.current = now;
    }

    frameRef.current = requestAnimationFrame(measureFrameRate);
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      frameRef.current = requestAnimationFrame(measureFrameRate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, measureFrameRate]);

  return {
    getCurrentFPS: () => frameCountRef.current
  };
};

/**
 * Optimized transition hook with reduced layout thrashing
 */
export const useOptimizedTransition = (
  isVisible: boolean,
  duration = 200,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      // Start animation on next frame
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      const timeout = setTimeout(() => {
        setIsRendered(false);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  const transitionStyles = useMemo(() => ({
    opacity: isAnimating ? 1 : 0,
    transform: isAnimating 
      ? 'translateY(0) translateZ(0)' 
      : 'translateY(10px) translateZ(0)',
    transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
    willChange: isAnimating ? 'opacity, transform' : 'auto'
  }), [isAnimating, duration, easing]);

  return {
    isRendered,
    transitionStyles
  };
};

// Import useState for useOptimizedTransition
import { useState } from 'react';

/**
 * Animation utilities
 */
export const animationUtils = {
  // Check if device prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal animation duration based on device performance
  getOptimalDuration: (baseDuration: number) => {
    if (typeof window === 'undefined') return baseDuration;
    
    // Reduce animation duration on slower devices
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType === 'slow-2g') {
      return baseDuration * 0.5;
    }
    
    return baseDuration;
  },

  // Force GPU acceleration on element
  enableGPUAcceleration: (element: HTMLElement) => {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  },

  // Disable GPU acceleration when not needed
  disableGPUAcceleration: (element: HTMLElement) => {
    element.style.willChange = 'auto';
  }
};
