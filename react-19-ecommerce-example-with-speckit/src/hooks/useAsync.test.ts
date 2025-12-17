import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsync } from "./useAsync";

describe("useAsync", () => {
  it("should initialize with null data", () => {
    const { result } = renderHook(() => useAsync<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should execute async function", async () => {
    const { result } = renderHook(() => useAsync<string>());

    const asyncFn = () => Promise.resolve("result");

    await act(async () => {
      await result.current.execute(asyncFn);
    });

    expect(result.current.data).toBe("result");
    expect(result.current.isLoading).toBe(false);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useAsync<string>("initial"));

    expect(result.current.data).toBe("initial");
  });

  it("should handle multiple executions", async () => {
    const { result } = renderHook(() => useAsync<number>());

    await act(async () => {
      await result.current.execute(() => Promise.resolve(1));
    });

    expect(result.current.data).toBe(1);

    await act(async () => {
      await result.current.execute(() => Promise.resolve(2));
    });

    expect(result.current.data).toBe(2);
  });
});
