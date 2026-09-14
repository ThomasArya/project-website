import { useCallback, useState } from 'react';
import storage from '../services/storage.tsx';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => storage.get(key, initialValue));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        storage.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, set] as const;
};

export default useLocalStorage;