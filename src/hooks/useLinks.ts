import { useQuery } from '@tanstack/react-query';
import { LinkData } from '@/types';

// Mock data for development
const mockLinks: LinkData[] = [
  {
    key: '1',
    name: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    clicks: 42,
    createdAt: '2024-01-01',
    isFavorite: true,
    lastClicked: '2024-01-15'
  },
  {
    key: '2', 
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Development',
    clicks: 28,
    createdAt: '2024-01-02',
    isFavorite: false,
    lastClicked: '2024-01-14'
  },
  {
    key: '3',
    name: 'Google',
    url: 'https://google.com',
    category: 'Search',
    clicks: 156,
    createdAt: '2024-01-03',
    isFavorite: true,
    lastClicked: '2024-01-15'
  }
];

const fetchLinks = async (): Promise<LinkData[]> => {
  // Simulate API call
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