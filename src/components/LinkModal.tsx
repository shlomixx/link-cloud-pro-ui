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
  
  clicks?: number;
  createdAt?: string;
  isFavorite?: boolean;
  lastClicked?: string;
}

interface FormData {
  name: string;
  url: string;
  category: string;
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
      <DialogContent className="max-w-md transition-all duration-300 bg-white border-gray-200 text-gray-900 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isNewLink ? 'Add New Link' : 'Edit Link'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isNewLink 
              ? 'Create a new link for your collection'
              : 'Update your link details'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="basic" className="transition-all duration-300">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced" className="transition-all duration-300">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-gray-800">
                Link Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                placeholder="e.g., Google"
                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="url" className="text-gray-800">
                URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => onFormDataChange({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-gray-800">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border-gray-200 shadow-md">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="transition-all duration-300 text-gray-900 focus:bg-gray-100">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between pt-4">
          <div>
            {!isNewLink && (
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 text-white"
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
              className="transition-all duration-300 hover:scale-105 border-gray-300 text-gray-800 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSave} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105"
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