import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Heart, History, Calendar, Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkData } from '@/types';

interface PersonalizedDashboardProps {
  links: LinkData[];
  isDarkMode: boolean;
  onLinkClick: (link: LinkData) => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  links,
  isDarkMode,
  onLinkClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, [currentTime]);

  const favoriteLinks = links.filter(link => link.isFavorite);
  const mostUsedLinks = links
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 6);
  const recentLinks = links
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const avgClicksPerDay = Math.round(totalClicks / 30);

  return (
    <div className="hidden lg:block w-full max-w-7xl mx-auto mb-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {greeting}! 👋
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Ready to be productive today?
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold gradient-text">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentTime.toLocaleDateString([], { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <Card className="card-gradient p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Total Links
              </span>
              <Badge variant="secondary">{links.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Favorites
              </span>
              <Badge variant="secondary">{favoriteLinks.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Total Clicks
              </span>
              <Badge variant="secondary">{totalClicks}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Daily Average
              </span>
              <Badge variant="secondary">{avgClicksPerDay}</Badge>
            </div>
          </div>
        </Card>

        {/* Favorite Links */}
        <Card className="card-gradient p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold">Favorites</h3>
          </div>
          <div className="space-y-2">
            {favoriteLinks.slice(0, 4).map((link) => (
              <div
                key={link.key}
                onClick={() => onLinkClick(link)}
                className={`
                  flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all
                  ${isDarkMode 
                    ? 'hover:bg-slate-700/50' 
                    : 'hover:bg-slate-100/50'
                  }
                `}
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${link.defaultUrl || link.url}`}
                  alt=""
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {link.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {link.clicks || 0} clicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Most Used */}
        <Card className="card-gradient p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-5 w-5 text-green-400" />
            <h3 className="font-semibold">Most Used</h3>
          </div>
          <div className="space-y-2">
            {mostUsedLinks.slice(0, 4).map((link) => (
              <div
                key={link.key}
                onClick={() => onLinkClick(link)}
                className={`
                  flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all
                  ${isDarkMode 
                    ? 'hover:bg-slate-700/50' 
                    : 'hover:bg-slate-100/50'
                  }
                `}
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${link.defaultUrl || link.url}`}
                  alt=""
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {link.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {link.clicks || 0} clicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-gradient p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-purple-400" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentLinks.map((link) => (
            <div
              key={link.key}
              onClick={() => onLinkClick(link)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                ${isDarkMode 
                  ? 'hover:bg-slate-700/50' 
                  : 'hover:bg-slate-100/50'
                }
              `}
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${link.defaultUrl || link.url}`}
                alt=""
                className="w-5 h-5 rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {link.name}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {new Date(link.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};