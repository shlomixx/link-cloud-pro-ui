import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkModal } from '@/components/LinkModal';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { useLinks } from '@/hooks/useLinks';
import { useSettings } from '@/hooks/useSettings';
import { LinkData, FormData, ViewMode, SortBy } from '@/types';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Use custom hooks
  const {
    linksData,
    categoryOrder,
    addLink,
    updateLink,
    deleteLink,
    incrementClicks,
    toggleFavorite,
    sortLinks,
    exportData,
    importData,
  } = useLinks();

  const {
    isDarkMode,
    viewMode,
    sortBy,
    showPrivateLinks,
    isCompactHeader,
    linkSize,
    updateSetting,
  } = useSettings();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'custom',
    isPrivate: false
  });

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

  // Keyboard shortcuts
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
            updateSetting('viewMode', nextMode);
            toast.success(`Switched to ${nextMode} view`);
            break;
          case 'd':
            e.preventDefault();
            updateSetting('isDarkMode', !isDarkMode);
            toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
            break;
          case 'h':
            e.preventDefault();
            updateSetting('isCompactHeader', !isCompactHeader);
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
  }, [viewMode, isDarkMode, isModalOpen, searchTerm, isCompactHeader, showShortcuts, updateSetting]);

  // Sort links when sortBy changes
  useEffect(() => {
    sortLinks(sortBy);
  }, [sortBy, sortLinks]);

  const handleQuickAction = (action: string) => {
    setQuickFilter(action);
    switch (action) {
      case 'recent':
        updateSetting('sortBy', 'recent');
        toast.success('Showing recent links');
        break;
      case 'popular':
        updateSetting('sortBy', 'clicks');
        toast.success('Showing popular links');
        break;
      default:
        updateSetting('sortBy', 'name');
        setQuickFilter('all');
    }
  };

  const handleLinkClick = (link: LinkData) => {
    setClickedLink(link.key);
    
    incrementClicks(link.key);

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
      addLink({
        name: formData.name.trim(),
        url: url,
        category: formData.category,
        isPrivate: formData.isPrivate,
      });
    } else if (editingLink) {
      updateLink(editingLink.key, {
        name: formData.name.trim(),
        url: url,
        category: formData.category,
        isPrivate: formData.isPrivate
      });
    }

    setIsLoading(false);
    closeModal();
  };

  const handleDeleteLink = (linkKey: string) => {
    deleteLink(linkKey);
  };

  const handleToggleFavorite = (linkKey: string) => {
    toggleFavorite(linkKey);
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
        updateSetting('sortBy', 'custom');
        updateLink(parsed.key, { category: targetCategory });
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
      
      updateSetting('sortBy', 'custom');
      addLink({
        name: name,
        url: url,
        category: targetCategory,
        isPrivate: false,
      });
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
    updateSetting('sortBy', 'custom');
    // Handle reordering logic here
    toast.success('Link reordered!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
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

  const getCompatibleViewMode = (mode: ViewMode): "grid" | "list" | "compact" | "dense" => {
    return mode;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 bg-background`}>
      <AppHeader
        viewMode={getCompatibleViewMode(viewMode)}
        onViewModeChange={(mode) => updateSetting('viewMode', mode as ViewMode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => updateSetting('isDarkMode', !isDarkMode)}
        showPrivateLinks={showPrivateLinks}
        onTogglePrivateLinks={() => updateSetting('showPrivateLinks', !showPrivateLinks)}
        onExportData={exportData}
        onImportData={() => fileInputRef.current?.click()}
        onAddLink={() => openModal()}
        onShowShortcuts={() => setShowShortcuts(true)}
        fileInputRef={fileInputRef}
        linkSize={linkSize}
        onLinkSizeChange={(size) => updateSetting('linkSize', size)}
      />

      <main className="container mx-auto px-6">
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
                    updateSetting('sortBy', 'name');
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
        onChange={handleImportData}
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