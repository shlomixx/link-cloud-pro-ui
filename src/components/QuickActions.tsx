import React from 'react';
import { Heart, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      count: recentCount,
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: TrendingUp,
      count: popularCount,
    }
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={() => onQuickAction(action.id)}
            className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-black/10'
            }`}
          >
            <action.icon className="w-4 h-4 mr-1" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};