import { describe, it, expect, vi, beforeEach } from "vitest";
import { downloadCsv } from "../csv";

describe("downloadCsv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("generates CSV with headers and rows", () => {
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const anchor = { href: "", download: "", click };
    vi.spyOn(document, "createElement").mockReturnValue(anchor as any);

    downloadCsv(
      "test.csv",
      ["name", "age"],
      [{ name: "Alice", age: "30" }, { name: "Bob", age: "25" }],
    );

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(anchor.download).toBe("test.csv");
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("escapes commas and quotes in cell values", () => {
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const anchor = { href: "", download: "", click };
    vi.spyOn(document, "createElement").mockReturnValue(anchor as any);

    downloadCsv(
      "test.csv",
      ["name", "note"],
      [{ name: 'Smith, John', note: 'Says "hello"' }],
    );

    const blobArg = createObjectURL.mock.calls[0][0] as Blob;
    const text = blobArg.text();
    return expect(text).resolves.toContain('"Smith, John"');
  });
});
