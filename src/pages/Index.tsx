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

  // ... (rest of the functions remain the same)

  // ... (return statement JSX)

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
      
      {/* ... (rest of the JSX, but update component calls) */}
      
      <main className="container mx-auto px-6 py-2">
        {/* ... */}
        <CategorySection
          // ... other props
          isDarkMode={true}
          // ... other props
        />
        {/* ... */}
      </main>

      {/* ... */}
      
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