import { useState, useEffect } from 'react';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  title: string;
  clicks?: number;
  createdAt?: string;
  lastClicked?: string;
}

const useLinks = () => {
  const [data, setData] = useState<LinkData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadLinks = async () => {
      try {
        // For now, return empty array as placeholder
        // In a real app, this would fetch from an API
        setData([]);
      } catch (error) {
        console.error('Error loading links:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLinks();
  }, []);

  return { data, isLoading };
};

export default useLinks;