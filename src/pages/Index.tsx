
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Download, Upload, Grid, List, Moon, Sun, SortAsc, Filter, Settings, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
  isPrivate?: boolean;
  clicks?: number;
  createdAt?: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'clicks' | 'recent'>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrivateLinks, setShowPrivateLinks] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'custom',
    isPrivate: false
  });

  const [linksData, setLinksData] = useState<LinkData[]>([
    { key: 'google', name: 'Google', defaultUrl: 'https://www.google.com', category: 'tools', clicks: 45, createdAt: '2024-01-01' },
    { key: 'youtube', name: 'YouTube', defaultUrl: 'https://www.youtube.com', category: 'streaming', clicks: 32, createdAt: '2024-01-02' },
    { key: 'facebook', name: 'Facebook', defaultUrl: 'https://www.facebook.com', category: 'social', clicks: 28, createdAt: '2024-01-03' },
    { key: 'amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com', category: 'shopping', clicks: 19, createdAt: '2024-01-04' },
    { key: 'netflix', name: 'Netflix', defaultUrl: 'https://www.netflix.com', category: 'streaming', clicks: 41, createdAt: '2024-01-05' },
    { key: 'wikipedia', name: 'Wikipedia', defaultUrl: 'https://www.wikipedia.org', category: 'education', clicks: 15, createdAt: '2024-01-06' },
    { key: 'ynet', name: 'Ynet', defaultUrl: 'https://www.ynet.co.il', category: 'news', clicks: 23, createdAt: '2024-01-07' },
    { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chat.openai.com', category: 'ai', clicks: 67, createdAt: '2024-01-08' },
    { key: 'mail', name: 'Gmail', defaultUrl: 'https://mail.google.com', category: 'tools', clicks: 89, createdAt: '2024-01-09' },
    { key: 'spotify', name: 'Spotify', defaultUrl: 'https://www.spotify.com', category: 'streaming', clicks: 36, createdAt: '2024-01-10' },
    { key: 'instagram', name: 'Instagram', defaultUrl: 'https://www.instagram.com', category: 'social', clicks: 52, createdAt: '2024-01-11' },
    { key: 'twitter', name: 'Twitter', defaultUrl: 'https://www.twitter.com', category: 'social', clicks: 38, createdAt: '2024-01-12' },
    { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://www.linkedin.com', category: 'social', clicks: 24, createdAt: '2024-01-13' },
    { key: 'github', name: 'GitHub', defaultUrl: 'https://www.github.com', category: 'tools', clicks: 61, createdAt: '2024-01-14' },
    { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'tools', clicks: 34, createdAt: '2024-01-15' },
    { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social', clicks: 29, createdAt: '2024-01-16' },
  ]);

  const categoryLabels = {
    ai: 'AI & Tech',
    shopping: 'Shopping',
    social: 'Social Media',
    news: 'News',
    streaming: 'Streaming',
    tools: 'Tools',
    finance: 'Finance',
    gaming: 'Gaming',
    travel: 'Travel',
    food: 'Food & Dining',
    education: 'Education',
    services: 'Services',
    custom: 'Custom Links'
  };

  const categoryColors = {
    ai: 'from-purple-500 to-pink-500',
    shopping: 'from-yellow-500 to-orange-500',
    social: 'from-blue-500 to-cyan-500',
    news: 'from-red-500 to-rose-500',
    streaming: 'from-green-500 to-emerald-500',
    tools: 'from-gray-600 to-gray-800',
    finance: 'from-emerald-600 to-teal-600',
    gaming: 'from-violet-500 to-purple-600',
    travel: 'from-sky-500 to-blue-600',
    food: 'from-orange-500 to-red-500',
    education: 'from-indigo-500 to-blue-600',
    services: 'from-teal-500 to-cyan-600',
    custom: 'from-slate-600 to-gray-700'
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    if (saved) {
      try {
        setLinksData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved links:', error);
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsDarkMode(settings.isDarkMode ?? true);
        setViewMode(settings.viewMode ?? 'grid');
        setSortBy(settings.sortBy ?? 'name');
        setShowPrivateLinks(settings.showPrivateLinks ?? true);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data or settings change
  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  useEffect(() => {
    const settings = { isDarkMode, viewMode, sortBy, showPrivateLinks };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, viewMode, sortBy, showPrivateLinks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'n':
            e.preventDefault();
            openModal();
            break;
          case 'g':
            e.preventDefault();
            setViewMode(viewMode === 'grid' ? 'list' : 'grid');
            break;
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
            break;
        }
      }
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isDarkMode, isModalOpen]);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  const handleLinkClick = (link: LinkData) => {
    // Update click count
    setLinksData(prev => prev.map(l => 
      l.key === link.key ? { ...l, clicks: (l.clicks || 0) + 1 } : l
    ));
  };

  const sortLinks = (links: LinkData[]) => {
    switch (sortBy) {
      case 'clicks':
        return [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'recent':
        return [...links].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      default:
        return [...links].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const filteredLinks = linksData.filter(link => {
    if (!showPrivateLinks && link.isPrivate) return false;
    if (selectedCategory !== 'all' && link.category !== selectedCategory) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      link.name.toLowerCase().includes(searchLower) ||
      (link.url || link.defaultUrl || '').toLowerCase().includes(searchLower) ||
      link.category.toLowerCase().includes(searchLower)
    );
  });

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'custom';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, LinkData[]>);

  // Sort links within each category
  Object.keys(groupedLinks).forEach(category => {
    groupedLinks[category] = sortLinks(groupedLinks[category]);
  });

  const openModal = (link?: LinkData) => {
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
        category: 'custom',
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

  const handleSave = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in both name and URL');
      return;
    }

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
      toast.success('Link added successfully!');
    } else if (editingLink) {
      setLinksData(prev => prev.map(link => 
        link.key === editingLink.key
          ? { ...link, name: formData.name.trim(), url: url, category: formData.category, isPrivate: formData.isPrivate }
          : link
      ));
      toast.success('Link updated successfully!');
    }

    closeModal();
  };

  const handleDelete = () => {
    if (editingLink) {
      setLinksData(prev => prev.filter(link => link.key !== editingLink.key));
      toast.success('Link deleted successfully!');
      closeModal();
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
    if (draggedItem) {
      setLinksData(prev => prev.map(link => 
        link.key === draggedItem ? { ...link, category: targetCategory } : link
      ));
      setDraggedItem(null);
      toast.success('Link moved to new category!');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(linksData, null, 2);
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
          const importedData = JSON.parse(e.target?.result as string);
          setLinksData(importedData);
          toast.success('Data imported successfully!');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyLinkUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const categories = Array.from(new Set(linksData.map(link => link.category)));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      {/* Enhanced Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/20 border-black/10'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'from-white to-purple-200' 
                  : 'from-slate-800 to-purple-600'
              }`}>
                Link Router Pro
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Your personal link management hub • {linksData.length} links
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-80">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search links... (Ctrl+K)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 placeholder:text-slate-500 focus:bg-black/10'
                  }`}
                />
              </div>
              
              {/* Filters */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map(category => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    <SortAsc className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('clicks')}>Most Clicked</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>Recently Added</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>

              {/* Theme Toggle */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className={`${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${
                  isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <DropdownMenuItem onClick={exportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPrivateLinks(!showPrivateLinks)}>
                    {showPrivateLinks ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {showPrivateLinks ? 'Hide' : 'Show'} Private Links
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                onClick={() => openModal()}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {Object.entries(groupedLinks).map(([category, links]) => (
          <div 
            key={category} 
            className={`mb-8 animate-fade-in transition-all duration-300 ${
              draggedItem ? 'ring-2 ring-purple-500/30 rounded-lg p-2' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-1 w-12 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full`}></div>
              <h2 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <Badge variant="secondary" className={`text-xs transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-black/10 text-slate-800 border-black/20'
              }`}>
                {links.length}
              </Badge>
            </div>

            {/* Links Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-3' 
                : 'flex flex-col gap-2'
            }`}>
              {links.map((link) => (
                <Card 
                  key={link.key} 
                  draggable
                  onDragStart={() => handleDragStart(link.key)}
                  className={`group transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-move animate-scale-in ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' 
                      : 'bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/20'
                  } ${viewMode === 'list' ? 'flex-row' : ''} ${link.isPrivate ? 'ring-1 ring-yellow-500/30' : ''}`}
                >
                  <CardContent className={`${viewMode === 'grid' ? 'p-3' : 'p-4 flex items-center gap-4 w-full'}`}>
                    {viewMode === 'grid' ? (
                      <div className="flex flex-col items-center text-center space-y-2">
                        {/* Favicon */}
                        <div className={`w-8 h-8 rounded-lg p-1 flex items-center justify-center transition-colors duration-300 ${
                          isDarkMode ? 'bg-white/10' : 'bg-black/10'
                        }`}>
                          <img
                            src={getFaviconUrl(link.url || link.defaultUrl || '')}
                            alt=""
                            className="w-6 h-6 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        
                        {/* Link Info */}
                        <div className="w-full">
                          <h3 className={`font-medium text-xs truncate transition-colors duration-300 ${
                            isDarkMode 
                              ? 'text-white group-hover:text-purple-200' 
                              : 'text-slate-800 group-hover:text-purple-600'
                          }`}>
                            {link.name}
                            {link.isPrivate && <span className="ml-1 text-yellow-500">🔒</span>}
                          </h3>
                          {link.clicks && (
                            <p className={`text-xs mt-1 transition-colors duration-300 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {link.clicks} clicks
                            </p>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 w-full">
                          <Button
                            variant="ghost"
                            asChild
                            size="sm"
                            className={`flex-1 h-7 px-2 text-xs transition-colors duration-300 ${
                              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                            }`}
                          >
                            <a
                              href={link.url || link.defaultUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleLinkClick(link)}
                              className="flex items-center justify-center"
                            >
                              <span className={`transition-colors duration-300 ${
                                isDarkMode 
                                  ? 'text-slate-300 group-hover:text-white' 
                                  : 'text-slate-600 group-hover:text-slate-800'
                              }`}>
                                Open
                              </span>
                            </a>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                                  isDarkMode 
                                    ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                                    : 'hover:bg-black/10 text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={`${
                              isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                            }`}>
                              <DropdownMenuItem onClick={() => openModal(link)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyLinkUrl(link.url || link.defaultUrl || '')}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy URL
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 w-full">
                        <img
                          src={getFaviconUrl(link.url || link.defaultUrl || '')}
                          alt=""
                          className="w-8 h-8 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {link.name}
                            {link.isPrivate && <span className="ml-2 text-yellow-500">🔒</span>}
                          </h3>
                          <p className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {link.url || link.defaultUrl}
                          </p>
                        </div>
                        {link.clicks && (
                          <Badge variant="outline" className={`${
                            isDarkMode ? 'border-white/20 text-white' : 'border-black/20 text-slate-800'
                          }`}>
                            {link.clicks} clicks
                          </Badge>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            asChild
                            className="bg-gradient-to-r from-purple-600 to-pink-600"
                          >
                            <a
                              href={link.url || link.defaultUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleLinkClick(link)}
                            >
                              Open
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal(link)}
                            className={`${
                              isDarkMode 
                                ? 'border-white/20 text-white hover:bg-white/10' 
                                : 'border-black/20 text-slate-800 hover:bg-black/10'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedLinks).length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>No links found</h3>
            <p className={`mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first link to get started'}
            </p>
            <Button onClick={() => openModal()} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importData}
        className="hidden"
      />

      {/* Enhanced Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={`max-w-md transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-700 text-white' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isNewLink ? 'Add New Link' : 'Edit Link'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Link Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Google"
                  className={`mt-1 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              
              <div>
                <Label htmlFor="url" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  URL
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                  className={`mt-1 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              
              <div>
                <Label htmlFor="category" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={`mt-1 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-600 text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-purple-500'
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${
                    isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                  }`}>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key} className={`${
                        isDarkMode ? 'text-white focus:bg-slate-700' : 'text-slate-800 focus:bg-slate-100'
                      }`}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                />
                <Label htmlFor="private" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Private Link
                </Label>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Private links are only visible when "Show Private Links" is enabled.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4">
            <div>
              {!isNewLink && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={closeModal} 
                className={`transition-colors duration-300 ${
                  isDarkMode 
                    ? 'border-slate-600 text-white hover:bg-slate-800' 
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600">
                {isNewLink ? 'Add Link' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
