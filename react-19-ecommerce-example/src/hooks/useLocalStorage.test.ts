import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with initial value", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("should sync to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(localStorage.getItem("key")).toBe('"updated"');
  });

  it("should initialize from localStorage", () => {
    localStorage.setItem("key", '"stored"');

    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    expect(result.current[0]).toBe("stored");
  });

  it("should support updater function", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(JSON.parse(localStorage.getItem("counter")!)).toBe(1);
  });

  it("should work with objects", () => {
    const initial = { name: "Test", count: 0 };
    const { result } = renderHook(() => useLocalStorage("obj", initial));

    act(() => {
      result.current[1]({ name: "Updated", count: 1 });
    });

    expect(result.current[0]).toEqual({ name: "Updated", count: 1 });
  });

  it("should work with arrays", () => {
    const { result } = renderHook(() => useLocalStorage("arr", ["a", "b"]));

    act(() => {
      result.current[1](["a", "b", "c"]);
    });

    expect(result.current[0]).toEqual(["a", "b", "c"]);
  });
});
