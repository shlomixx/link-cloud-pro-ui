import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkCloud } from '@/components/LinkCloud';
import { LinkData, FormData, SortBy } from '@/types';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { useFaviconPreloader } from '@/hooks/useFaviconPreloader';
import { debounce } from '@/utils/performanceOptimizations';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import { parseDroppableId, ITEMS_PER_ROW } from '@/components/CategorySection/utils';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

// Lazy load heavy components
const LazyLinkModal = React.lazy(async () => {
  const module = await import('@/components/LazyLinkModal');
  return { default: module.LazyLinkModal };
});

const LazyKeyboardShortcuts = React.lazy(async () => {
  const module = await import('@/components/LazyKeyboardShortcuts');
  return { default: module.LazyKeyboardShortcuts };
});

const DEFAULT_LINKS: LinkData[] = [
  // 🤖 AI Tools
  { key: 'ai-chatgpt', name: 'ChatGPT', defaultUrl: 'https://chatgpt.com/', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-claude', name: 'Claude', defaultUrl: 'https://claude.ai/', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-gemini', name: 'Gemini', defaultUrl: 'https://gemini.google.com/app', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-perplexity', name: 'Perplexity', defaultUrl: 'https://www.perplexity.ai/', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-midjourney', name: 'Midjourney', defaultUrl: 'https://midjourney.com', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-leonardo', name: 'Leonardo', defaultUrl: 'https://leonardo.ai/', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'ai-grammarly', name: 'Grammarly', defaultUrl: 'https://grammarly.com', category: 'ai-tools', clicks: 0, createdAt: new Date().toISOString() },

  // 📧 Google Workspace
  { key: 'gw-gmail', name: 'Gmail', defaultUrl: 'https://gmail.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-drive', name: 'Google Drive', defaultUrl: 'https://drive.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-docs', name: 'Google Docs', defaultUrl: 'https://docs.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-sheets', name: 'Google Sheets', defaultUrl: 'https://sheets.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-slides', name: 'Google Slides', defaultUrl: 'https://slides.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-calendar', name: 'Google Calendar', defaultUrl: 'https://calendar.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-keep', name: 'Google Keep', defaultUrl: 'https://keep.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-chat', name: 'Google Chat', defaultUrl: 'https://chat.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-meet', name: 'Google Meet', defaultUrl: 'https://meet.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'gw-photos', name: 'Google Photos', defaultUrl: 'https://photos.google.com', category: 'google', clicks: 0, createdAt: new Date().toISOString() },

  // 🔍 Search & Browse
  { key: 'search-google', name: 'Google', defaultUrl: 'https://google.com', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-bing', name: 'Bing', defaultUrl: 'https://www.bing.com/', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-yahoo', name: 'Yahoo', defaultUrl: 'https://yahoo.com', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-wikipedia', name: 'Wikipedia', defaultUrl: 'https://wikipedia.org', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-maps', name: 'Google Maps', defaultUrl: 'https://maps.google.com', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-translate', name: 'Google Translate', defaultUrl: 'https://translate.google.com', category: 'search', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'search-gnews', name: 'Google News', defaultUrl: 'https://news.google.com', category: 'search', clicks: 0, createdAt: new Date().toISOString() },

  // 🎬 Media & Entertainment
  { key: 'media-netflix', name: 'Netflix', defaultUrl: 'https://netflix.com', category: 'media', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'media-spotify', name: 'Spotify', defaultUrl: 'https://spotify.com', category: 'media', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'media-ytmusic', name: 'YouTube Music', defaultUrl: 'https://music.youtube.com', category: 'media', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'media-soundcloud', name: 'SoundCloud', defaultUrl: 'https://soundcloud.com', category: 'media', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'media-imdb', name: 'IMDb', defaultUrl: 'https://imdb.com', category: 'media', clicks: 0, createdAt: new Date().toISOString() },

  // 📰 News
  { key: 'news-cnn', name: 'CNN', defaultUrl: 'https://cnn.com', category: 'news', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'news-fox', name: 'Fox News', defaultUrl: 'https://foxnews.com', category: 'news', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'news-nyt', name: 'NY Times', defaultUrl: 'https://nytimes.com', category: 'news', clicks: 0, createdAt: new Date().toISOString() },

  // 🛒 Shopping
  { key: 'shop-amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com/', category: 'shopping', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'shop-ebay', name: 'eBay', defaultUrl: 'https://ebay.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'shop-etsy', name: 'Etsy', defaultUrl: 'https://etsy.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'shop-aliexpress', name: 'AliExpress', defaultUrl: 'https://aliexpress.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'shop-walmart', name: 'Walmart', defaultUrl: 'https://walmart.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString() },

  // 🏠 Travel & Services
  { key: 'travel-airbnb', name: 'Airbnb', defaultUrl: 'https://airbnb.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-booking', name: 'Booking', defaultUrl: 'https://booking.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-uber', name: 'Uber', defaultUrl: 'https://uber.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-waze', name: 'Waze', defaultUrl: 'https://waze.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-weather', name: 'Weather', defaultUrl: 'https://weather.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-ticketmaster', name: 'Ticketmaster', defaultUrl: 'https://ticketmaster.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'travel-paypal', name: 'PayPal', defaultUrl: 'https://paypal.com', category: 'travel', clicks: 0, createdAt: new Date().toISOString() },

  // ☁️ Apps & Cloud
  { key: 'apps-icloud', name: 'iCloud', defaultUrl: 'https://www.icloud.com', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'apps-dropbox', name: 'Dropbox', defaultUrl: 'https://dropbox.com', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'apps-gplay', name: 'Google Play', defaultUrl: 'https://play.google.com', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'apps-appstore', name: 'App Store', defaultUrl: 'https://www.apple.com/app-store/', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'apps-canva', name: 'Canva', defaultUrl: 'https://canva.com', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
  { key: 'apps-office', name: 'Office', defaultUrl: 'https://office.com', category: 'apps', clicks: 0, createdAt: new Date().toISOString() },
];

const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
  'ai-tools': '\u{1F916} AI Tools',
  google: '\u{1F4E7} Google Workspace',
  search: '\u{1F50D} Search & Browse',
  media: '\u{1F3AC} Media & Entertainment',
  news: '\u{1F4F0} News',
  shopping: '\u{1F6D2} Shopping',
  travel: '\u{1F3E0} Travel & Services',
  apps: '\u{2601}\u{FE0F} Apps & Cloud',
  custom: '\u{1F517} Custom Links',
};

const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  'ai-tools': 'from-violet-400 to-violet-600',
  google: 'from-blue-400 to-blue-600',
  search: 'from-cyan-400 to-cyan-600',
  media: 'from-rose-400 to-rose-600',
  news: 'from-sky-400 to-sky-600',
  shopping: 'from-amber-400 to-amber-600',
  travel: 'from-teal-400 to-teal-600',
  apps: 'from-indigo-400 to-indigo-600',
  custom: 'from-gray-400 to-gray-600',
};

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [cloudCategory, setCloudCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('custom');
  // NOTE: selectedCategory removed — cloudCategory is the single source of truth
  // for which tab is active AND which blocks are shown.
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Array<LinkData & { deletedAt: number }>>([]);
  const [linkSize, setLinkSize] = useState(80);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'custom'
  });

  const [linksData, setLinksData] = useState<LinkData[]>(DEFAULT_LINKS);

  const [categoryLabels, setCategoryLabels] = useState(DEFAULT_CATEGORY_LABELS);

  const [categoryColors, setCategoryColors] = useState(DEFAULT_CATEGORY_COLORS);

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
    const savedCategories = localStorage.getItem('linkRouterCategories');
    
    const preferredOrder = ['ai-tools', 'google', 'search', 'media', 'news', 'shopping', 'travel', 'apps'];
    const seedVersionKey = 'linkRouterSeedVersion';
    const seedVersion = '2026-03-04-01';
    
    // Load categories first, merging with defaults so new categories persist
    if (savedCategories) {
      try {
        const categoriesData = JSON.parse(savedCategories);
        if (categoriesData.labels) {
          setCategoryLabels({
            ...DEFAULT_CATEGORY_LABELS,
            ...categoriesData.labels,
          });
        }
        if (categoriesData.colors) {
          setCategoryColors({
            ...DEFAULT_CATEGORY_COLORS,
            ...categoriesData.colors,
          });
        }
      } catch (error) {
        console.error('Error loading saved categories:', error);
      }
    }
    
  if (saved) {
      try {
        const loadedData = JSON.parse(saved);
        let loadedLinks = Array.isArray(loadedData) ? loadedData : loadedData.linksData;

        // One-time seed: merge new default links into existing saved data.
        try {
          const currentSeed = localStorage.getItem(seedVersionKey);
          if (currentSeed !== seedVersion) {
            const existingKeys = new Set(
              (loadedLinks as LinkData[]).map((l) => l?.key).filter(Boolean)
            );
            const extras = DEFAULT_LINKS.filter((l) => !existingKeys.has(l.key));
            if (extras.length > 0) {
              loadedLinks = [...loadedLinks, ...extras];
            }
            localStorage.setItem(seedVersionKey, seedVersion);
          }
        } catch (seedErr) {
          console.warn('Seed merge skipped:', seedErr);
        }

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
    // Try to restore user-defined category order if present
    const savedOrder = localStorage.getItem('categoryOrder');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed)) {
          setCategoryOrder(parsed);
        }
      } catch (err) {
        console.warn('Invalid categoryOrder in localStorage');
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        // Clean up old settings that no longer exist
        if (settings.viewMode || settings.showPrivateLinks !== undefined) {
          // Clear old settings format
          localStorage.removeItem('linkRouterSettings');
        } else {
          setSortBy(settings.sortBy ?? 'custom');
          setIsCompactHeader(settings.isCompactHeader ?? false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Clear corrupted settings
        localStorage.removeItem('linkRouterSettings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  // Save categories when they change
  useEffect(() => {
    const categoriesData = {
      labels: categoryLabels,
      colors: categoryColors
    };
    localStorage.setItem('linkRouterCategories', JSON.stringify(categoriesData));
  }, [categoryLabels, categoryColors]);

  useEffect(() => {
    const settings = { sortBy, isCompactHeader };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
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
  }, [isModalOpen, searchTerm, isCompactHeader, showShortcuts]);

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
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    toast.success(`Opening ${link.name}...`, {
      duration: 2000,
      action: {
        label: 'Undo',
        onClick: () => toast.info('Link opening cancelled')
      }
    });
  };

  const fuse = useMemo(() => {
    return new Fuse(linksData, {
      keys: ['name', 'url', 'defaultUrl', 'category'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [linksData]);

  const filteredLinks = useMemo(() => {
    // First, apply non-text filters (category, quickFilter)
    const base = linksData.filter((link) => {
      if (cloudCategory !== null && link.category !== cloudCategory) return false;

      if (quickFilter === 'recent') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(link.createdAt || '') < weekAgo) return false;
      }
      if (quickFilter === 'popular' && (link.clicks || 0) < 20) return false;

      return true;
    });

    const term = debouncedSearchTerm.trim();
    if (!term) return base;

    // Use Fuse for fuzzy search on the base set
    const results = fuse.search(term);
    const baseKeys = new Set(base.map((l) => l.key));
    return results
      .map((r) => r.item)
      .filter((item) => baseKeys.has(item.key));
  }, [linksData, cloudCategory, quickFilter, debouncedSearchTerm, fuse]);

  const groupedLinks = categoryOrder.reduce((acc, category) => {
    const linksForCategory = filteredLinks.filter(link => link.category === category);
    // Only include categories that have at least one link
    if (categoryLabels[category as keyof typeof categoryLabels] && linksForCategory.length > 0) {
      acc[category] = linksForCategory;
    }
    return acc;
  }, {} as Record<string, LinkData[]>);

  // Also include any new categories that might not be in categoryOrder yet (only if they have links)
  Object.keys(categoryLabels).forEach(category => {
    if (!groupedLinks[category]) {
      const linksForCategory = filteredLinks.filter(link => link.category === category);
      if (linksForCategory.length > 0) {
        groupedLinks[category] = linksForCategory;
      }
    }
  });

  const openModal = (link?: LinkData, presetCategory?: string) => {
    if (link) {
      setEditingLink(link);
      setIsNewLink(false);
      setFormData({
        name: link.name,
        url: link.url || link.defaultUrl || '',
        category: link.category
      });
    } else {
      setEditingLink(null);
      setIsNewLink(true);
      setFormData({
        name: '',
        url: '',
        category: presetCategory || 'custom'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setIsNewLink(false);
    setFormData({ name: '', url: '', category: 'custom' });
  };

  const openAddCategoryModal = (category: string | null) => {
    setAddingToCategory(category);
    setIsAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setAddingToCategory(null);
    setIsAddCategoryModalOpen(false);
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
          onClick: () => window.open(url, '_blank', 'noopener,noreferrer')
        }
      });
    } else if (editingLink) {
      setLinksData(prev => prev.map(link => 
        link.key === editingLink.key
          ? { ...link, name: formData.name.trim(), url: url, category: formData.category }
          : link
      ));
      if (!categoryOrder.includes(formData.category)) {
        setCategoryOrder(prev => [...prev, formData.category]);
      }
      toast.success(`${formData.name} updated successfully!`);
    }

    closeModal();
  };

  const handleAddCategory = (categoryName: string) => {
    // Create a unique category key from the name
    const categoryKey = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if category already exists
    if (categoryLabels[categoryKey as keyof typeof categoryLabels]) {
      toast.error('Category already exists!');
      return;
    }

    // Add new category to labels
    setCategoryLabels(prev => ({
      ...prev,
      [categoryKey]: categoryName
    }));

    // Add new category to colors (using a default color)
    setCategoryColors(prev => ({
      ...prev,
      [categoryKey]: 'from-purple-500 to-pink-500'
    }));

    // Add category to order at the end if not already there
    setCategoryOrder(prev => {
      if (!prev.includes(categoryKey)) {
        return [...prev, categoryKey];
      }
      return prev;
    });

    toast.success(`Category "${categoryName}" added successfully!`);
  };

  const handleEditCategoryName = (oldCategory: string, newCategoryName: string) => {
    // Check if the category exists
    if (!categoryLabels[oldCategory]) {
      toast.error('Category not found!');
      return;
    }

    // Update category label
    setCategoryLabels(prev => ({
      ...prev,
      [oldCategory]: newCategoryName
    }));

    toast.success(`Category renamed to "${newCategoryName}" successfully!`);

  };

  const handleDeleteCategory = (category: string) => {
    const label = categoryLabels[category as keyof typeof categoryLabels] || category;
    
    // Remove all links in this category
    setLinksData(prev => prev.filter(link => link.category !== category));

    // Remove category label and color
    setCategoryLabels(prev => {
      const { [category]: _removed, ...rest } = prev;
      return rest;
    });

    setCategoryColors(prev => {
      const { [category]: _removed, ...rest } = prev;
      return rest;
    });

    // Remove from order
    setCategoryOrder(prev => prev.filter(c => c !== category));

    toast.success(`Category "${label}" and all its links were deleted`);
  };

  const handleAddPredefinedCategory = (template: 'adults' | 'news') => {
    if (template === 'adults') {
      const categoryKey = 'adults';

      if (categoryLabels[categoryKey as keyof typeof categoryLabels]) {
        toast.error('Adults category already exists!');
        return;
      }

      const now = new Date().toISOString();

      const adultLinks: LinkData[] = [
        { key: 'adults-pornhub', name: 'PornHub', defaultUrl: 'https://www.pornhub.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'adults-xvideos', name: 'XVideos', defaultUrl: 'https://www.xvideos.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'adults-xhamster', name: 'xHamster', defaultUrl: 'https://xhamster.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'adults-xnxx', name: 'XNXX', defaultUrl: 'https://www.xnxx.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'adults-redtube', name: 'RedTube', defaultUrl: 'https://www.redtube.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'adults-youporn', name: 'YouPorn', defaultUrl: 'https://www.youporn.com', category: categoryKey, clicks: 0, createdAt: now },
      ];

      setCategoryLabels(prev => ({
        ...prev,
        [categoryKey]: 'Adults',
      }));

      setCategoryColors(prev => ({
        ...prev,
        [categoryKey]: 'from-rose-500 to-red-700',
      }));

      setCategoryOrder(prev => (prev.includes(categoryKey) ? prev : [...prev, categoryKey]));
      setLinksData(prev => [...prev, ...adultLinks]);

      toast.success('Adults category added with predefined links');
      return;
    }

    if (template === 'news') {
      const categoryKey = 'news';

      if (categoryLabels[categoryKey as keyof typeof categoryLabels]) {
        toast.error('News category already exists!');
        return;
      }

      const now = new Date().toISOString();

      const newsLinks: LinkData[] = [
        { key: 'news-bbc', name: 'BBC News', defaultUrl: 'https://www.bbc.com/news', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'news-guardian', name: 'The Guardian', defaultUrl: 'https://www.theguardian.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'news-reuters', name: 'Reuters', defaultUrl: 'https://www.reuters.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'news-ap', name: 'AP News', defaultUrl: 'https://apnews.com', category: categoryKey, clicks: 0, createdAt: now },
        { key: 'news-aljazeera', name: 'Al Jazeera', defaultUrl: 'https://www.aljazeera.com', category: categoryKey, clicks: 0, createdAt: now },
      ];

      setCategoryLabels(prev => ({
        ...prev,
        [categoryKey]: 'News',
      }));

      setCategoryColors(prev => ({
        ...prev,
        [categoryKey]: 'from-sky-500 to-indigo-600',
      }));

      setCategoryOrder(prev => (prev.includes(categoryKey) ? prev : [...prev, categoryKey]));
      setLinksData(prev => [...prev, ...newsLinks]);

      toast.success('News category added with predefined links');
    }
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

  const handleReorderLinks = (sourceIndex: number, destinationIndex: number, category: string) => {
    setSortBy('custom');
    setLinksData(prev => {
        const newLinks = [...prev];
        const categoryLinks = newLinks.filter(link => link.category === category);
        const otherLinks = newLinks.filter(link => link.category !== category);
        
        // Find the actual indices in the full array
        const sourceLink = categoryLinks[sourceIndex];
        const destinationLink = categoryLinks[destinationIndex];
        
                console.log('DRAG DEBUG:', { sourceIndex, destinationIndex, category, sourceLink: sourceLink?.name, destLink: destinationLink?.name, categoryLinksCount: categoryLinks.length });
        if (sourceLink && destinationLink) {
          const fullSourceIndex = newLinks.findIndex(l => l.key === sourceLink.key);
          const fullDestinationIndex = newLinks.findIndex(l => l.key === destinationLink.key);
          
          if (fullSourceIndex > -1 && fullDestinationIndex > -1) {
            const [draggedItem] = newLinks.splice(fullSourceIndex, 1);
            newLinks.splice(fullDestinationIndex, 0, draggedItem);
          }
        }
        
        return newLinks;
    });
    toast.success('Link reordered!');
  };

  // New function to handle dragging between categories
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    // If we're dragging categories (outer list), handle separately
    if (result.type === 'CATEGORY') {
      const sourceIndex = result.source.index;
      const destIndex = result.destination.index;
      if (sourceIndex === destIndex) return;
      const nextOrder = Array.from(categoryOrder);
      const [moved] = nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(destIndex, 0, moved);
      setCategoryOrder(nextOrder);
      try {
        localStorage.setItem('categoryOrder', JSON.stringify(nextOrder));
      } catch (err) {
        console.warn('Failed to persist category order', err);
      }
      toast.success('Category order updated');
      return;
    }

    const { source, destination } = result;
        console.log('DRAGEND RAW:', { source, destination, draggableId: result.draggableId });
    
    // Parse source and destination droppable IDs
    const sourceInfo = parseDroppableId(source.droppableId);
    const destInfo = parseDroppableId(destination.droppableId);
        console.log('DRAGEND PARSED:', { sourceInfo, destInfo, itemsPerRow: sourceInfo?.isMobile ? 5 : 12 });

    if (!sourceInfo.isValid || !destInfo.isValid) {
      console.error('Invalid droppable ID format');
      return;
    }

    // Get the dragged link
    const draggedLinkId = result.draggableId.replace('mobile-', ''); // Remove mobile prefix if exists
    
    if (sourceInfo.category === destInfo.category) {
      // Same category - convert row-based positions to category-relative indices
      const itemsPerRow = sourceInfo.isMobile ? ITEMS_PER_ROW.mobile : ITEMS_PER_ROW.desktop;
      
      // Calculate position within the category (not global position)
      const sourcePositionInCategory = sourceInfo.rowIndex * itemsPerRow + source.index;
      const destPositionInCategory = destInfo.rowIndex * itemsPerRow + destination.index;
      
      // Make sure indices are within bounds of the category
      const categoryLinks = linksData.filter(link => link.category === sourceInfo.category);
      const maxIndex = categoryLinks.length - 1;
      const sourceLocalIndex = Math.min(sourcePositionInCategory, maxIndex);
      const destLocalIndex = Math.min(destPositionInCategory, maxIndex);
      
      // Use existing reorder function
      handleReorderLinks(sourceLocalIndex, destLocalIndex, sourceInfo.category);
    } else {
      // Different category - move link between categories
      setSortBy('custom');
      setLinksData(prev => {
        const newLinks = [...prev];
        const draggedLink = newLinks.find(link => link.key === draggedLinkId);
        
        if (draggedLink) {
          // Remove from source
          const linkIndex = newLinks.findIndex(link => link.key === draggedLinkId);
          newLinks.splice(linkIndex, 1);
          
          // Update category
          const updatedLink = { ...draggedLink, category: destInfo.category };
          
          // Calculate destination position within the category
          const destItemsPerRow = destInfo.isMobile ? ITEMS_PER_ROW.mobile : ITEMS_PER_ROW.desktop;
          const destPositionInCategory = destInfo.rowIndex * destItemsPerRow + destination.index;
          
          // Find insertion point in destination category
          const destinationCategoryLinks = newLinks.filter(link => link.category === destInfo.category);
          const insertIndex = Math.min(destPositionInCategory, destinationCategoryLinks.length);
          
          // Find the actual index in the full array to insert at
          if (destinationCategoryLinks.length === 0) {
            // Empty category - add at the end
            newLinks.push(updatedLink);
          } else if (insertIndex === 0) {
            // Insert at beginning of category
            const firstCategoryLinkIndex = newLinks.findIndex(link => link.category === destInfo.category);
            newLinks.splice(firstCategoryLinkIndex, 0, updatedLink);
          } else if (insertIndex >= destinationCategoryLinks.length) {
            // Insert at end of category
            const lastCategoryLinkIndex = newLinks.map((link, idx) => ({ link, idx }))
              .filter(({ link }) => link.category === destInfo.category)
              .pop()?.idx;
            if (lastCategoryLinkIndex !== undefined) {
              newLinks.splice(lastCategoryLinkIndex + 1, 0, updatedLink);
            } else {
              newLinks.push(updatedLink);
            }
          } else {
            // Insert in middle of category
            const targetCategoryLink = destinationCategoryLinks[insertIndex];
            const targetIndex = newLinks.findIndex(link => link.key === targetCategoryLink.key);
            newLinks.splice(targetIndex, 0, updatedLink);
          }
        }
        
        return newLinks;
      });
      
      toast.success(`Link moved to ${categoryLabels[destInfo.category] || destInfo.category}!`);
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

  const applyCuratedLinksPack = () => {
    setLinksData((prev) => {
      const existingKeys = new Set(prev.map((l) => l.key));
      const extras = DEFAULT_LINKS.filter((l) => !existingKeys.has(l.key));
      const next = extras.length > 0 ? [...prev, ...extras] : prev;
      toast.success(extras.length > 0 ? `Added ${extras.length} curated links` : 'Curated links already applied');
      try {
        localStorage.setItem('linkRouterSeedVersion', '2026-03-04-01');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetLocalData = () => {
    if (!window.confirm('Reset local data? This will remove your saved links and settings from this browser.')) {
      return;
    }
    try {
      localStorage.removeItem('linkRouterData');
      localStorage.removeItem('linkRouterSettings');
      localStorage.removeItem('linkRouterCategories');
      localStorage.removeItem('categoryOrder');
      localStorage.removeItem('linkRouterSeedVersion');
    } catch {
      // ignore
    }
    setLinksData(DEFAULT_LINKS);
    setCategoryLabels(DEFAULT_CATEGORY_LABELS);
    setCategoryColors(DEFAULT_CATEGORY_COLORS);
    setCategoryOrder(['ai-tools', 'google', 'search', 'media', 'news', 'shopping', 'travel', 'apps']);
    toast.success('Local data reset');
  };

  const ensureCategoryExists = (key: string, label: string, color: string) => {
    setCategoryLabels((prev) => (prev[key as keyof typeof prev] ? prev : { ...prev, [key]: label }));
    setCategoryColors((prev) => (prev[key as keyof typeof prev] ? prev : { ...prev, [key]: color }));
    setCategoryOrder((prev) => (prev.includes(key) ? prev : [key, ...prev]));
  };

  const addTemplateCategory = (template: 'adults' | 'ai') => {
    const now = new Date().toISOString();

    if (template === 'adults') {
      ensureCategoryExists('adults', 'Adults (18+)', 'from-slate-500 to-slate-700');
      const adultLinks: LinkData[] = [
        { key: 'adults-pornhub', name: 'PornHub', defaultUrl: 'https://www.pornhub.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-xvideos', name: 'XVideos', defaultUrl: 'https://www.xvideos.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-xhamster', name: 'xHamster', defaultUrl: 'https://xhamster.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-xnxx', name: 'XNXX', defaultUrl: 'https://www.xnxx.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-eporner', name: 'Eporner', defaultUrl: 'https://www.eporner.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-hqporner', name: 'HQPorner', defaultUrl: 'https://hqporner.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-beeg', name: 'Beeg', defaultUrl: 'https://beeg.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-youporn', name: 'YouPorn', defaultUrl: 'https://www.youporn.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-redtube', name: 'RedTube', defaultUrl: 'https://www.redtube.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-spankbang', name: 'SpankBang', defaultUrl: 'https://spankbang.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-motherless', name: 'Motherless', defaultUrl: 'https://motherless.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-porntrex', name: 'PornTrex', defaultUrl: 'https://www.porntrex.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-youjizz', name: 'YouJizz', defaultUrl: 'https://www.youjizz.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-tube8', name: 'Tube8', defaultUrl: 'https://www.tube8.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-txxx', name: 'TXXX', defaultUrl: 'https://www.txxx.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-porndig', name: 'PornDig', defaultUrl: 'https://www.porndig.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-cumlouder', name: 'CumLouder', defaultUrl: 'https://www.cumlouder.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-porndoe', name: 'PornDoe', defaultUrl: 'https://www.porndoe.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-okxxx', name: 'OK.xxx', defaultUrl: 'https://ok.xxx', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-porn00', name: 'Porn00', defaultUrl: 'https://porn00.org', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-pornhits', name: 'PornHits', defaultUrl: 'https://www.pornhits.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-porngo', name: 'PornGo', defaultUrl: 'https://www.porngo.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-whoreshub', name: 'WhoresHub', defaultUrl: 'https://whoreshub.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-pornhd3x', name: 'PornHD3X', defaultUrl: 'https://pornhd3x.tv', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-xxxfiles', name: 'XXXFiles', defaultUrl: 'https://www.xxxfiles.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-pornktube', name: 'PornKTube', defaultUrl: 'https://www.pornktube.com', category: 'adults', clicks: 0, createdAt: now },
        { key: 'adults-tnaflix', name: 'TNAFlix', defaultUrl: 'https://www.tnaflix.com', category: 'adults', clicks: 0, createdAt: now },
      ];

      setLinksData((prev) => {
        const existingKeys = new Set(prev.map((l) => l.key));
        const extras = adultLinks.filter((l) => !existingKeys.has(l.key));
        if (extras.length > 0) toast.success(`Adults: added ${extras.length} links`);
        return extras.length > 0 ? [...prev, ...extras] : prev;
      });
      return;
    }

    if (template === 'ai') {
      ensureCategoryExists('ai', 'AI', 'from-slate-500 to-slate-700');
      const aiLinks: LinkData[] = [
        { key: 'ai-chatgpt', name: 'ChatGPT', defaultUrl: 'https://chatgpt.com/', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-claude', name: 'Claude', defaultUrl: 'https://claude.ai/', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-gemini', name: 'Gemini', defaultUrl: 'https://gemini.google.com/app', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-perplexity', name: 'Perplexity', defaultUrl: 'https://www.perplexity.ai/', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-openai-platform', name: 'OpenAI Platform', defaultUrl: 'https://platform.openai.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-anthropic-console', name: 'Anthropic Console', defaultUrl: 'https://console.anthropic.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-google-ai-studio', name: 'Google AI Studio', defaultUrl: 'https://aistudio.google.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-huggingface', name: 'Hugging Face', defaultUrl: 'https://huggingface.co', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-replicate', name: 'Replicate', defaultUrl: 'https://replicate.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-ollama', name: 'Ollama', defaultUrl: 'https://ollama.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-lmstudio', name: 'LM Studio', defaultUrl: 'https://lmstudio.ai', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-kaggle', name: 'Kaggle', defaultUrl: 'https://kaggle.com', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-arxiv', name: 'arXiv', defaultUrl: 'https://arxiv.org', category: 'ai', clicks: 0, createdAt: now },
        { key: 'ai-paperswithcode', name: 'Papers with Code', defaultUrl: 'https://paperswithcode.com', category: 'ai', clicks: 0, createdAt: now },
      ];

      setLinksData((prev) => {
        const existingKeys = new Set(prev.map((l) => l.key));
        const extras = aiLinks.filter((l) => !existingKeys.has(l.key));
        if (extras.length > 0) toast.success(`AI: added ${extras.length} links`);
        return extras.length > 0 ? [...prev, ...extras] : prev;
      });
    }
  };
  
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#FFFFFF] dark:bg-[#09090B]">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* ── A. Fixed header bar — 56px, logo left, controls right ── */}
        <AppHeader
          onAddLink={() => openModal()}
          onAddCategory={() => openAddCategoryModal(null)}
          onShowShortcuts={() => setShowShortcuts(true)}
          linkSize={linkSize}
          onLinkSizeChange={setLinkSize}
          onApplyCuratedLinks={applyCuratedLinksPack}
          onResetLocalData={resetLocalData}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="pb-[calc(4rem+env(safe-area-inset-bottom))] focus:outline-none"
        >
          {/* ── B. Hero section — greeting + search + tabs ── */}
          <LinkCloud
            searchTerm={searchTerm}
            onSearchTermChange={(v) => setSearchTerm(v)}
            searchInputRef={searchInputRef}
            onSubmit={() => {
              const q = searchTerm.trim();
              if (!q) return;
              navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
            selectedCategory={cloudCategory}
            onSelectedCategoryChange={(cat) => {
              setCloudCategory(cat);
            }}
            onAddTemplateCategory={addTemplateCategory}
            categoryIds={Object.keys(categoryLabels)}
            categoryLabels={categoryLabels}
          />

          {/* ── E. Link grid — below hero ── */}
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => {
              const entries =
                cloudCategory === null
                  ? Object.entries(groupedLinks)
                  : Object.entries(groupedLinks).filter(([cat]) => cat === cloudCategory);
              const isAllView = cloudCategory === null;
              return (
              <div className="link-grid-area" id="categories">
                <div ref={provided.innerRef} {...provided.droppableProps}>
                {entries.map(([category, links], index) => (
                  <Draggable key={category} draggableId={`category-${category}`} index={index}>
                    {(prov, snapshot) => (
                      <div
                        ref={(el) => {
                          prov.innerRef(el);
                          if (el) {
                            categorySectionRefs.current[category] = el;
                          } else {
                            delete categorySectionRefs.current[category];
                          }
                        }}
                        data-category-id={category}
                        {...prov.draggableProps}
                        className={`section-block animate-slide-up transition-transform duration-150 ${snapshot.isDragging ? 'scale-[1.01] shadow-2xl z-50 opacity-95' : ''}`}
                        style={{
                          animationDelay: `${Math.min(index * 40, 300)}ms`,
                          ...(prov.draggableProps.style ?? {}),
                        }}
                      >
                        <div className={`${snapshot.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                          {/* Section label — only in ALL view */}
                          {isAllView && categoryLabels[category] && (
                            <span className="section-label">{categoryLabels[category]}</span>
                          )}
                          <CategorySection
                            category={category}
                            links={links}
                            categoryLabels={categoryLabels}
                            categoryColors={categoryColors}
                            hoveredLink={hoveredLink}
                            clickedLink={clickedLink}
                            onLinkClick={handleLinkClick}
                            onEditLink={openModal}
                            onCopyUrl={copyLinkUrl}
                            onMouseEnter={setHoveredLink}
                            onMouseLeave={() => setHoveredLink(null)}
                            onAddLink={(category) => openModal(undefined, category)}
                            onAddCategory={openAddCategoryModal}
                            onDeleteCategory={handleDeleteCategory}
                            onAddPredefinedCategory={handleAddPredefinedCategory}
                            dragHandleProps={prov.dragHandleProps}
                            onReorderLinks={handleReorderLinks}
                            onDeleteLink={handleDeleteLink}
                            onToggleFavorite={handleToggleFavorite}
                            onEditCategoryName={handleEditCategoryName}
                            linkSize={linkSize}
                            showCategoryHeader={false}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                </div>
              </div>
              );
            }}
          </Droppable>
        
        {/* Empty state */}
        {Object.keys(groupedLinks).length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center px-6 animate-fade-in">
            <div className="mb-6 w-14 h-14 rounded-2xl bg-[#F0F0EE] dark:bg-white/[0.04] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#C8C8C6] dark:text-[#2A2A2C]"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-2 tracking-tight">
              {debouncedSearchTerm || quickFilter !== 'all' ? 'No links found' : 'Your link collection awaits'}
            </h3>
            <p className="mb-7 text-[13px] text-[#9CA3AF] dark:text-[#4B5563] max-w-xs leading-relaxed">
              {debouncedSearchTerm 
                ? `No links match "${debouncedSearchTerm}". Try adjusting your search.`
                : quickFilter !== 'all'
                ? `No ${quickFilter} links found. Try a different filter.`
                : 'Add your first link to start building your personal link hub.'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => openModal()} 
                className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-[13px] font-medium rounded-xl transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
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
                  className="h-9 px-4 text-[13px] font-medium rounded-xl border border-[#E9E9E7] dark:border-white/8 text-[#757575] dark:text-[#8C8C8C] hover:bg-[#F0F0EE] dark:hover:bg-white/5 transition-all duration-200"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
        </main>
      </DragDropContext>


      <React.Suspense fallback={
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#E9E9E7] border-t-[#18181B] dark:border-white/20 dark:border-t-white rounded-full" />
        </div>
      }>
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

        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={closeAddCategoryModal}
          onAddCategory={handleAddCategory}
          isLoading={false}
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
