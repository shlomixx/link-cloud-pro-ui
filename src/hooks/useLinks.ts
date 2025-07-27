import { useState } from 'react';
import type { LinkData } from '@/types';

// Simple hook to provide links data - replace with actual data fetching logic
export default function useLinks() {
  const [links] = useState<LinkData[]>([]);
  const [isLoading] = useState(false);

  return {
    data: links,
    isLoading
  };
}