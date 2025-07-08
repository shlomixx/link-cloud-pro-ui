import React from 'react';
import { Heart, Clock, TrendingUp, Star, Zap, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DesktopQuickActionsProps {
  isDarkMode: boolean;
  onQuickAction: (action: string) => void;
  favoriteCount: number;
  recentCount: number;
  popularCount: number;
  viewMode: 'grid' | 'list' | 'compact';
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void;
}

export const DesktopQuickActions: React.FC<DesktopQuickActionsProps> = ({
  isDarkMode,
  onQuickAction,
  favoriteCount,
  recentCount,
  popularCount,
  viewMode,
  onViewModeChange
}) => {
  const quickActions = [
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      count: favoriteCount,
      gradient: 'from-red-500 to-pink-500',
      shadow: 'shadow-red-500/25'
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: Clock,
      count: recentCount,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/25'
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: TrendingUp,
      count: popularCount,
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-500/25'
    }
  ];

  const viewModes = [
    { id: 'compact', label: 'Compact', icon: Zap },
    { id: 'grid', label: 'Grid', icon: Grid },
    { id: 'list', label: 'List', icon: List }
  ];

  return (
    <div className="hidden md:block fixed top-24 right-6 z-40 space-y-4">
      {/* Quick Actions Card */}
      <Card className={`p-4 desktop-card ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-white/20'
      } backdrop-blur-xl shadow-2xl`}>
        <div className="space-y-3">
          <h3 className={`text-sm font-semibold ${
            isDarkMode ? 'text-white/90' : 'text-slate-800'
          }`}>
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={() => onQuickAction(action.id)}
                variant="ghost"
                className={`w-full h-14 flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105 group ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-white/80' 
                    : 'hover:bg-black/10 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center ${action.shadow} shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      {action.count} items
                    </div>
                  </div>
                </div>
                
                <div className={`text-xl font-bold ${
                  isDarkMode ? 'text-white/60' : 'text-slate-400'
                } transition-all duration-300 group-hover:text-white`}>
                  {action.count}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* View Mode Card */}
      <Card className={`p-4 desktop-card ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-white/20'
      } backdrop-blur-xl shadow-2xl`}>
        <div className="space-y-3">
          <h3 className={`text-sm font-semibold ${
            isDarkMode ? 'text-white/90' : 'text-slate-800'
          }`}>
            View Mode
          </h3>
          
          <div className="space-y-1">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id as 'grid' | 'list' | 'compact')}
                variant={viewMode === mode.id ? 'default' : 'ghost'}
                className={`w-full h-12 flex items-center justify-start gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                  viewMode === mode.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : isDarkMode 
                      ? 'hover:bg-white/10 text-white/80' 
                      : 'hover:bg-black/10 text-slate-700'
                }`}
              >
                <mode.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Card */}
      <Card className={`p-4 desktop-card ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-white/20'
      } backdrop-blur-xl shadow-2xl`}>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className={`text-sm font-medium ${
            isDarkMode ? 'text-white/90' : 'text-slate-800'
          }`}>
            Pro Features
          </div>
          <div className={`text-xs ${
            isDarkMode ? 'text-white/50' : 'text-slate-500'
          }`}>
            Enhanced Desktop
          </div>
        </div>
      </Card>
    </div>
  );
};