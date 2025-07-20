import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + K', action: 'Focus search' },
    { key: 'Ctrl/Cmd + N', action: 'Add new link' },
    { key: 'Ctrl/Cmd + G', action: 'Switch view mode' },
    { key: 'Ctrl/Cmd + H', action: 'Toggle compact header' },
    { key: 'Alt + F', action: 'Show favorites' },
    { key: 'Alt + R', action: 'Show recent links' },
    { key: 'Alt + P', action: 'Show popular links' },
    { key: 'Escape', action: 'Close modal/Clear search' },
    { key: '?', action: 'Show keyboard shortcuts' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900/95 border-slate-700 text-white backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-300">
                {shortcut.action}
              </span>
              <Badge 
                variant="outline" 
                className="font-mono text-xs border-slate-600 text-slate-300"
              >
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-slate-600 text-white hover:bg-slate-800/50"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};