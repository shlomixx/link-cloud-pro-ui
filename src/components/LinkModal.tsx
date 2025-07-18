
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNewLink: boolean;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSave: () => void;
  onDelete: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  categoryLabels: Record<string, string>;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  isNewLink,
  formData,
  onFormDataChange,
  onSave,
  onDelete,
  isLoading,
  isDarkMode,
  categoryLabels
}) => {
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; url?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Link name is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md transition-all duration-300 bg-popover border backdrop-blur-sm animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isNewLink ? 'Add New Link' : 'Edit Link'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isNewLink 
              ? 'Create a new link for your collection'
              : 'Update your link details'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="basic" className="transition-all duration-300">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced" className="transition-all duration-300">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Link Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  onFormDataChange({ ...formData, name: e.target.value });
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g., Google"
                className={cn(
                  "mt-1 transition-all duration-300 focus-ring",
                  errors.name && "border-destructive"
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="url" className="text-foreground">
                URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => {
                  onFormDataChange({ ...formData, url: e.target.value });
                  if (errors.url) setErrors(prev => ({ ...prev, url: undefined }));
                }}
                placeholder="https://example.com"
                className={cn(
                  "mt-1 transition-all duration-300 focus-ring",
                  errors.url && "border-destructive"
                )}
              />
              {errors.url && (
                <p className="text-xs text-destructive mt-1">{errors.url}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="category" className="text-foreground">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1 transition-all duration-300 focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover border backdrop-blur-sm">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem 
                      key={key} 
                      value={key} 
                      className="transition-all duration-300 hover-lift"
                    >
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
                onCheckedChange={(checked) => onFormDataChange({ ...formData, isPrivate: checked })}
              />
              <Label htmlFor="private" className="text-foreground">
                Private Link
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Private links are only visible when "Show Private Links" is enabled.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between pt-4">
          <div>
            {!isNewLink && (
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90 transition-all duration-300 hover-lift"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading}
              className="transition-all duration-300 hover-lift"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 transition-all duration-300 hover-lift"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : null}
              {isNewLink ? 'Add Link' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
