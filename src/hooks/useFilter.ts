import { useState } from 'react';

// Simple hook to manage filter state
export default function useFilter() {
  const [filter, setFilter] = useState<string>('');

  return {
    filter,
    setFilter
  };
}