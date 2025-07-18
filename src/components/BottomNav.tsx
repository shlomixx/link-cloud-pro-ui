import React from 'react';
import { Home, Leaf, Trophy, Users, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/learn', icon: Leaf, label: 'Learn' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around shadow-lg md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to;
        
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive 
                ? 'text-terra-green' 
                : 'text-terra-gray hover:text-terra-green'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};