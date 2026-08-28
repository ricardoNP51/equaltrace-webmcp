export type JsonSchema = Readonly<Record<string, unknown>>;

export type WebMcpTextContent = {
  readonly type: "text";
  readonly text: string;
};

export type WebMcpToolResponse = {
  readonly content: readonly WebMcpTextContent[];
};

export type WebMcpExecuteOptions = {
  readonly signal: AbortSignal;
};

export type WebMcpTool = {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: JsonSchema;
  readonly annotations?: {
    readonly readOnlyHint?: boolean;
    readonly untrustedContentHint?: boolean;
  };
  readonly execute: (
    input: unknown,
    options?: WebMcpExecuteOptions,
  ) => Promise<WebMcpToolResponse>;
};

export type WebMcpRegistrationOptions = {
  readonly signal?: AbortSignal;
};

export interface WebMcpPort {
  readonly provenance: "native" | "simulated";
  readonly available: boolean;
  registerTool(
    tool: WebMcpTool,
    options?: WebMcpRegistrationOptions,
  ): Promise<void>;
}
