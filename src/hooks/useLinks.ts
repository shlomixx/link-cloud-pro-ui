import { useState, useEffect } from 'react';
import { LinkData, ViewMode, SortBy } from '@/types';
import { toast } from 'sonner';

const initialLinks: LinkData[] = [
  // My Daily Links
  { key: 'google', name: 'Google', defaultUrl: 'https://google.com', category: 'daily', clicks: 120, createdAt: '2024-01-01' },
  { key: 'youtube', name: 'YouTube', defaultUrl: 'https://youtube.com', category: 'daily', clicks: 95, createdAt: '2024-01-02' },
  { key: 'facebook', name: 'Facebook', defaultUrl: 'https://facebook.com', category: 'daily', clicks: 78, createdAt: '2024-01-03' },
  { key: 'instagram', name: 'Instagram', defaultUrl: 'https://instagram.com', category: 'daily', clicks: 85, createdAt: '2024-01-04' },
  { key: 'whatsapp', name: 'WhatsApp', defaultUrl: 'https://whatsapp.com', category: 'daily', clicks: 65, createdAt: '2024-01-05' },
  { key: 'reddit', name: 'Reddit', defaultUrl: 'https://reddit.com', category: 'daily', clicks: 55, createdAt: '2024-01-06' },
  { key: 'tiktok', name: 'TikTok', defaultUrl: 'https://tiktok.com', category: 'daily', clicks: 70, createdAt: '2024-01-07' },
  { key: 'gmail', name: 'Gmail', defaultUrl: 'https://gmail.com', category: 'daily', clicks: 110, createdAt: '2024-01-08' },
  { key: 'maps', name: 'Google Maps', defaultUrl: 'https://google.com/maps', category: 'daily', clicks: 45, createdAt: '2024-01-09' },
  { key: 'netflix', name: 'Netflix', defaultUrl: 'https://netflix.com', category: 'daily', clicks: 60, createdAt: '2024-01-10' },
  { key: 'spotify', name: 'Spotify', defaultUrl: 'https://spotify.com', category: 'daily', clicks: 75, createdAt: '2024-01-11' },
  { key: 'twitch', name: 'Twitch', defaultUrl: 'https://twitch.tv', category: 'daily', clicks: 40, createdAt: '2024-01-12' },
  { key: 'canva', name: 'Canva', defaultUrl: 'https://canva.com', category: 'daily', clicks: 35, createdAt: '2024-01-13' },
  { key: 'github', name: 'GitHub', defaultUrl: 'https://github.com', category: 'daily', clicks: 50, createdAt: '2024-01-14' },
  { key: 'trello', name: 'Trello', defaultUrl: 'https://trello.com', category: 'daily', clicks: 30, createdAt: '2024-01-15' },
  { key: 'notion', name: 'Notion', defaultUrl: 'https://notion.so', category: 'daily', clicks: 42, createdAt: '2024-01-16' },
  { key: 'dropbox', name: 'Dropbox', defaultUrl: 'https://dropbox.com', category: 'daily', clicks: 28, createdAt: '2024-01-17' },
  { key: 'coursera', name: 'Coursera', defaultUrl: 'https://coursera.org', category: 'daily', clicks: 25, createdAt: '2024-01-18' },
  { key: 'khanacademy', name: 'Khan Academy', defaultUrl: 'https://khanacademy.org', category: 'daily', clicks: 22, createdAt: '2024-01-19' },

  // Tools
  { key: 'canva_tools', name: 'Canva', defaultUrl: 'https://canva.com', category: 'tools', clicks: 45, createdAt: '2024-01-20' },
  { key: 'github_tools', name: 'GitHub', defaultUrl: 'https://github.com', category: 'tools', clicks: 65, createdAt: '2024-01-21' },
  { key: 'dropbox_tools', name: 'Dropbox', defaultUrl: 'https://dropbox.com', category: 'tools', clicks: 38, createdAt: '2024-01-22' },
  { key: 'trello_tools', name: 'Trello', defaultUrl: 'https://trello.com', category: 'tools', clicks: 42, createdAt: '2024-01-23' },
  { key: 'notion_tools', name: 'Notion', defaultUrl: 'https://notion.so', category: 'tools', clicks: 55, createdAt: '2024-01-24' },
  { key: 'wetransfer', name: 'WeTransfer', defaultUrl: 'https://wetransfer.com', category: 'tools', clicks: 25, createdAt: '2024-01-25' },
  { key: 'googledrive', name: 'Google Drive', defaultUrl: 'https://google.com/drive', category: 'tools', clicks: 60, createdAt: '2024-01-26' },
  { key: 'calendar', name: 'Google Calendar', defaultUrl: 'https://calendar.google.com', category: 'tools', clicks: 48, createdAt: '2024-01-27' },
  { key: 'paypal', name: 'PayPal', defaultUrl: 'https://paypal.com', category: 'tools', clicks: 32, createdAt: '2024-01-28' },

  // Entertainment
  { key: 'youtube_ent', name: 'YouTube', defaultUrl: 'https://youtube.com', category: 'entertainment', clicks: 95, createdAt: '2024-01-29' },
  { key: 'netflix_ent', name: 'Netflix', defaultUrl: 'https://netflix.com', category: 'entertainment', clicks: 78, createdAt: '2024-01-30' },
  { key: 'tiktok_ent', name: 'TikTok', defaultUrl: 'https://tiktok.com', category: 'entertainment', clicks: 68, createdAt: '2024-01-31' },
  { key: 'spotify_ent', name: 'Spotify', defaultUrl: 'https://spotify.com', category: 'entertainment', clicks: 72, createdAt: '2024-02-01' },
  { key: 'twitch_ent', name: 'Twitch', defaultUrl: 'https://twitch.tv', category: 'entertainment', clicks: 45, createdAt: '2024-02-02' },
  { key: 'steam', name: 'Steam', defaultUrl: 'https://steampowered.com', category: 'entertainment', clicks: 52, createdAt: '2024-02-03' },
  { key: 'roblox', name: 'Roblox', defaultUrl: 'https://roblox.com', category: 'entertainment', clicks: 38, createdAt: '2024-02-04' },
  { key: 'crunchyroll', name: 'Crunchyroll', defaultUrl: 'https://crunchyroll.com', category: 'entertainment', clicks: 35, createdAt: '2024-02-05' },
  { key: 'imdb', name: 'IMDb', defaultUrl: 'https://imdb.com', category: 'entertainment', clicks: 28, createdAt: '2024-02-06' },

  // Society
  { key: 'facebook_society', name: 'Facebook', defaultUrl: 'https://facebook.com', category: 'society', clicks: 75, createdAt: '2024-02-07' },
  { key: 'instagram_society', name: 'Instagram', defaultUrl: 'https://instagram.com', category: 'society', clicks: 82, createdAt: '2024-02-08' },
  { key: 'x', name: 'X (Twitter)', defaultUrl: 'https://x.com', category: 'society', clicks: 55, createdAt: '2024-02-09' },
  { key: 'whatsapp_society', name: 'WhatsApp', defaultUrl: 'https://whatsapp.com', category: 'society', clicks: 68, createdAt: '2024-02-10' },
  { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'society', clicks: 42, createdAt: '2024-02-11' },
  { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://linkedin.com', category: 'society', clicks: 48, createdAt: '2024-02-12' },
  { key: 'telegram', name: 'Telegram', defaultUrl: 'https://telegram.org', category: 'society', clicks: 35, createdAt: '2024-02-13' },
  { key: 'pinterest', name: 'Pinterest', defaultUrl: 'https://pinterest.com', category: 'society', clicks: 38, createdAt: '2024-02-14' },
  { key: 'reddit_society', name: 'Reddit', defaultUrl: 'https://reddit.com', category: 'society', clicks: 52, createdAt: '2024-02-15' },

  // Knowledge
  { key: 'wikipedia', name: 'Wikipedia', defaultUrl: 'https://wikipedia.org', category: 'knowledge', clicks: 65, createdAt: '2024-02-16' },
  { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chatgpt.com', category: 'knowledge', clicks: 88, createdAt: '2024-02-17' },
  { key: 'quora', name: 'Quora', defaultUrl: 'https://quora.com', category: 'knowledge', clicks: 42, createdAt: '2024-02-18' },
  { key: 'khanacademy_knowledge', name: 'Khan Academy', defaultUrl: 'https://khanacademy.org', category: 'knowledge', clicks: 35, createdAt: '2024-02-19' },
  { key: 'coursera_knowledge', name: 'Coursera', defaultUrl: 'https://coursera.org', category: 'knowledge', clicks: 38, createdAt: '2024-02-20' },
  { key: 'bbc', name: 'BBC News', defaultUrl: 'https://bbc.com/news', category: 'knowledge', clicks: 45, createdAt: '2024-02-21' },
  { key: 'stackexchange', name: 'Stack Exchange', defaultUrl: 'https://stackexchange.com', category: 'knowledge', clicks: 32, createdAt: '2024-02-22' },
  { key: 'natgeo', name: 'National Geographic', defaultUrl: 'https://nationalgeographic.com', category: 'knowledge', clicks: 28, createdAt: '2024-02-23' },
  { key: 'nytimes', name: 'NY Times', defaultUrl: 'https://nytimes.com', category: 'knowledge', clicks: 40, createdAt: '2024-02-24' },
];

export function useLinks() {
  const [linksData, setLinksData] = useState<LinkData[]>(initialLinks);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Array<LinkData & { deletedAt: number }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('linkRouterData');
    if (saved) {
      try {
        const loadedLinks = JSON.parse(saved);
        setLinksData(loadedLinks);
        setCategoryOrder(Array.from(new Set(loadedLinks.map((link: LinkData) => link.category))));
      } catch (error) {
        console.error('Error loading saved links:', error);
        toast.error('Failed to load saved links');
      }
    } else {
      setCategoryOrder(Array.from(new Set(initialLinks.map(link => link.category))));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  const addLink = (linkData: Omit<LinkData, 'key' | 'createdAt' | 'clicks'>) => {
    const newLink: LinkData = {
      ...linkData,
      key: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
    setLinksData(prev => [...prev, newLink]);
    
    if (!categoryOrder.includes(newLink.category)) {
      setCategoryOrder(prev => [...prev, newLink.category]);
    }
    
    toast.success('Link added successfully!');
  };

  const updateLink = (key: string, updates: Partial<LinkData>) => {
    setLinksData(prev =>
      prev.map(link => link.key === key ? { ...link, ...updates } : link)
    );
    toast.success('Link updated successfully!');
  };

  const deleteLink = (key: string) => {
    const linkToDelete = linksData.find(link => link.key === key);
    if (linkToDelete) {
      setLinksData(prev => prev.filter(link => link.key !== key));
      setRecentlyDeleted(prev => [
        ...prev,
        { ...linkToDelete, deletedAt: Date.now() }
      ]);
      toast.success('Link deleted successfully!');
    }
  };

  const incrementClicks = (key: string) => {
    setLinksData(prev =>
      prev.map(link =>
        link.key === key
          ? { ...link, clicks: (link.clicks || 0) + 1, lastClicked: new Date().toISOString() }
          : link
      )
    );
  };

  const toggleFavorite = (key: string) => {
    setLinksData(prev =>
      prev.map(link =>
        link.key === key
          ? { ...link, isFavorite: !link.isFavorite }
          : link
      )
    );
  };

  const sortLinks = (sortBy: SortBy) => {
    if (sortBy === 'custom') return;

    setLinksData(prevLinks => {
      const sorted = [...prevLinks];
      switch (sortBy) {
        case 'clicks':
          return sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
        case 'recent':
          return sorted.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        case 'name':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
          return prevLinks;
      }
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(linksData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'link-router-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully!');
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setLinksData(importedData);
          setCategoryOrder(Array.from(new Set(importedData.map((link: LinkData) => link.category))));
          toast.success('Data imported successfully!');
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  return {
    linksData,
    setLinksData,
    categoryOrder,
    setCategoryOrder,
    recentlyDeleted,
    addLink,
    updateLink,
    deleteLink,
    incrementClicks,
    toggleFavorite,
    sortLinks,
    exportData,
    importData,
  };
}