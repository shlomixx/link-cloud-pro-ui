import React from 'react';
import { BarChart3, MousePointer, Star, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  isDarkMode: boolean;
  totalLinks: number;
  totalClicks: number;
  favoriteCount: number;
  categoriesCount: number;
  isCompact?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  isDarkMode,
  totalLinks,
  totalClicks,
  favoriteCount,
  categoriesCount,
  isCompact = false
}) => {
  const stats = [
    {
      label: 'Total Links',
      value: totalLinks,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Clicks',
      value: totalClicks,
      icon: MousePointer,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Favorites',
      value: favoriteCount,
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Categories',
      value: categoriesCount,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  if (isCompact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-1">
            <stat.icon className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {stat.value}
            </span>
            {index < stats.length - 1 && (
              <span className={`mx-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>•</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <Card 
          key={stat.label}
          className={`transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-black/5 border-black/10 hover:bg-black/10'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};