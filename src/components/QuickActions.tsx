import React from 'react';
import { Keyboard, Zap, Heart, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuickActionsProps {
  isDarkMode: boolean;
  onQuickAction: (action: string) => void;
  favoriteCount: number;
  recentCount: number;
  popularCount: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isDarkMode,
  onQuickAction,
  favoriteCount,
  recentCount,
  popularCount
}) => {
  const quickActions = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      count: favoriteCount,
      color: 'from-red-500 to-pink-500',
      shortcut: 'F'
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      count: recentCount,
      color: 'from-blue-500 to-cyan-500',
      shortcut: 'R'
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: TrendingUp,
      count: popularCount,
      color: 'from-green-500 to-emerald-500',
      shortcut: 'P'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
        <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          Quick Actions
        </h2>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {quickActions.map((action) => (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickAction(action.id)}
                  className={`relative group transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' 
                      : 'bg-black/5 border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                  {action.count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 text-xs ${
                        isDarkMode ? 'bg-white/20 text-white' : 'bg-black/20 text-slate-800'
                      }`}
                    >
                      {action.count}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-2">
                  <span>Show {action.label}</span>
                  <div className="flex items-center gap-1">
                    <Keyboard className="w-3 h-3" />
                    <span className="text-xs">Alt+{action.shortcut}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};