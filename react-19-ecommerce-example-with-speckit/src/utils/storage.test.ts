import { describe, it, expect, beforeEach, vi } from "vitest";
import { getFromStorage, setToStorage, removeFromStorage } from "./storage";

describe("Storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("setToStorage and getFromStorage", () => {
    it("should store and retrieve string", () => {
      setToStorage("test-key", "test-value");
      const result = getFromStorage("test-key", "");

      expect(result).toBe("test-value");
    });

    it("should store and retrieve object", () => {
      const data = { name: "Test", value: 123 };
      setToStorage("test-obj", data);
      const result = getFromStorage("test-obj", {});

      expect(result).toEqual(data);
    });

    it("should store and retrieve array", () => {
      const data = [1, 2, 3];
      setToStorage("test-arr", data);
      const result = getFromStorage("test-arr", []);

      expect(result).toEqual(data);
    });

    it("should return default value for missing key", () => {
      const result = getFromStorage("missing-key", "default");

      expect(result).toBe("default");
    });

    it("should return default value on parse error", () => {
      localStorage.setItem("bad-key", "not json {");
      const result = getFromStorage("bad-key", "default");

      expect(result).toBe("default");
    });

    it("should handle null safely", () => {
      setToStorage("null-key", null);
      const result = getFromStorage("null-key", "default");

      expect(result).toBeNull();
    });
  });

  describe("removeFromStorage", () => {
    it("should remove item from storage", () => {
      setToStorage("remove-key", "value");
      removeFromStorage("remove-key");
      const result = getFromStorage("remove-key", "default");

      expect(result).toBe("default");
    });

    it("should handle removing non-existent key", () => {
      expect(() => removeFromStorage("non-existent")).not.toThrow();
    });
  });
});
