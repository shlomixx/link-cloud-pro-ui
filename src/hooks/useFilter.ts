import { useState } from 'react';

interface UseFilterReturn {
  filter: string;
  setFilter: (filter: string) => void;
  clearFilter: () => void;
}

const useFilter = (): UseFilterReturn => {
  const [filter, setFilter] = useState<string>('');

  const clearFilter = () => {
    setFilter('');
  };

  return {
    filter,
    setFilter,
    clearFilter,
  };
};

export default useFilter;