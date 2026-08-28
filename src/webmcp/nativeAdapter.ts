import type { WebMcpPort, WebMcpRegistrationOptions, WebMcpTool } from "./port";

export class NativeWebMcpAdapter implements WebMcpPort {
  readonly provenance = "native" as const;

  constructor(private readonly ownerDocument: Document) {}

  get available() {
    return typeof this.ownerDocument.modelContext?.registerTool === "function";
  }

  async registerTool(tool: WebMcpTool, options?: WebMcpRegistrationOptions) {
    const modelContext = this.ownerDocument.modelContext;
    if (typeof modelContext?.registerTool !== "function") {
      throw new Error("Native WebMCP is unavailable in this browser.");
    }

    await modelContext.registerTool(tool, options);
  }
}
