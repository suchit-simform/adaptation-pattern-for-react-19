import { useState, useCallback } from "react";

export interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Hook for managing async operations
 */
export function useAsync<T>(initialValue: T | null = null) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: initialValue,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const result = await asyncFunction();
      setState({ data: result, error: null, isLoading: false });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, error: err, isLoading: false });
      throw err;
    }
  }, []);

  return {
    ...state,
    execute,
  };
}
