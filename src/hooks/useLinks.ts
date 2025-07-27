import { useQuery } from '@tanstack/react-query';
import { LinkData } from '@/types';

// Mock data for demonstration - in a real app this would come from an API
const mockLinks: LinkData[] = [
  {
    key: '1',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'development',
    clicks: 25,
    createdAt: '2024-01-01',
    isFavorite: true,
    lastClicked: '2024-01-15'
  },
  {
    key: '2',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'development',
    clicks: 18,
    createdAt: '2024-01-02',
    isFavorite: false,
    lastClicked: '2024-01-14'
  },
  {
    key: '3',
    name: 'YouTube',
    url: 'https://youtube.com',
    category: 'entertainment',
    clicks: 42,
    createdAt: '2024-01-03',
    isFavorite: true,
    lastClicked: '2024-01-16'
  },
  {
    key: '4',
    name: 'Netflix',
    url: 'https://netflix.com',
    category: 'entertainment',
    clicks: 12,
    createdAt: '2024-01-04',
    isFavorite: false,
    lastClicked: '2024-01-13'
  }
];

const fetchLinks = async (): Promise<LinkData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLinks;
};

const useLinks = () => {
  return useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useLinks;