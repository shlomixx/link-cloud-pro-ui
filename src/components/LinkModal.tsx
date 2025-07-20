import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  categoryLabels
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md transition-all duration-300 bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isNewLink ? 'Add New Link' : 'Edit Link'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isNewLink 
              ? 'Create a new link for your collection'
              : 'Update your link details'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="basic" className="transition-all duration-300">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced" className="transition-all duration-300">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">
                Link Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                placeholder="e.g., Google"
                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 bg-slate-800/50 border-slate-600 text-white focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="url" className="text-slate-300">
                URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => onFormDataChange({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 bg-slate-800/50 border-slate-600 text-white focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-slate-300">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 bg-slate-800/50 border-slate-600 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-slate-800/95 border-slate-600 backdrop-blur-sm">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="transition-all duration-300 text-white focus:bg-slate-700/50">
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
              <Label htmlFor="private" className="text-slate-300">
                Private Link
              </Label>
            </div>
            <p className="text-sm text-slate-400">
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
                className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
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
              className="transition-all duration-300 hover:scale-105 border-slate-600 text-white hover:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSave} 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
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