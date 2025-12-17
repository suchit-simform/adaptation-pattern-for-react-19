import { useState, useCallback } from "react";

/**
 * Hook for optimistic UI updates
 * Allows immediate feedback while waiting for server response
 */
export function useOptimisticUpdate<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [previousValue, setPreviousValue] = useState(initialValue);

  const startOptimisticUpdate = useCallback(
    (newValue: T) => {
      setPreviousValue(value);
      setValue(newValue);
      setIsOptimistic(true);
    },
    [value]
  );

  const confirmUpdate = useCallback(() => {
    setIsOptimistic(false);
  }, []);

  const revertUpdate = useCallback(() => {
    setValue(previousValue);
    setIsOptimistic(false);
  }, [previousValue]);

  return {
    value,
    isOptimistic,
    startOptimisticUpdate,
    confirmUpdate,
    revertUpdate,
  };
}
