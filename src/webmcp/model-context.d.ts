import type { WebMcpRegistrationOptions, WebMcpTool } from "./port";

declare global {
  interface ModelContext {
    registerTool(
      tool: WebMcpTool,
      options?: WebMcpRegistrationOptions,
    ): Promise<void>;
  }

  interface Document {
    readonly modelContext?: ModelContext;
  }
}

export {};
