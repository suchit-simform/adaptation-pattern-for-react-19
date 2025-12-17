import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOptimisticUpdate } from "./useOptimisticUpdate";

describe("useOptimisticUpdate", () => {
  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useOptimisticUpdate("initial"));

    expect(result.current.value).toBe("initial");
    expect(result.current.isOptimistic).toBe(false);
  });

  it("should start optimistic update", () => {
    const { result } = renderHook(() => useOptimisticUpdate("initial"));

    act(() => {
      result.current.startOptimisticUpdate("updated");
    });

    expect(result.current.value).toBe("updated");
    expect(result.current.isOptimistic).toBe(true);
  });

  it("should confirm update", () => {
    const { result } = renderHook(() => useOptimisticUpdate("initial"));

    act(() => {
      result.current.startOptimisticUpdate("updated");
    });

    act(() => {
      result.current.confirmUpdate();
    });

    expect(result.current.value).toBe("updated");
    expect(result.current.isOptimistic).toBe(false);
  });

  it("should revert update", () => {
    const { result } = renderHook(() => useOptimisticUpdate("initial"));

    act(() => {
      result.current.startOptimisticUpdate("updated");
    });

    act(() => {
      result.current.revertUpdate();
    });

    expect(result.current.value).toBe("initial");
    expect(result.current.isOptimistic).toBe(false);
  });

  it("should handle multiple updates", () => {
    const { result } = renderHook(() => useOptimisticUpdate(0));

    act(() => {
      result.current.startOptimisticUpdate(1);
    });

    act(() => {
      result.current.confirmUpdate();
    });

    act(() => {
      result.current.startOptimisticUpdate(2);
    });

    expect(result.current.value).toBe(2);
    expect(result.current.isOptimistic).toBe(true);
  });

  it("should work with objects", () => {
    const initial = { count: 0 };
    const { result } = renderHook(() => useOptimisticUpdate(initial));

    const updated = { count: 1 };

    act(() => {
      result.current.startOptimisticUpdate(updated);
    });

    expect(result.current.value).toEqual(updated);
    expect(result.current.isOptimistic).toBe(true);

    act(() => {
      result.current.revertUpdate();
    });

    expect(result.current.value).toEqual(initial);
  });
});
