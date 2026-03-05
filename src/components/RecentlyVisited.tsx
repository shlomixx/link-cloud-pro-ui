import React, { useState, useEffect } from 'react';

interface VisitedLink { name: string; url: string; favicon: string; ts: number; }

export function RecentlyVisited() {
  const [items, setItems] = useState<VisitedLink[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pokilo_visited') || '[]');
      setItems(saved.slice(0, 8));
    } catch {}
  }, []);
  if (items.length === 0) return null;
  return (
    <div className="recently-visited-row">
      <h4>Recently visited</h4>
      <div className="rv-items">
        {items.map((item) => (
          <a key={item.url} href={item.url} className="rv-item" target="_blank" rel="noopener noreferrer">
            <img src={item.favicon} alt={item.name} onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function trackVisit(name: string, url: string, favicon: string) {
  try {
    const saved: VisitedLink[] = JSON.parse(localStorage.getItem('pokilo_visited') || '[]');
    const filtered = saved.filter(i => i.url !== url);
    filtered.unshift({ name, url, favicon, ts: Date.now() });
    localStorage.setItem('pokilo_visited', JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}
