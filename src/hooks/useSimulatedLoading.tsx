import { useEffect, useState } from 'react';

export const useSimulatedLoading = (delay = 700): boolean => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return loading;
};

export default useSimulatedLoading;