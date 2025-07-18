import { useState, useEffect } from 'react';
import { ViewMode, SortBy } from '@/types';

interface Settings {
  isDarkMode: boolean;
  viewMode: ViewMode;
  sortBy: SortBy;
  showPrivateLinks: boolean;
  isCompactHeader: boolean;
  linkSize: number;
}

const defaultSettings: Settings = {
  isDarkMode: true,
  viewMode: 'compact',
  sortBy: 'name',
  showPrivateLinks: true,
  isCompactHeader: false,
  linkSize: 80,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('linkRouterSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    // Apply dark mode class
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    ...settings,
    updateSetting,
  };
}