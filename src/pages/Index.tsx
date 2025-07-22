import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkData, FormData, ViewMode, SortBy } from '@/types';
import { useFaviconPreloader } from '@/hooks/useFaviconPreloader';
import { debounce } from '@/utils/performanceOptimizations';

// Lazy load heavy components
const LazyLinkModal = React.lazy(() => import('@/components/LazyLinkModal').then(module => ({ default: module.LazyLinkModal })));
const LazyKeyboardShortcuts = React.lazy(() => import('@/components/LazyKeyboardShortcuts').then(module => ({ default: module.LazyKeyboardShortcuts })));

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const viewMode: ViewMode = 'compact'; // Fixed to compact view
  
  const [sortBy, setSortBy] = useState<SortBy>('custom');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const showPrivateLinks = true; // Always show private links
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  
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
    { key: 'daily-chatgpt', name: 'ChatGPT', defaultUrl: 'https://chatgpt.com/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-gemini', name: 'Gemini', defaultUrl: 'https://gemini.google.com/app', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-claude', name: 'Claude', defaultUrl: 'https://claude.ai/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-perplexity', name: 'Perplexity', defaultUrl: 'https://www.perplexity.ai/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-gmail', name: 'Gmail', defaultUrl: 'https://gmail.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-yahoo', name: 'Yahoo', defaultUrl: 'https://yahoo.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-bing', name: 'Bing', defaultUrl: 'https://www.bing.com/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-wikipedia', name: 'Wikipedia', defaultUrl: 'https://wikipedia.org', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-paypal', name: 'PayPal', defaultUrl: 'https://paypal.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-aliexpress', name: 'AliExpress', defaultUrl: 'https://aliexpress.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-ebay', name: 'eBay', defaultUrl: 'https://ebay.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-walmart', name: 'Walmart', defaultUrl: 'https://walmart.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-etsy', name: 'Etsy', defaultUrl: 'https://etsy.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-grammarly', name: 'Grammarly', defaultUrl: 'https://grammarly.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-midjourney', name: 'Midjourney', defaultUrl: 'https://midjourney.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-leonardo', name: 'Leonardo', defaultUrl: 'https://leonardo.ai/', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-canva', name: 'Canva', defaultUrl: 'https://canva.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-netflix', name: 'Netflix', defaultUrl: 'https://netflix.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-office', name: 'Office', defaultUrl: 'https://office.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-spotify', name: 'Spotify', defaultUrl: 'spotify.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-ticketmaster', name: 'Ticketmaster', defaultUrl: 'https://ticketmaster.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-soundcloud', name: 'SoundCloud', defaultUrl: 'https://soundcloud.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-nytimes', name: 'NY Times', defaultUrl: 'https://nytimes.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-cnn', name: 'CNN', defaultUrl: 'https://cnn.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-imdb', name: 'IMDb', defaultUrl: 'https://imdb.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'daily-foxnews', name: 'Fox News', defaultUrl: 'https://foxnews.com', category: 'daily', clicks: 0, createdAt: new Date().toISOString() },

    // Social Media Platforms
    { key: 'social-facebook', name: 'Facebook', defaultUrl: 'https://facebook.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-youtube', name: 'YouTube', defaultUrl: 'https://youtube.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-whatsapp', name: 'Whatsapp', defaultUrl: 'https://whatsapp.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-instagram', name: 'Instagram', defaultUrl: 'https://instagram.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-snapchat', name: 'Snapchat', defaultUrl: 'https://snapchat.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-twitter', name: 'Twitter (X)', defaultUrl: 'https://twitter.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-linkedin', name: 'LinkedIn', defaultUrl: 'https://linkedin.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-pinterest', name: 'Pinterest', defaultUrl: 'https://pinterest.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-threads', name: 'Threads', defaultUrl: 'https://threads.net', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-telegram', name: 'Telegram', defaultUrl: 'https://telegram.org', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-myspace', name: 'MySpace', defaultUrl: 'https://myspace.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-reddit', name: 'Reddit', defaultUrl: 'https://reddit.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-tumblr', name: 'Tumblr', defaultUrl: 'https://tumblr.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-mastodon', name: 'Mastodon', defaultUrl: 'https://mastodon.social', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-nextdoor', name: 'Nextdoor', defaultUrl: 'https://nextdoor.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-twitch', name: 'Twitch', defaultUrl: 'https://twitch.tv', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-wechat', name: 'WeChat', defaultUrl: 'https://wechat.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-line', name: 'Line', defaultUrl: 'https://line.me', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-blogger', name: 'Blogger', defaultUrl: 'https://blogger.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-yelp', name: 'Yelp', defaultUrl: 'https://yelp.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-medium', name: 'Medium', defaultUrl: 'https://medium.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-dribble', name: 'Dribble', defaultUrl: 'https://dribbble.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-vine', name: 'Vine', defaultUrl: 'https://vine.co', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-tiktok', name: 'TikTok', defaultUrl: 'https://tiktok.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-tagged', name: 'Tagged', defaultUrl: 'https://tagged.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },
    { key: 'social-meetup', name: 'Meetup', defaultUrl: 'https://meetup.com', category: 'society', clicks: 0, createdAt: new Date().toISOString() },

    // Tools - 27 links
    { key: 'tools-canva', name: 'Canva', defaultUrl: 'https://canva.com', category: 'tools', clicks: 50, createdAt: '2024-01-20' },
    { key: 'tools-trello', name: 'Trello', defaultUrl: 'https://trello.com', category: 'tools', clicks: 45, createdAt: '2024-01-23' },
    { key: 'tools-figma', name: 'Figma', defaultUrl: 'https://figma.com', category: 'tools', clicks: 58, createdAt: '2024-03-01' },
    { key: 'tools-slack', name: 'Slack', defaultUrl: 'https://slack.com', category: 'tools', clicks: 62, createdAt: '2024-03-02' },
    { key: 'tools-zoom', name: 'Zoom', defaultUrl: 'https://zoom.us', category: 'tools', clicks: 48, createdAt: '2024-03-03' },
    { key: 'tools-miro', name: 'Miro', defaultUrl: 'https://miro.com', category: 'tools', clicks: 40, createdAt: '2024-03-04' },
    { key: 'tools-vsc', name: 'VS Code', defaultUrl: 'https://code.visualstudio.com', category: 'tools', clicks: 68, createdAt: '2024-03-13' },
    { key: 'tools-docker', name: 'Docker', defaultUrl: 'https://docker.com', category: 'tools', clicks: 52, createdAt: '2024-03-14' },
    { key: 'tools-jira', name: 'Jira', defaultUrl: 'https://atlassian.com/software/jira', category: 'tools', clicks: 42, createdAt: '2024-04-01' },
    { key: 'tools-asana', name: 'Asana', defaultUrl: 'https://asana.com', category: 'tools', clicks: 38, createdAt: '2024-04-02' },
    { key: 'tools-monday', name: 'Monday.com', defaultUrl: 'https://monday.com', category: 'tools', clicks: 35, createdAt: '2024-04-03' },
    { key: 'tools-airtable', name: 'Airtable', defaultUrl: 'https://airtable.com', category: 'tools', clicks: 32, createdAt: '2024-04-04' },
    { key: 'tools-zapier', name: 'Zapier', defaultUrl: 'https://zapier.com', category: 'tools', clicks: 28, createdAt: '2024-04-05' },
    { key: 'tools-canva-2', name: 'Canva', defaultUrl: 'https://canva.com', category: 'tools', clicks: 50, createdAt: '2024-01-20' },
    { key: 'tools-trello-2', name: 'Trello', defaultUrl: 'https://trello.com', category: 'tools', clicks: 45, createdAt: '2024-01-23' },
    { key: 'tools-figma-2', name: 'Figma', defaultUrl: 'https://figma.com', category: 'tools', clicks: 58, createdAt: '2024-03-01' },
    { key: 'tools-slack-2', name: 'Slack', defaultUrl: 'https://slack.com', category: 'tools', clicks: 62, createdAt: '2024-03-02' },
    { key: 'tools-zoom-2', name: 'Zoom', defaultUrl: 'https://zoom.us', category: 'tools', clicks: 48, createdAt: '2024-03-03' },
    { key: 'tools-miro-2', name: 'Miro', defaultUrl: 'https://miro.com', category: 'tools', clicks: 40, createdAt: '2024-03-04' },
    { key: 'tools-vsc-2', name: 'VS Code', defaultUrl: 'https://code.visualstudio.com', category: 'tools', clicks: 68, createdAt: '2024-03-13' },
    { key: 'tools-docker-2', name: 'Docker', defaultUrl: 'https://docker.com', category: 'tools', clicks: 52, createdAt: '2024-03-14' },
    { key: 'tools-jira-2', name: 'Jira', defaultUrl: 'https://atlassian.com/software/jira', category: 'tools', clicks: 42, createdAt: '2024-04-01' },
    { key: 'tools-asana-2', name: 'Asana', defaultUrl: 'https://asana.com', category: 'tools', clicks: 38, createdAt: '2024-04-02' },
    { key: 'tools-monday-2', name: 'Monday.com', defaultUrl: 'https://monday.com', category: 'tools', clicks: 35, createdAt: '2024-04-03' },
    { key: 'tools-airtable-2', name: 'Airtable', defaultUrl: 'https://airtable.com', category: 'tools', clicks: 32, createdAt: '2024-04-04' },
    { key: 'tools-zapier-2', name: 'Zapier', defaultUrl: 'https://zapier.com', category: 'tools', clicks: 28, createdAt: '2024-04-05' },
    { key: 'tools-canva-3', name: 'Canva', defaultUrl: 'https://canva.com', category: 'tools', clicks: 50, createdAt: '2024-01-20' },
  ]);

  const categoryLabels = {
    daily: 'My Daily Links',
    society: 'Social Media Platforms',
    tools: 'Productivity Tools',
    custom: 'Custom Links'
  };

  const categoryColors = {
    daily: 'from-blue-500 to-cyan-500',
    society: 'from-green-500 to-emerald-500',
    tools: 'from-gray-600 to-gray-800',
    custom: 'from-slate-600 to-gray-700'
  };

  // Debounced search to improve performance
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Preload favicons for better performance
  useFaviconPreloader(linksData);

  // Simplified loading mechanism - load data immediately without loading state
  useEffect(() => {
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    const preferredOrder = ['daily', 'society', 'tools'];
    if (saved) {
      try {
        const loadedData = JSON.parse(saved);
        let loadedLinks = Array.isArray(loadedData) ? loadedData : loadedData.linksData;
        setLinksData(loadedLinks);
        const allCategories = Array.from(new Set(loadedLinks.map((link: LinkData) => link.category))) as string[];
        const remainingCategories = allCategories.filter((c: string) => !preferredOrder.includes(c));
        setCategoryOrder([...preferredOrder, ...remainingCategories]);
      } catch (error) {
        console.error('Error loading saved links:', error);
        toast.error('Failed to load saved links');
      }
    } else {
      const allCategories = Array.from(new Set(linksData.map(link => link.category)));
      const remainingCategories = allCategories.filter(c => !preferredOrder.includes(c));
      setCategoryOrder([...preferredOrder, ...remainingCategories]);
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        setSortBy(settings.sortBy ?? 'custom');
        setIsCompactHeader(settings.isCompactHeader ?? false);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  useEffect(() => {
    const settings = { sortBy, isCompactHeader };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.documentElement.classList.add('dark');
  }, [sortBy, isCompactHeader]);

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
          setDebouncedSearchTerm('');
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isModalOpen, searchTerm, isCompactHeader, showShortcuts]);

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
    
    const searchLower = debouncedSearchTerm.toLowerCase();
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
  
  return (
    <div className={`min-h-screen transition-all duration-500 bg-background`}>
        <AppHeader
          onAddLink={() => openModal()}
          onShowShortcuts={() => setShowShortcuts(true)}
          linkSize={linkSize}
          onLinkSizeChange={setLinkSize}
        />

      <main className="container mx-auto px-6 py-2">
        <div className="space-y-2">
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
              {debouncedSearchTerm || quickFilter !== 'all' ? 'No links found' : 'Your link collection awaits'}
            </h3>
            <p className={`mb-8 text-lg transition-colors duration-300 text-muted-foreground`}>
              {debouncedSearchTerm 
                ? `No links match "${debouncedSearchTerm}". Try adjusting your search terms.`
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
                {debouncedSearchTerm || quickFilter !== 'all' ? 'Add New Link' : 'Add Your First Link'}
              </Button>
              {(debouncedSearchTerm || quickFilter !== 'all') && (
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


      <React.Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div></div>}>
        <LazyLinkModal
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
          isLoading={false}
          categoryLabels={categoryLabels}
        />

        <LazyKeyboardShortcuts
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </React.Suspense>
    </div>
  );
};

export default Index;
