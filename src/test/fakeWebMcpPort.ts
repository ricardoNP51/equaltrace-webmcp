import type {
  WebMcpPort,
  WebMcpRegistrationOptions,
  WebMcpTool,
  WebMcpToolResponse,
} from "../webmcp/port";

export class FakeWebMcpPort implements WebMcpPort {
  readonly provenance = "simulated" as const;
  readonly available = true;
  readonly registered = new Map<string, WebMcpTool>();

  async registerTool(tool: WebMcpTool, options?: WebMcpRegistrationOptions) {
    this.registered.set(tool.name, tool);
    options?.signal?.addEventListener(
      "abort",
      () => {
        if (this.registered.get(tool.name) === tool) {
          this.registered.delete(tool.name);
        }
      },
      { once: true },
    );
  }

  async invoke(
    name: string,
    input: unknown,
    signal: AbortSignal = new AbortController().signal,
  ): Promise<WebMcpToolResponse> {
    const tool = this.registered.get(name);
    if (!tool) {
      throw new Error(`Simulated tool ${name} is not registered.`);
    }
    return tool.execute(input, { signal });
  }
}
