import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
  reRenderCount: number;
  averageRenderTime: number;
}

interface InteractionMetrics {
  interactionType: string;
  duration: number;
  timestamp: number;
}

/**
 * Enhanced performance monitor with detailed analytics
 * 
 * Tracks render performance, memory usage, and user interactions
 * to provide actionable optimization insights.
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);
  const interactions = useRef<InteractionMetrics[]>([]);

  // Mark render start
  renderStartTime.current = performance.now();
  renderCount.current += 1;

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    // Store render time for averaging
    renderTimes.current.push(renderTime);
    if (renderTimes.current.length > 50) {
      renderTimes.current.shift(); // Keep only last 50 renders
    }

    const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;

    // Enhanced logging in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Performance - ${componentName}`);
      console.log(`Render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      console.log(`Average render time: ${averageRenderTime.toFixed(2)}ms`);
      
      // Performance warnings with suggestions
      if (renderTime > 16) {
        console.warn(`⚠️ Slow render detected (${renderTime.toFixed(2)}ms)`);
        console.log('💡 Consider: React.memo, useMemo, or useCallback');
      }
      
      if (renderCount.current > 20 && renderCount.current % 10 === 0) {
        console.log(`📊 Total renders: ${renderCount.current}`);
        console.log(`📈 Render frequency: ${(renderCount.current / (Date.now() / 1000)).toFixed(2)} renders/sec`);
      }
      
      // Memory usage tracking
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        console.log(`💾 Memory: ${(memInfo.usedJSHeapSize / 1048576).toFixed(2)}MB used`);
      }
      
      console.groupEnd();
    }

    // Report critical performance issues
    if (renderTime > 100) {
      console.error(`❌ Critical performance issue in ${componentName}: ${renderTime.toFixed(2)}ms render time`);
    }
  });

  // Enhanced interaction tracking
  const markInteraction = useCallback((interactionName: string, startTime?: number) => {
    const interactionTime = performance.now();
    const duration = startTime ? interactionTime - startTime : 0;
    
    const interaction: InteractionMetrics = {
      interactionType: interactionName,
      duration,
      timestamp: interactionTime
    };
    
    interactions.current.push(interaction);
    if (interactions.current.length > 100) {
      interactions.current.shift(); // Keep only last 100 interactions
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} - ${interactionName}: ${duration > 0 ? `${duration.toFixed(2)}ms` : 'triggered'}`);
    }
  }, [componentName]);

  // Performance metrics getter
  const getMetrics = useCallback((): PerformanceMetrics => ({
    renderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
    componentCount: renderCount.current,
    reRenderCount: renderCount.current,
    averageRenderTime: renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length,
    memoryUsage: 'memory' in performance ? (performance as any).memory.usedJSHeapSize : undefined
  }), []);

  return {
    renderCount: renderCount.current,
    markInteraction,
    getMetrics,
    interactions: interactions.current
  };
};

export const measureComponentPerformance = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
) => {
  const MeasuredComponent = (props: T) => {
    const { markInteraction } = usePerformanceMonitor(componentName);
    
    return React.createElement(Component, props);
  };

  MeasuredComponent.displayName = `Measured(${componentName})`;
  return MeasuredComponent;
};

// Performance utilities
export const performanceUtils = {
  // Check if React DevTools Profiler is available
  isProfilerAvailable: () => {
    return typeof window !== 'undefined' && 
           (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
           (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled !== true;
  },

  // Memory usage tracking (when available)
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1048576),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  },

  // Bundle size estimation
  estimateBundleImpact: (componentName: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 ${componentName} estimated load impact: ${loadTime.toFixed(2)}ms`);
      }
    };
  }
};
