import { describe, expect, it, vi } from "vitest";

import { NativeWebMcpAdapter } from "../../src/webmcp/nativeAdapter";
import type { WebMcpTool } from "../../src/webmcp/port";

const tool: WebMcpTool = {
  name: "equaltrace_test_tool",
  title: "Test tool",
  description: "A bounded adapter test tool.",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  execute: async () => ({ content: [{ type: "text", text: "ok" }] }),
};

describe("NativeWebMcpAdapter", () => {
  it("reports unsupported without creating a modelContext polyfill", async () => {
    const ownerDocument = {} as Document;
    const adapter = new NativeWebMcpAdapter(ownerDocument);

    expect(adapter.available).toBe(false);
    await expect(adapter.registerTool(tool)).rejects.toThrow(/unavailable/i);
    expect(ownerDocument.modelContext).toBeUndefined();
  });

  it("forwards the current tool and registration AbortSignal", async () => {
    const registerTool = vi.fn(async () => undefined);
    const ownerDocument = {
      modelContext: { registerTool },
    } as unknown as Document;
    const adapter = new NativeWebMcpAdapter(ownerDocument);
    const controller = new AbortController();

    expect(adapter.available).toBe(true);
    await adapter.registerTool(tool, { signal: controller.signal });

    expect(registerTool).toHaveBeenCalledWith(tool, {
      signal: controller.signal,
    });
  });
});
