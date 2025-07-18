import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkModal } from '@/components/LinkModal';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { LinkData, FormData, ViewMode, SortBy } from '@/types';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrivateLinks, setShowPrivateLinks] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Array<LinkData & { deletedAt: number }>>([]);
  const [linkSize, setLinkSize] = useState(80);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'custom',
    isPrivate: false
  });

  const [linksData, setLinksData] = useState<LinkData[]>([
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
  ]);

  const categoryLabels = {
    daily: 'My Daily Links',
    tools: 'Tools',
    entertainment: 'Entertainment', 
    society: 'Society',
    knowledge: 'Knowledge',
    ai: 'AI Tools',
    shopping: 'Shopping',
    social: 'Social',
    news: 'News',
    streaming: 'Media',
    finance: 'Money',
    gaming: 'Gaming',
    travel: 'Travel',
    food: 'Food',
    education: 'Learn',
    services: 'Services',
    health: 'Health',
    sports: 'Sports',
    music: 'Audio',
    photography: 'Photo',
    design: 'Design',
    productivity: 'Work',
    communication: 'Chat',
    business: 'Business',
    technology: 'Dev',
    science: 'Science',
    art: 'Arts',
    books: 'Read',
    cooking: 'Cook',
    diy: 'DIY',
    pets: 'Pets',
    automotive: 'Cars',
    real_estate: 'Property',
    fashion: 'Style',
    weather: 'Weather',
    maps: 'Maps',
    government: 'Gov',
    legal: 'Legal',
    insurance: 'Insurance',
    banking: 'Banking',
    investing: 'Invest',
    cryptocurrency: 'Crypto',
    freelance: 'Jobs',
    learning: 'Courses',
    languages: 'Languages',
    meditation: 'Wellness',
    dating: 'Dating',
    parenting: 'Family',
    seniors: 'Seniors',
    kids: 'Kids',
    local: 'Local',
    utilities: 'Bills',
    security: 'Security',
    custom: 'Custom'
  };

  const categoryColors = {
    daily: 'from-blue-500 to-cyan-500',
    tools: 'from-gray-600 to-gray-800',
    entertainment: 'from-purple-500 to-pink-500',
    society: 'from-green-500 to-emerald-500',
    knowledge: 'from-orange-500 to-red-500',
    ai: 'from-purple-500 to-pink-500',
    shopping: 'from-yellow-500 to-orange-500',
    social: 'from-blue-500 to-cyan-500',
    news: 'from-red-500 to-rose-500',
    streaming: 'from-green-500 to-emerald-500',
    finance: 'from-emerald-600 to-teal-600',
    gaming: 'from-violet-500 to-purple-600',
    travel: 'from-sky-500 to-blue-600',
    food: 'from-orange-500 to-red-500',
    education: 'from-indigo-500 to-blue-600',
    services: 'from-teal-500 to-cyan-600',
    health: 'from-green-400 to-emerald-500',
    sports: 'from-orange-600 to-red-600',
    music: 'from-pink-500 to-rose-500',
    photography: 'from-purple-400 to-violet-500',
    design: 'from-fuchsia-500 to-pink-600',
    productivity: 'from-blue-600 to-indigo-600',
    communication: 'from-cyan-500 to-blue-500',
    business: 'from-slate-700 to-gray-800',
    technology: 'from-blue-500 to-purple-600',
    science: 'from-teal-600 to-green-600',
    art: 'from-rose-500 to-pink-600',
    books: 'from-amber-600 to-yellow-600',
    cooking: 'from-red-500 to-orange-500',
    diy: 'from-yellow-600 to-amber-600',
    pets: 'from-green-500 to-teal-500',
    automotive: 'from-gray-700 to-slate-800',
    real_estate: 'from-emerald-700 to-green-700',
    fashion: 'from-pink-600 to-rose-600',
    weather: 'from-sky-400 to-blue-500',
    maps: 'from-green-600 to-emerald-600',
    government: 'from-blue-700 to-indigo-700',
    legal: 'from-slate-600 to-gray-700',
    insurance: 'from-blue-600 to-cyan-600',
    banking: 'from-green-700 to-emerald-700',
    investing: 'from-emerald-600 to-green-600',
    cryptocurrency: 'from-yellow-500 to-amber-500',
    freelance: 'from-purple-600 to-violet-600',
    learning: 'from-indigo-600 to-purple-600',
    languages: 'from-rose-600 to-pink-600',
    meditation: 'from-green-400 to-teal-400',
    dating: 'from-pink-500 to-rose-500',
    parenting: 'from-blue-400 to-cyan-400',
    seniors: 'from-gray-500 to-slate-600',
    kids: 'from-yellow-400 to-orange-400',
    local: 'from-teal-600 to-cyan-600',
    utilities: 'from-gray-600 to-slate-700',
    security: 'from-red-600 to-rose-600',
    custom: 'from-slate-600 to-gray-700'
  };

  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    setTimeout(() => {
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
        setCategoryOrder(Array.from(new Set(linksData.map(link => link.category))));
      }
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setIsDarkMode(settings.isDarkMode ?? true);
          setViewMode(settings.viewMode ?? 'compact');
          setSortBy(settings.sortBy ?? 'name');
          setShowPrivateLinks(settings.showPrivateLinks ?? true);
          setIsCompactHeader(settings.isCompactHeader ?? false);
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  useEffect(() => {
    const settings = { isDarkMode, viewMode, sortBy, showPrivateLinks, isCompactHeader };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, viewMode, sortBy, showPrivateLinks, isCompactHeader]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
            break;
          case 'n':
            e.preventDefault();
            openModal();
            break;
          case 'g':
            e.preventDefault();
            const modes: ViewMode[] = ['compact', 'grid', 'list', 'dense'];
            const currentIndex = modes.indexOf(viewMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            setViewMode(nextMode);
            toast.success(`Switched to ${nextMode} view`);
            break;
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
            toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
            break;
          case 'h':
            e.preventDefault();
            setIsCompactHeader(!isCompactHeader);
            toast.success(`Header ${isCompactHeader ? 'expanded' : 'compact'}`);
            break;
        }
      }
      
      if (e.altKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault();
            handleQuickAction('recent');
            break;
          case 'p':
            e.preventDefault();
            handleQuickAction('popular');
            break;
        }
      }
      
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        } else if (showShortcuts) {
          setShowShortcuts(false);
        } else if (searchTerm) {
          setSearchTerm('');
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isDarkMode, isModalOpen, searchTerm, isCompactHeader, showShortcuts]);

  useEffect(() => {
    if (sortBy === 'custom') return; // Don't sort if we are in custom mode

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
  }, [sortBy]);

  const handleQuickAction = (action: string) => {
    setQuickFilter(action);
    switch (action) {
      case 'recent':
        setSortBy('recent');
        toast.success('Showing recent links');
        break;
      case 'popular':
        setSortBy('clicks');
        toast.success('Showing popular links');
        break;
      default:
        setSortBy('name');
        setQuickFilter('all');
    }
  };

  const handleLinkClick = (link: LinkData) => {
    setClickedLink(link.key);
    
    setLinksData(prev => prev.map(l => 
      l.key === link.key ? { 
        ...l, 
        clicks: (l.clicks || 0) + 1,
        lastClicked: new Date().toISOString()
      } : l
    ));

    setTimeout(() => setClickedLink(null), 200);
    
    const url = link.url || link.defaultUrl;
    if (url) {
      window.open(url, '_blank');
    }
    
    toast.success(`Opening ${link.name}...`, {
      duration: 2000,
      action: {
        label: 'Undo',
        onClick: () => toast.info('Link opening cancelled')
      }
    });
  };

  const filteredLinks = linksData.filter(link => {
    if (!showPrivateLinks && link.isPrivate) return false;
    if (selectedCategory !== 'all' && link.category !== selectedCategory) return false;
    
    if (quickFilter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(link.createdAt || '') < weekAgo) return false;
    }
    if (quickFilter === 'popular' && (link.clicks || 0) < 20) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      link.name.toLowerCase().includes(searchLower) ||
      (link.url || link.defaultUrl || '').toLowerCase().includes(searchLower) ||
      link.category.toLowerCase().includes(searchLower)
    );
  });

  const groupedLinks = categoryOrder.reduce((acc, category) => {
    const linksForCategory = filteredLinks.filter(link => link.category === category);
    if (linksForCategory.length > 0) {
      acc[category] = linksForCategory;
    }
    return acc;
  }, {} as Record<string, LinkData[]>);

  const openModal = (link?: LinkData, presetCategory?: string) => {
    if (link) {
      setEditingLink(link);
      setIsNewLink(false);
      setFormData({
        name: link.name,
        url: link.url || link.defaultUrl || '',
        category: link.category,
        isPrivate: link.isPrivate || false
      });
    } else {
      setEditingLink(null);
      setIsNewLink(true);
      setFormData({
        name: '',
        url: '',
        category: presetCategory || 'custom',
        isPrivate: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setIsNewLink(false);
    setFormData({ name: '', url: '', category: 'custom', isPrivate: false });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in both name and URL');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (isNewLink) {
      const newLink: LinkData = {
        key: `custom_${Date.now()}`,
        name: formData.name.trim(),
        url: url,
        category: formData.category,
        isPrivate: formData.isPrivate,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      setLinksData(prev => [...prev, newLink]);
      if (!categoryOrder.includes(formData.category)) {
        setCategoryOrder(prev => [...prev, formData.category]);
      }
      toast.success(`${formData.name} added successfully!`, {
        description: 'Your new link is ready to use',
        action: {
          label: 'View',
          onClick: () => window.open(url, '_blank')
        }
      });
    } else if (editingLink) {
      setLinksData(prev => prev.map(link => 
        link.key === editingLink.key
          ? { ...link, name: formData.name.trim(), url: url, category: formData.category, isPrivate: formData.isPrivate }
          : link
      ));
      if (!categoryOrder.includes(formData.category)) {
        setCategoryOrder(prev => [...prev, formData.category]);
      }
      toast.success(`${formData.name} updated successfully!`);
    }

    setIsLoading(false);
    closeModal();
  };

  const handleDeleteLink = (linkKey: string) => {
    const linkToDelete = linksData.find((link) => link.key === linkKey);
    if (linkToDelete) {
      const newRecentlyDeleted = [
        ...recentlyDeleted,
        { ...linkToDelete, deletedAt: Date.now() },
      ];
      setRecentlyDeleted(newRecentlyDeleted);
      setLinksData((prev) => prev.filter((link) => link.key !== linkKey));

      toast.success(`${linkToDelete.name} deleted`, {
        action: {
          label: "Undo",
          onClick: () => handleRestoreLink(linkKey),
        },
      });
    }
  };

  const handleRestoreLink = (linkKey: string) => {
    const linkToRestore = recentlyDeleted.find((link) => link.key === linkKey);
    if (linkToRestore) {
      const { deletedAt, ...originalLink } = linkToRestore;
      setLinksData((prev) => [...prev, originalLink]);
      setRecentlyDeleted((prev) => prev.filter((link) => link.key !== linkKey));
      toast.success(`${linkToRestore.name} restored`);
    }
  };

  const handleToggleFavorite = (linkKey: string) => {
    setLinksData((prev) => 
      prev.map((link) => 
        link.key === linkKey 
          ? { ...link, isFavorite: !link.isFavorite }
          : link
      )
    );
    const link = linksData.find(l => l.key === linkKey);
    if (link) {
      toast.success(`${link.name} ${link.isFavorite ? 'removed from' : 'added to'} favorites`);
    }
  };

  const handleDragStart = (key: string) => {
    setDraggedItem(key);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();

    const dragData = e.dataTransfer.getData('application/json');
    if (dragData) {
      const parsed = JSON.parse(dragData);
      if (parsed.type === 'link' && parsed.key) {
        setSortBy('custom');
        setLinksData(prev => prev.map(link =>
          link.key === parsed.key ? { ...link, category: targetCategory } : link
        ));
        toast.success('Link moved to new category!');
      }
    }
  };
  
  const handleDropUrl = async (url: string, targetCategory: string) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const name = domain.charAt(0).toUpperCase() + domain.slice(1);

      const newLink: LinkData = {
        key: `dropped_${Date.now()}`,
        name: name,
        url: url,
        category: targetCategory,
        isPrivate: false,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      
      setSortBy('custom');
      setLinksData(prev => [...prev, newLink]);
      toast.success(`${name} added to ${categoryLabels[targetCategory as keyof typeof categoryLabels] || targetCategory}!`, {
        description: 'Link created from dropped URL',
        action: {
          label: 'View',
          onClick: () => window.open(url, '_blank')
        }
      });
    } catch (error) {
      toast.error('Invalid URL dropped');
    }
  };

  const handleReorderLinks = (draggedKey: string, targetKey: string) => {
    setSortBy('custom');
    setLinksData(prev => {
        const newLinks = [...prev];
        const draggedIndex = newLinks.findIndex(l => l.key === draggedKey);
        const targetIndex = newLinks.findIndex(l => l.key === targetKey);

        if (draggedIndex > -1 && targetIndex > -1) {
            const [draggedItem] = newLinks.splice(draggedIndex, 1);
            newLinks.splice(targetIndex, 0, draggedItem);
        }
        return newLinks;
    });
    toast.success('Link reordered!');
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ linksData, categoryOrder }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'link-router-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (Array.isArray(imported)) { // Legacy format
            setLinksData(imported);
            setCategoryOrder(Array.from(new Set(imported.map((link: LinkData) => link.category))));
          } else { // New format
            setLinksData(imported.linksData);
            setCategoryOrder(imported.categoryOrder);
          }
          toast.success('Data imported successfully!');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyLinkUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`${name} link copied to clipboard!`);
  };

  const categories = Array.from(new Set(linksData.map(link => link.category)));
  const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const recentLinks = linksData.filter(link => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(link.createdAt || '') > weekAgo;
  });
  const popularLinks = linksData.filter(link => (link.clicks || 0) > 20);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 bg-background`}>
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className={`text-lg text-foreground`}>
            Loading your links...
          </p>
        </div>
      </div>
    );
  }

  const getCompatibleViewMode = (mode: ViewMode): "grid" | "list" | "compact" => {
    if (mode === 'dense') return 'compact';
    return mode as "grid" | "list" | "compact";
  };

  return (
    <div className={`min-h-screen transition-all duration-500 bg-background`}>
      <AppHeader
        viewMode={getCompatibleViewMode(viewMode)}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        showPrivateLinks={showPrivateLinks}
        onTogglePrivateLinks={() => setShowPrivateLinks(!showPrivateLinks)}
        onExportData={exportData}
        onImportData={() => fileInputRef.current?.click()}
        onAddLink={() => openModal()}
        onShowShortcuts={() => setShowShortcuts(true)}
        fileInputRef={fileInputRef}
        linkSize={linkSize}
        onLinkSizeChange={setLinkSize}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-12">
          {Object.entries(groupedLinks).map(([category, links], index) => (
            <div
              key={category}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategorySection
                category={category}
                links={links}
                categoryLabels={categoryLabels}
                categoryColors={categoryColors}
                viewMode={viewMode}
                isDarkMode={isDarkMode}
                draggedItem={draggedItem}
                hoveredLink={hoveredLink}
                clickedLink={clickedLink}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onLinkClick={handleLinkClick}
                onEditLink={openModal}
                onCopyUrl={copyLinkUrl}
                onMouseEnter={setHoveredLink}
                onMouseLeave={() => setHoveredLink(null)}
                onDragStart={handleDragStart}
                onAddLink={(category) => openModal(undefined, category)}
                onDropUrl={handleDropUrl}
                onReorderLinks={handleReorderLinks}
                onDeleteLink={handleDeleteLink}
                onToggleFavorite={handleToggleFavorite}
                linkSize={linkSize}
              />
            </div>
          ))}
        </div>
        
        {Object.keys(groupedLinks).length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce">🔗</div>
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 text-foreground`}>
              {searchTerm || quickFilter !== 'all' ? 'No links found' : 'Your link collection awaits'}
            </h3>
            <p className={`mb-8 text-lg transition-colors duration-300 text-muted-foreground`}>
              {searchTerm 
                ? `No links match "${searchTerm}". Try adjusting your search terms.`
                : quickFilter !== 'all'
                ? `No ${quickFilter} links found. Try a different filter.`
                : 'Add your first link to start building your personal link hub'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => openModal()} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-primary-foreground px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                {searchTerm || quickFilter !== 'all' ? 'Add New Link' : 'Add Your First Link'}
              </Button>
              {(searchTerm || quickFilter !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setQuickFilter('all');
                    setSortBy('name');
                  }}
                  className={`px-6 py-3 text-lg transition-all duration-300 hover:scale-105 border-foreground/20 text-foreground hover:bg-foreground/10`}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importData}
        className="hidden"
      />

      <LinkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isNewLink={isNewLink}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSave}
        onDelete={() => {
          if (editingLink) {
            handleDeleteLink(editingLink.key);
            closeModal();
          }
        }}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        categoryLabels={categoryLabels}
      />

      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Index;