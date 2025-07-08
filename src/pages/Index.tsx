
import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { QuickActions } from '@/components/QuickActions';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { LinkModal } from '@/components/LinkModal';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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

interface Category {
  name: string;
  links: LinkData[];
}

const initialLinks: { [key: string]: LinkData } = {
  '1': {
    key: '1',
    name: 'Google',
    url: 'https://www.google.com',
    category: 'Search',
    isFavorite: true,
  },
  '2': {
    key: '2',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    category: 'Videos',
    isPrivate: false,
  },
  '3': {
    key: '3',
    name: 'Twitter',
    defaultUrl: 'https://www.twitter.com',
    category: 'Social',
    isFavorite: true,
  },
};

const initialCategories = ['Search', 'Videos', 'Social'];

const Index = () => {
  const [links, setLinks] = useState<{ [key: string]: LinkData }>(initialLinks);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact' | 'dense'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const handleAddLink = (link: Omit<LinkData, 'key'>) => {
    const key = uuidv4();
    const newLink = { ...link, key };
    setLinks((prevLinks) => ({ ...prevLinks, [key]: newLink }));
    setIsModalOpen(false);
    toast({
      title: 'Link added',
      description: `${link.name} has been added to your links.`,
    });
  };

  const handleUpdateLink = (updatedLink: LinkData) => {
    setLinks((prevLinks) => ({ ...prevLinks, [updatedLink.key]: updatedLink }));
    setIsModalOpen(false);
    setEditingLink(null);
    toast({
      title: 'Link updated',
      description: `${updatedLink.name} has been updated.`,
    });
  };

  const handleDeleteLink = (key: string) => {
    setLinks((prevLinks) => {
      const { [key]: deletedLink, ...rest } = prevLinks;
      toast({
        title: 'Link deleted',
        description: `${deletedLink.name} has been deleted.`,
      });
      return rest;
    });
  };

  const handleEditLink = (link: LinkData) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleLinkClick = (link: LinkData) => {
    setClickedLink(link.key);
    setTimeout(() => {
      setClickedLink(null);
    }, 200);
  };

  const handleToggleFavorite = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setLinks((prevLinks) => ({
      ...prevLinks,
      [key]: { ...prevLinks[key], isFavorite: !prevLinks[key].isFavorite },
    }));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied',
      description: 'The URL has been copied to your clipboard.',
    });
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prevCategories) => [...prevCategories, category]);
      toast({
        title: 'Category added',
        description: `${category} has been added to your categories.`,
      });
    }
  };

  const handleChangeCategory = (linkKey: string, newCategory: string) => {
    setLinks((prevLinks) => ({
      ...prevLinks,
      [linkKey]: { ...prevLinks[linkKey], category: newCategory },
    }));
    toast({
      title: 'Category changed',
      description: `The category has been changed.`,
    });
  };

  const filteredLinks = Object.values(links)
    .filter((link) => link.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((acc: { [key: string]: LinkData[] }, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    }, {});

  const filteredCategories = categories.filter((category) => Object.keys(filteredLinks).includes(category));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Enhanced background effects for desktop */}
      <div className="fixed inset-0 opacity-30 pointer-events-none hidden md:block">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-secondary rounded-full blur-3xl opacity-15 animate-pulse animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-accent rounded-full blur-3xl opacity-10 animate-pulse animation-delay-400"></div>
      </div>

      {/* Floating particles effect for desktop */}
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <AppHeader 
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenLinkModal={() => setIsModalOpen(true)}
        />

        {/* Enhanced main content with improved spacing for desktop */}
        <main className="container mx-auto px-4 py-6 md:py-12 space-y-8 md:space-y-16">
          {/* Enhanced hero section for desktop */}
          <div className="text-center space-y-4 md:space-y-8 hidden md:block">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-enhanced gradient-text animate-fade-in">
                Link Manager
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
                Organize and access your favorite links with style and efficiency
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-400">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  {Object.values(links).length} Links
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
                <span className="text-sm text-muted-foreground">
                  {categories.length} Categories
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced quick actions with better layout for desktop */}
          <div className="w-full">
            <QuickActions 
              isDarkMode={isDarkMode}
              onOpenLinkModal={() => setIsModalOpen(true)}
              categories={categories}
              onAddCategory={handleAddCategory}
            />
          </div>

          {/* Enhanced categories section with improved animations */}
          <div className="space-y-8 md:space-y-12">
            {filteredCategories.map((category, index) => (
              <div 
                key={category}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategorySection
                  category={category}
                  links={filteredLinks[category] || []}
                  viewMode={viewMode}
                  isDarkMode={isDarkMode}
                  hoveredLink={hoveredLink}
                  clickedLink={clickedLink}
                  categories={categories}
                  onMouseEnter={setHoveredLink}
                  onMouseLeave={() => setHoveredLink(null)}
                  onLinkClick={handleLinkClick}
                  onToggleFavorite={handleToggleFavorite}
                  onEditLink={handleEditLink}
                  onCopyUrl={handleCopyUrl}
                  onDeleteLink={handleDeleteLink}
                  onChangeCategory={handleChangeCategory}
                  onAddLink={() => setIsModalOpen(true)}
                />
              </div>
            ))}
          </div>

          {/* Enhanced empty state for desktop */}
          {Object.keys(filteredLinks).length === 0 && (
            <div className="text-center py-16 md:py-32 space-y-6 animate-fade-in">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-card flex items-center justify-center backdrop-blur-sm">
                <div className="text-4xl md:text-5xl">🔗</div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold text-category">
                  No links found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first link to get organized'}
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Enhanced floating action button for desktop */}
        <div className="fixed bottom-8 right-8 hidden md:block">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-16 h-16 rounded-full btn-gradient shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">+</span>
          </button>
        </div>

        {/* Enhanced keyboard shortcuts with better styling */}
        <KeyboardShortcuts 
          isOpen={isKeyboardShortcutsOpen}
          onClose={() => setIsKeyboardShortcutsOpen(false)}
          isDarkMode={isDarkMode}
        />

        {/* Enhanced modal */}
        <LinkModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLink(null);
          }}
          isNewLink={!editingLink}
          formData={{
            name: editingLink?.name || '',
            url: editingLink?.url || editingLink?.defaultUrl || '',
            category: editingLink?.category || categories[0] || '',
            isPrivate: editingLink?.isPrivate || false,
          }}
          onFormDataChange={() => {}} // This will be handled by the modal internally
          onSave={() => {
            // This will be handled by the modal internally
          }}
          onDelete={() => {
            if (editingLink) {
              handleDeleteLink(editingLink.key);
              setIsModalOpen(false);
              setEditingLink(null);
            }
          }}
          isLoading={false}
          isDarkMode={isDarkMode}
          categoryLabels={categories.reduce((acc, cat) => ({ ...acc, [cat]: cat }), {})}
        />
      </div>
    </div>
  );
};

export default Index;
