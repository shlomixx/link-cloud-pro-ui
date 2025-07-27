import { useState } from 'react';

const useFilter = () => {
  const [filter, setFilter] = useState<string>('');

  return { filter, setFilter };
};

export default useFilter;