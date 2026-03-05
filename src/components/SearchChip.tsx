import React, { useMemo } from 'react';

interface Props {
  query: string;
  links: any[];
  onClear: () => void;
}

export function SearchChip({ query, links, onClear }: Props) {
  const match = useMemo(() => {
    try {
      if (!query || !links || !links.length) return null;
      const q = query.toLowerCase().trim();
      if (!q) return null;
      return links.find(l =>
        l && l.name && l.name.toLowerCase().includes(q)
      ) || null;
    } catch { return null; }
  }, [query, links]);

  if (!query || !query.trim()) return null;

  const handleClick = () => {
    if (match && match.url) {
      window.open(match.url, '_blank');
    } else {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
    }
    onClear();
  };

  return (
    <div style={{ margin: '8px 0 0 0', textAlign: 'center' }}>
      <button
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          background: match ? '#22c55e' : '#3b82f6',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {match
          ? 'Open ' + match.name + ' ↵'
          : 'Search Google: ' + query + ' ↵'
        }
      </button>
    </div>
  );
}
