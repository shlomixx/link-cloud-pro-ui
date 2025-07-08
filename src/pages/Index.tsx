import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Settings, Moon, Sun, Grid, List, MoreHorizontal, Eye, EyeOff, Star, Filter, X, Download, Upload, Trash2, Edit, Copy, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CategorySection } from '@/components/CategorySection';
import { LinkModal } from '@/components/LinkModal';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  isPrivate?: boolean;
  clicks?: number;
  createdAt?: string;
  isFavorite?: boolean;
  lastClicked?: string;
}

interface FormData {
  name: string;
  url: string;
  category: string;
  isPrivate: boolean;
}

const STORAGE_KEY = 'linkManager_links';
const SETTINGS_KEY = 'linkManager_settings';

const defaultLinks: LinkData[] = [
  // Work
  { key: 'gmail', name: 'Gmail', defaultUrl: 'https://gmail.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'drive', name: 'Google Drive', defaultUrl: 'https://drive.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'calendar', name: 'Google Calendar', defaultUrl: 'https://calendar.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'docs', name: 'Google Docs', defaultUrl: 'https://docs.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'sheets', name: 'Google Sheets', defaultUrl: 'https://sheets.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'slides', name: 'Google Slides', defaultUrl: 'https://slides.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'meet', name: 'Google Meet', defaultUrl: 'https://meet.google.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'slack', name: 'Slack', defaultUrl: 'https://slack.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'zoom', name: 'Zoom', defaultUrl: 'https://zoom.us', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'trello', name: 'Trello', defaultUrl: 'https://trello.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'notion', name: 'Notion', defaultUrl: 'https://notion.so', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'figma', name: 'Figma', defaultUrl: 'https://figma.com', category: 'work', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },

  // Social
  { key: 'facebook', name: 'Facebook', defaultUrl: 'https://facebook.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'twitter', name: 'Twitter', defaultUrl: 'https://twitter.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'instagram', name: 'Instagram', defaultUrl: 'https://instagram.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://linkedin.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'whatsapp', name: 'WhatsApp Web', defaultUrl: 'https://web.whatsapp.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'telegram', name: 'Telegram Web', defaultUrl: 'https://web.telegram.org', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'reddit', name: 'Reddit', defaultUrl: 'https://reddit.com', category: 'social', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },

  // Entertainment
  { key: 'youtube', name: 'YouTube', defaultUrl: 'https://youtube.com', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'netflix', name: 'Netflix', defaultUrl: 'https://netflix.com', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'spotify', name: 'Spotify', defaultUrl: 'https://open.spotify.com', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'twitch', name: 'Twitch', defaultUrl: 'https://twitch.tv', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'prime', name: 'Amazon Prime', defaultUrl: 'https://primevideo.com', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'disney', name: 'Disney+', defaultUrl: 'https://disneyplus.com', category: 'entertainment', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },

  // Tools
  { key: 'github', name: 'GitHub', defaultUrl: 'https://github.com', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'codepen', name: 'CodePen', defaultUrl: 'https://codepen.io', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'canva', name: 'Canva', defaultUrl: 'https://canva.com', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'photopea', name: 'Photopea', defaultUrl: 'https://photopea.com', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'unsplash', name: 'Unsplash', defaultUrl: 'https://unsplash.com', category: 'tools', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },

  // News
  { key: 'bbc', name: 'BBC News', defaultUrl: 'https://bbc.com/news', category: 'news', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'cnn', name: 'CNN', defaultUrl: 'https://cnn.com', category: 'news', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'reuters', name: 'Reuters', defaultUrl: 'https://reuters.com', category: 'news', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'techcrunch', name: 'TechCrunch', defaultUrl: 'https://techcrunch.com', category: 'news', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },

  // Shopping
  { key: 'amazon', name: 'Amazon', defaultUrl: 'https://amazon.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'ebay', name: 'eBay', defaultUrl: 'https://ebay.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'aliexpress', name: 'AliExpress', defaultUrl: 'https://aliexpress.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false },
  { key: 'etsy', name: 'Etsy', defaultUrl: 'https://etsy.com', category: 'shopping', clicks: 0, createdAt: new Date().toISOString(), isFavorite: false }
];

const categoryLabels = {
  work: 'Work',
  social: 'Social',
  entertainment: 'Entertainment',
  tools: 'Tools',
  news: 'News',
  shopping: 'Shopping',
  education: 'Education',
  finance: 'Finance',
  health: 'Health',
  travel: 'Travel',
  food: 'Food',
  sports: 'Sports',
  gaming: 'Gaming',
  music: 'Music',
  photography: 'Photography',
  design: 'Design',
  development: 'Development',
  business: 'Business',
  personal: 'Personal',
  other: 'Other',
  custom: 'Custom'
};

const categoryColors = {
  work: 'blue',
  social: 'pink',
  entertainment: 'purple',
  tools: 'orange',
  news: 'gray',
  shopping: 'green',
  education: 'indigo',
  finance: 'emerald',
  health: 'red',
  travel: 'sky',
  food: 'yellow',
  sports: 'amber',
  gaming: 'violet',
  music: 'fuchsia',
  photography: 'slate',
  design: 'rose',
  development: 'teal',
  business: 'blue',
  personal: 'cyan',
  other: 'neutral',
  custom: 'purple'
};

export default function Index() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPrivateLinks, setShowPrivateLinks] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact' | 'dense'>('compact');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewLink, setIsNewLink] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [importData, setImportData] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'other',
    isPrivate: false
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLinks = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks);
        setLinks(parsedLinks);
      } catch (error) {
        console.error('Error parsing saved links:', error);
        setLinks(defaultLinks);
      }
    } else {
      setLinks(defaultLinks);
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsDarkMode(settings.isDarkMode ?? true);
        setViewMode(settings.viewMode ?? 'compact');
        setShowPrivateLinks(settings.showPrivateLinks ?? false);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save links to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      isDarkMode,
      viewMode,
      showPrivateLinks
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [isDarkMode, viewMode, showPrivateLinks]);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (link.url || link.defaultUrl || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || link.isFavorite;
      const matchesPrivacy = showPrivateLinks || !link.isPrivate;
      
      return matchesSearch && matchesCategory && matchesFavorites && matchesPrivacy;
    });
  }, [links, searchTerm, selectedCategory, showFavoritesOnly, showPrivateLinks]);

  const groupedLinks = useMemo(() => {
    const groups: Record<string, LinkData[]> = {};
    filteredLinks.forEach(link => {
      if (!groups[link.category]) {
        groups[link.category] = [];
      }
      groups[link.category].push(link);
    });
    return groups;
  }, [filteredLinks]);

  const handleAddLink = useCallback((category?: string) => {
    setIsNewLink(true);
    setEditingLink(null);
    setFormData({
      name: '',
      url: '',
      category: category || 'other',
      isPrivate: false
    });
    setIsModalOpen(true);
  }, []);

  const handleEditLink = useCallback((link: LinkData) => {
    setIsNewLink(false);
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url || link.defaultUrl || '',
      category: link.category,
      isPrivate: link.isPrivate || false
    });
    setIsModalOpen(true);
  }, []);

  const handleSaveLink = useCallback(async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      if (isNewLink) {
        const newLink: LinkData = {
          key: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name.trim(),
          url: formData.url.trim(),
          category: formData.category,
          isPrivate: formData.isPrivate,
          clicks: 0,
          createdAt: new Date().toISOString(),
          isFavorite: false
        };
        setLinks(prev => [...prev, newLink]);
        toast.success('Link added successfully!');
      } else if (editingLink) {
        setLinks(prev => prev.map(link => 
          link.key === editingLink.key 
            ? {
                ...link,
                name: formData.name.trim(),
                url: formData.url.trim(),
                category: formData.category,
                isPrivate: formData.isPrivate
              }
            : link
        ));
        toast.success('Link updated successfully!');
      }

      setIsModalOpen(false);
      setFormData({ name: '', url: '', category: 'other', isPrivate: false });
    } catch (error) {
      toast.error('Failed to save link');
    } finally {
      setIsLoading(false);
    }
  }, [formData, isNewLink, editingLink]);

  const handleDeleteLink = useCallback(() => {
    if (!editingLink) return;

    setLinks(prev => prev.filter(link => link.key !== editingLink.key));
    toast.success('Link deleted successfully!');
    setIsModalOpen(false);
  }, [editingLink]);

  const handleLinkClick = useCallback((link: LinkData) => {
    setClickedLink(link.key);
    setTimeout(() => setClickedLink(null), 150);

    // Update click count and last clicked time
    setLinks(prev => prev.map(l => 
      l.key === link.key 
        ? { 
            ...l, 
            clicks: (l.clicks || 0) + 1,
            lastClicked: new Date().toISOString()
          }
        : l
    ));

    // Open the link
    const url = link.url || link.defaultUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleToggleFavorite = useCallback((linkKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLinks(prev => prev.map(link => 
      link.key === linkKey 
        ? { ...link, isFavorite: !link.isFavorite }
        : link
    ));
  }, []);

  const handleCopyUrl = useCallback((url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`Copied ${name} URL to clipboard!`);
  }, []);

  const handleMouseEnter = useCallback((linkKey: string) => {
    setHoveredLink(linkKey);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    const linkKey = e.dataTransfer.getData('text/plain');
    
    if (linkKey && draggedItem === linkKey) {
      setLinks(prev => prev.map(link => 
        link.key === linkKey 
          ? { ...link, category: targetCategory }
          : link
      ));
      toast.success('Link moved successfully!');
    }
    
    setDraggedItem(null);
  }, [draggedItem]);

  const handleDropUrl = useCallback((url: string, category: string) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const name = domain.charAt(0).toUpperCase() + domain.slice(1);
      
      const newLink: LinkData = {
        key: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        url,
        category,
        isPrivate: false,
        clicks: 0,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      
      setLinks(prev => [...prev, newLink]);
      toast.success(`Added ${name} to ${categoryLabels[category]}!`);
    } catch (error) {
      toast.error('Invalid URL format');
    }
  }, []);

  const handleExportData = useCallback(() => {
    const dataToExport = {
      links,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  }, [links]);

  const handleImportData = useCallback(() => {
    try {
      const data = JSON.parse(importData);
      
      if (data.links && Array.isArray(data.links)) {
        setLinks(data.links);
        toast.success(`Imported ${data.links.length} links successfully!`);
        setImportData('');
        setIsImportExportOpen(false);
      } else {
        toast.error('Invalid data format');
      }
    } catch (error) {
      toast.error('Failed to parse import data');
    }
  }, [importData]);

  const handleClearAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setLinks([]);
      localStorage.removeItem(STORAGE_KEY);
      toast.success('All data cleared successfully!');
    }
  }, []);

  const getBackgroundGradient = () => {
    if (isDarkMode) {
      return 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
    }
    return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  };

  const renderCategories = () => {
    const sortedCategories = Object.entries(groupedLinks).sort(([a], [b]) => {
      const order = ['work', 'social', 'entertainment', 'tools', 'news', 'shopping'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedCategories.map(([categoryKey, categoryLinks]) => (
      <CategorySection
        key={categoryKey}
        category={categoryKey}
        links={categoryLinks}
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
        onToggleFavorite={handleToggleFavorite}
        onEditLink={handleEditLink}
        onCopyUrl={handleCopyUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onAddLink={handleAddLink}
        onDropUrl={handleDropUrl}
      />
    ));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundGradient()}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold text-white hidden sm:block">Link Manager</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all duration-300"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    {viewMode === 'grid' && <Grid className="w-4 h-4" />}
                    {viewMode === 'list' && <List className="w-4 h-4" />}
                    {viewMode === 'compact' && <MoreHorizontal className="w-4 h-4" />}
                    {viewMode === 'dense' && <MoreHorizontal className="w-4 h-4 rotate-90" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
                  <DropdownMenuItem onClick={() => setViewMode('grid')}>
                    <Grid className="w-4 h-4 mr-2" />
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('compact')}>
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    Compact View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('dense')}>
                    <MoreHorizontal className="w-4 h-4 mr-2 rotate-90" />
                    Dense View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('list')}>
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
                  <DropdownMenuItem onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
                    <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    Favorites Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPrivateLinks(!showPrivateLinks)}>
                    {showPrivateLinks ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {showPrivateLinks ? 'Hide Private' : 'Show Private'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      Category
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
                      <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                        All Categories
                      </DropdownMenuItem>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <DropdownMenuItem key={key} onClick={() => setSelectedCategory(key)}>
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Link */}
              <Button 
                onClick={() => handleAddLink()}
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add</span>
              </Button>

              {/* Settings */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSettingsOpen(true)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Dark Mode Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:bg-white/10"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-white mb-2">No links found</h2>
            <p className="text-white/70 mb-6">
              {searchTerm || selectedCategory !== 'all' || showFavoritesOnly 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first link'
              }
            </p>
            <Button 
              onClick={() => handleAddLink()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {renderCategories()}
          </div>
        )}
      </main>

      {/* Link Modal */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isNewLink={isNewLink}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveLink}
        onDelete={handleDeleteLink}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        categoryLabels={categoryLabels}
      />

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className={`max-w-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm' 
            : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-sm'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
            <DialogDescription className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Customize your Link Manager experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Dark Mode
              </Label>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Show Private Links
              </Label>
              <Switch
                checked={showPrivateLinks}
                onCheckedChange={setShowPrivateLinks}
              />
            </div>
            
            <div>
              <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Default View Mode
              </Label>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className={`mt-2 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-600 text-white' 
                    : 'bg-slate-50/50 border-slate-300 text-slate-800'
                }`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${
                  isDarkMode ? 'bg-slate-800/95 border-slate-600 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'
                }`}>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="compact">Compact View</SelectItem>
                  <SelectItem value="dense">Dense View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsImportExportOpen(true)}
                  variant="outline"
                  className={`flex-1 ${
                    isDarkMode 
                      ? 'border-slate-600 text-white hover:bg-slate-800/50' 
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import/Export
                </Button>
                <Button
                  onClick={handleClearAllData}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import/Export Modal */}
      <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
        <DialogContent className={`max-w-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm' 
            : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-sm'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Import/Export Data</DialogTitle>
            <DialogDescription className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Backup or restore your links
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="export" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
            }`}>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4 mt-4">
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Download a backup of all your links and settings.
              </p>
              <Button 
                onClick={handleExportData}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4 mt-4">
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Paste your exported data to restore your links.
              </p>
              <Textarea
                placeholder="Paste your exported data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className={`min-h-[100px] ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-600 text-white' 
                    : 'bg-slate-50/50 border-slate-300 text-slate-800'
                }`}
              />
              <Button 
                onClick={handleImportData}
                disabled={!importData.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
