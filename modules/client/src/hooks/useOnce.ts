import { useMemo } from 'react';

export default function useOnce<T>(fn: () => T): T {
  // NOTE: Don't trust this error, we want it to never fire again, hence the name.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(fn, []);
}
