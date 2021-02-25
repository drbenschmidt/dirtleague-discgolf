import { useMemo } from 'react';

export default function useOnce<T>(fn: () => T): T {
  return useMemo(fn, [fn]);
}
