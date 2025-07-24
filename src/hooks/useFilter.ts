import { useState, useCallback } from 'react';

interface UseFilterReturn {
  filter: string;
  setFilter: (filter: string) => void;
  clearFilter: () => void;
}

const useFilter = (): UseFilterReturn => {
  const [filter, setFilterState] = useState<string>('');

  const setFilter = useCallback((newFilter: string) => {
    setFilterState(newFilter);
  }, []);

  const clearFilter = useCallback(() => {
    setFilterState('');
  }, []);

  return {
    filter,
    setFilter,
    clearFilter
  };
};

export default useFilter;