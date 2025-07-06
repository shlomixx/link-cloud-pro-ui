import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkModal } from '@/components/LinkModal';
import { QuickActions } from '@/components/QuickActions';
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
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'custom',
    isPrivate: false
  });

  const [linksData, setLinksData] = useState<LinkData[]>([
    { key: 'google', name: 'Google', defaultUrl: 'https://www.google.com', category: 'tools', clicks: 45, createdAt: '2024-01-01', isFavorite: true },
    { key: 'youtube', name: 'YouTube', defaultUrl: 'https://www.youtube.com', category: 'streaming', clicks: 32, createdAt: '2024-01-02' },
    { key: 'facebook', name: 'Facebook', defaultUrl: 'https://www.facebook.com', category: 'social', clicks: 28, createdAt: '2024-01-03' },
    { key: 'amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com', category: 'shopping', clicks: 19, createdAt: '2024-01-04', isFavorite: true },
    { key: 'netflix', name: 'Netflix', defaultUrl: 'https://www.netflix.com', category: 'streaming', clicks: 41, createdAt: '2024-01-05' },
    { key: 'wikipedia', name: 'Wikipedia', defaultUrl: 'https://www.wikipedia.org', category: 'education', clicks: 15, createdAt: '2024-01-06' },
    { key: 'ynet', name: 'Ynet News', defaultUrl: 'https://www.ynet.co.il', category: 'news', clicks: 23, createdAt: '2024-01-07' },
    { key: 'walla', name: 'Walla News', defaultUrl: 'https://www.walla.co.il', category: 'news', clicks: 18, createdAt: '2024-01-08' },
    { key: 'mako', name: 'Mako', defaultUrl: 'https://www.mako.co.il', category: 'news', clicks: 12, createdAt: '2024-01-09' },
    { key: 'haaretz', name: 'Haaretz', defaultUrl: 'https://www.haaretz.co.il', category: 'news', clicks: 8, createdAt: '2024-01-10' },
    { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chat.openai.com', category: 'ai', clicks: 67, createdAt: '2024-01-11', isFavorite: true },
    { key: 'mail', name: 'Gmail', defaultUrl: 'https://mail.google.com', category: 'tools', clicks: 89, createdAt: '2024-01-12' },
    { key: 'spotify', name: 'Spotify', defaultUrl: 'https://www.spotify.com', category: 'streaming', clicks: 36, createdAt: '2024-01-13' },
    { key: 'instagram', name: 'Instagram', defaultUrl: 'https://www.instagram.com', category: 'social', clicks: 52, createdAt: '2024-01-14' },
    { key: 'twitter', name: 'Twitter', defaultUrl: 'https://www.twitter.com', category: 'social', clicks: 38, createdAt: '2024-01-15' },
    { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://www.linkedin.com', category: 'social', clicks: 24, createdAt: '2024-01-16' },
    { key: 'github', name: 'GitHub', defaultUrl: 'https://www.github.com', category: 'tools', clicks: 61, createdAt: '2024-01-17', isFavorite: true },
    { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'tools', clicks: 34, createdAt: '2024-01-18' },
    { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social', clicks: 29, createdAt: '2024-01-19' },
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

  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    setTimeout(() => {
      if (saved) {
        try {
          setLinksData(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved links:', error);
          toast.error('Failed to load saved links');
        }
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
          case 'f':
            e.preventDefault();
            handleQuickAction('favorites');
            break;
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

  const handleQuickAction = (action: string) => {
    setQuickFilter(action);
    switch (action) {
      case 'favorites':
        setSortBy('favorites');
        toast.success('Showing favorite links');
        break;
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
    
    toast.success(`Opening ${link.name}...`, {
      duration: 2000,
      action: {
        label: 'Undo',
        onClick: () => toast.info('Link opening cancelled')
      }
    });
  };

  const toggleFavorite = (linkKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLinksData(prev => prev.map(link => 
      link.key === linkKey 
        ? { ...link, isFavorite: !link.isFavorite }
        : link
    ));
    
    const link = linksData.find(l => l.key === linkKey);
    const isFavorite = link?.isFavorite;
    
    toast.success(
      isFavorite ? `Removed ${link?.name} from favorites` : `Added ${link?.name} to favorites`,
      { duration: 2000 }
    );
  };

  const sortLinks = (links: LinkData[]) => {
    switch (sortBy) {
      case 'clicks':
        return [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'recent':
        return [...links].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      case 'favorites':
        return [...links].sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return (b.clicks || 0) - (a.clicks || 0);
        });
      default:
        return [...links].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const filteredLinks = linksData.filter(link => {
    if (!showPrivateLinks && link.isPrivate) return false;
    if (selectedCategory !== 'all' && link.category !== selectedCategory) return false;
    
    // Apply quick filter
    if (quickFilter === 'favorites' && !link.isFavorite) return false;
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

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'custom';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, LinkData[]>);

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
      toast.success(`${formData.name} updated successfully!`);
    }

    setIsLoading(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (editingLink) {
      setIsLoading(true);
      
      const confirmed = window.confirm(`Are you sure you want to delete "${editingLink.name}"?`);
      if (!confirmed) {
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLinksData(prev => prev.filter(link => link.key !== editingLink.key));
      toast.success(`${editingLink.name} deleted successfully`, {
        action: {
          label: 'Undo',
          onClick: () => {
            setLinksData(prev => [...prev, editingLink]);
            toast.success('Link restored');
          }
        }
      });
      setIsLoading(false);
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

  const copyLinkUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`${name} link copied to clipboard!`);
  };

  const categories = Array.from(new Set(linksData.map(link => link.category)));
  const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const favoriteLinks = linksData.filter(link => link.isFavorite);
  const recentLinks = linksData.filter(link => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(link.createdAt || '') > weekAgo;
  });
  const popularLinks = linksData.filter(link => (link.clicks || 0) > 20);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
      }`}>
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
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
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputRef={searchInputRef}
        viewMode={getCompatibleViewMode(viewMode)}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isCompactHeader={isCompactHeader}
        onToggleCompactHeader={() => setIsCompactHeader(!isCompactHeader)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        categoryLabels={categoryLabels}
        showPrivateLinks={showPrivateLinks}
        onTogglePrivateLinks={() => setShowPrivateLinks(!showPrivateLinks)}
        onExportData={exportData}
        onImportData={() => fileInputRef.current?.click()}
        onAddLink={() => openModal()}
        onShowShortcuts={() => setShowShortcuts(true)}
        linksCount={linksData.length}
        totalClicks={totalClicks}
        favoriteCount={favoriteLinks.length}
        categoriesCount={categories.length}
        fileInputRef={fileInputRef}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Quick Actions */}
        <QuickActions
          isDarkMode={isDarkMode}
          onQuickAction={handleQuickAction}
          favoriteCount={favoriteLinks.length}
          recentCount={recentLinks.length}
          popularCount={popularLinks.length}
        />

        {Object.entries(groupedLinks).map(([category, links]) => (
          <CategorySection
            key={category}
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
            onToggleFavorite={toggleFavorite}
            onEditLink={openModal}
            onCopyUrl={copyLinkUrl}
            onMouseEnter={setHoveredLink}
            onMouseLeave={() => setHoveredLink(null)}
            onDragStart={handleDragStart}
          />
        ))}

        {/* Enhanced Empty State */}
        {Object.keys(groupedLinks).length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce">🔗</div>
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {searchTerm || quickFilter !== 'all' ? 'No links found' : 'Your link collection awaits'}
            </h3>
            <p className={`mb-8 text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                  className={`px-6 py-3 text-lg transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
      </Button>

      {/* Hidden file input for import */}
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
        onDelete={handleDelete}
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