import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  editingLink: LinkData | null;
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
  editingLink,
  formData,
  onFormDataChange,
  onSave,
  onDelete,
  isLoading,
  isDarkMode,
  categoryLabels
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isDarkMode ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm' : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-sm'}`}>
        <DialogHeader>
          <DialogTitle>{isNewLink ? 'הוסף לינק חדש' : 'ערוך לינק'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">כללי</TabsTrigger>
            <TabsTrigger value="advanced">מתקדם</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם</Label>
                <Input id="name" value={formData.name} onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" value={formData.url} onChange={(e) => onFormDataChange({ ...formData, url: e.target.value })} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה</Label>
                <Select value={formData.category} onValueChange={(value) => onFormDataChange({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isPrivate" checked={formData.isPrivate} onCheckedChange={(checked) => onFormDataChange({ ...formData, isPrivate: checked })} />
                <Label htmlFor="isPrivate">לינק פרטי</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <div>
            {!isNewLink && editingLink && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${isDarkMode ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm' : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-sm'}`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Are you sure you want to delete &quot;{editingLink.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className={`transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'border-slate-600 text-white hover:bg-slate-800/50' 
                          : 'border-slate-300 text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className={`transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'border-slate-600 text-white hover:bg-slate-800/50' 
                  : 'border-slate-300 text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              בטל
            </Button>
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : null}
              {isNewLink ? 'שמור לינק' : 'שמור שינויים'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};