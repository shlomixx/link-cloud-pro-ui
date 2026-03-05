import React, { useState, useEffect } from 'react';

export function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('pokilo_theme') === 'dark' ||
      (!localStorage.getItem('pokilo_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('pokilo_theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <button
      className="dark-toggle"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
