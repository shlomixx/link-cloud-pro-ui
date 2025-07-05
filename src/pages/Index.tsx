
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LinkData {
  key: string;
  name: string;
  url?: string;
  defaultUrl?: string;
  category: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'custom'
  });

  const [linksData, setLinksData] = useState<LinkData[]>([
    { key: 'google', name: 'Google', defaultUrl: 'https://www.google.com', category: 'tools' },
    { key: 'youtube', name: 'YouTube', defaultUrl: 'https://www.youtube.com', category: 'streaming' },
    { key: 'facebook', name: 'Facebook', defaultUrl: 'https://www.facebook.com', category: 'social' },
    { key: 'amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com', category: 'shopping' },
    { key: 'netflix', name: 'Netflix', defaultUrl: 'https://www.netflix.com', category: 'streaming' },
    { key: 'wikipedia', name: 'Wikipedia', defaultUrl: 'https://www.wikipedia.org', category: 'education' },
    { key: 'ynet', name: 'Ynet', defaultUrl: 'https://www.ynet.co.il', category: 'news' },
    { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chat.openai.com', category: 'ai' },
    { key: 'mail', name: 'Gmail', defaultUrl: 'https://mail.google.com', category: 'tools' },
    { key: 'spotify', name: 'Spotify', defaultUrl: 'https://www.spotify.com', category: 'streaming' },
    { key: 'instagram', name: 'Instagram', defaultUrl: 'https://www.instagram.com', category: 'social' },
    { key: 'twitter', name: 'Twitter', defaultUrl: 'https://www.twitter.com', category: 'social' },
    { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://www.linkedin.com', category: 'social' },
    { key: 'github', name: 'GitHub', defaultUrl: 'https://www.github.com', category: 'tools' },
    { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'tools' },
    { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social' },
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
    if (saved) {
      try {
        setLinksData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved links:', error);
      }
    }
  }, []);

  // Save to localStorage whenever linksData changes
  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  const filteredLinks = linksData.filter(link => 
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.url || link.defaultUrl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'custom';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, LinkData[]>);

  const openModal = (link?: LinkData) => {
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
        category: 'custom'
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

  const handleSave = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('Please fill in both name and URL');
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
        category: formData.category
      };
      setLinksData(prev => [...prev, newLink]);
    } else if (editingLink) {
      setLinksData(prev => prev.map(link => 
        link.key === editingLink.key
          ? { ...link, name: formData.name.trim(), url: url, category: formData.category }
          : link
      ));
    }

    closeModal();
  };

  const handleDelete = () => {
    if (editingLink && confirm('Are you sure you want to delete this link?')) {
      setLinksData(prev => prev.filter(link => link.key !== editingLink.key));
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Link Router Pro
              </h1>
              <p className="text-slate-300 text-sm">Your personal link management hub</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20"
                />
              </div>
              
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
          <div key={category} className="mb-8">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-1 w-12 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.custom} rounded-full`}></div>
              <h2 className="text-xl font-bold text-white">
                {categoryLabels[category as keyof typeof categoryLabels] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                {links.length}
              </Badge>
            </div>

            {/* Improved Links Grid - More compact and organized */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {links.map((link) => (
                <Card 
                  key={link.key} 
                  className="group bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                >
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center space-y-2">
                      {/* Favicon */}
                      <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center">
                        <img
                          src={getFaviconUrl(link.url || link.defaultUrl || '')}
                          alt=""
                          className="w-6 h-6 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      
                      {/* Link Name */}
                      <div className="w-full">
                        <h3 className="font-medium text-white text-xs truncate group-hover:text-purple-200 transition-colors">
                          {link.name}
                        </h3>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 w-full">
                        <Button
                          variant="ghost"
                          asChild
                          size="sm"
                          className="flex-1 h-7 px-2 hover:bg-white/10 text-xs"
                        >
                          <a
                            href={link.url || link.defaultUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <span className="text-slate-300 group-hover:text-white transition-colors">
                              Open
                            </span>
                          </a>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(link);
                          }}
                          className="h-7 w-7 p-0 hover:bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedLinks).length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">No links found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first link to get started'}
            </p>
            <Button onClick={() => openModal()} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isNewLink ? 'Add New Link' : 'Edit Link'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">Link Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Google"
                className="mt-1 bg-slate-800 border-slate-600 text-white focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="url" className="text-slate-300">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="mt-1 bg-slate-800 border-slate-600 text-white focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-slate-300">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-white focus:bg-slate-700">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
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
              <Button variant="outline" onClick={closeModal} className="border-slate-600 text-white hover:bg-slate-800">
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
