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
  const [sortBy, setSortBy] = useState<SortBy>('custom');
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
    // ... (Your links data remains unchanged)
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

  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    setTimeout(() => {
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
          setViewMode(settings.viewMode ?? 'compact');
          setSortBy(settings.sortBy ?? 'custom');
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
    const settings = { viewMode, sortBy, showPrivateLinks, isCompactHeader };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    document.documentElement.classList.add('dark');
  }, [viewMode, sortBy, showPrivateLinks, isCompactHeader]);

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
  }, [viewMode, isModalOpen, searchTerm, isCompactHeader, showShortcuts]);
  
  // All other functions like handleLinkClick, handleDeleteLink, etc. need to be here.
  // The following functions were missing in the previous version I sent.
  
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

  return (
    <div className={`min-h-screen transition-all duration-500 bg-background`}>
      <AppHeader
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
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
                isDarkMode={true}
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
            {/* ... JSX for empty state ... */}
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
        isDarkMode={true}
        categoryLabels={categoryLabels}
      />

      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

export default Index;