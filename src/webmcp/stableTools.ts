import type { Route } from "../core/types";
import { executeAgentRoute } from "../fixtures/accountDeletion";
import type { WorkbenchStore } from "../state/WorkbenchStore";
import type { WebMcpPort, WebMcpTool, WebMcpToolResponse } from "./port";
import {
  EMPTY_INPUT_SCHEMA,
  parseEmptyInput,
  parseScenarioToolInput,
  RUN_AGENT_INPUT_SCHEMA,
} from "./toolSchemas";

export const STABLE_TOOL_NAMES = Object.freeze([
  "equaltrace_get_status",
  "equaltrace_run_agent_route",
  "equaltrace_run_audit",
  "equaltrace_stage_repair",
] as const);

function response(value: unknown): WebMcpToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
  };
}

function assertNotAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw signal.reason instanceof Error
      ? signal.reason
      : new DOMException("Tool execution was cancelled.", "AbortError");
  }
}

function executionSignal(options?: { readonly signal: AbortSignal }) {
  return options?.signal ?? new AbortController().signal;
}

function completedRoutes(store: WorkbenchStore): readonly Route[] {
  const evidence = store.getSnapshot().routeEvidence;
  return (Object.keys(evidence) as Route[]).filter(
    (route) => evidence[route] !== undefined,
  );
}

export function createStableTools(
  store: WorkbenchStore,
  provenance: WebMcpPort["provenance"],
): readonly WebMcpTool[] {
  const getStatus: WebMcpTool = {
    name: "equaltrace_get_status",
    title: "Get EqualTrace status",
    description:
      "Read the current EqualTrace phase, deterministic scenario identity, completed routes, audit status, and reported repair-capability lifecycle state.",
    inputSchema: EMPTY_INPUT_SCHEMA,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      const signal = executionSignal(options);
      parseEmptyInput(input);
      assertNotAborted(signal);
      const snapshot = store.getSnapshot();
      return response({
        phase: snapshot.phase,
        scenario: {
          id: snapshot.scenario.id,
          version: snapshot.scenario.version,
          seed: snapshot.scenario.seed,
        },
        completedRoutes: completedRoutes(store),
        comparison: snapshot.comparison?.status ?? "not_run",
        nativeSupport: snapshot.nativeSupport,
        repairReview:
          snapshot.phase === "repair_applied"
            ? "applied"
            : snapshot.phase === "repair_approved"
              ? "human_approved"
              : snapshot.phase === "repair_staged"
                ? "awaiting_human"
                : "not_staged",
        repairCapability: snapshot.repairCapability,
      });
    },
  };

  const runAgentRoute: WebMcpTool = {
    name: "equaltrace_run_agent_route",
    title: "Run the EqualTrace agent route",
    description:
      "Execute the current broken or human-repaired agent policy for the exact active fictional scenario and record its WebMCP-origin evidence in the shared workbench.",
    inputSchema: RUN_AGENT_INPUT_SCHEMA,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      const signal = executionSignal(options);
      const parsed = parseScenarioToolInput(input);
      assertNotAborted(signal);
      const snapshot = store.getSnapshot();
      const identityMatches =
        parsed.scenarioId === snapshot.scenario.id &&
        parsed.scenarioVersion === snapshot.scenario.version &&
        parsed.seed === snapshot.scenario.seed;
      if (!identityMatches) {
        throw new Error(
          "Tool input does not match the active deterministic scenario.",
        );
      }

      const run = executeAgentRoute(
        snapshot.scenario,
        snapshot.agentPolicy,
        snapshot.agentPolicy === "broken-agent"
          ? "current-baseline-agent"
          : "current-repaired-agent",
      );
      assertNotAborted(signal);
      store.recordRun(run, provenance, snapshot.epoch);

      return response({
        status: "recorded",
        evidenceProvenance: provenance,
        outcome: run.accountState.status,
        evidenceIds: run.events.map((event) => event.id),
      });
    },
  };

  const runAudit: WebMcpTool = {
    name: "equaltrace_run_audit",
    title: "Run the EqualTrace audit",
    description:
      "Compare only the currently recorded visual, assistive, and agent evidence; missing routes remain incomplete.",
    inputSchema: EMPTY_INPUT_SCHEMA,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      const signal = executionSignal(options);
      parseEmptyInput(input);
      assertNotAborted(signal);
      const snapshot = store.getSnapshot();
      const comparison = store.audit(snapshot.epoch);
      return response({
        status: comparison.status,
        outcomeParity: comparison.outcomeParity,
        firstDivergence: comparison.firstDivergence,
      });
    },
  };

  const stageRepair: WebMcpTool = {
    name: "equaltrace_stage_repair",
    title: "Stage the bounded EqualTrace repair",
    description:
      "Prepare the one bounded repair allowed by the current agent divergence. This cannot approve, register, or apply a repair.",
    inputSchema: EMPTY_INPUT_SCHEMA,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      const signal = executionSignal(options);
      parseEmptyInput(input);
      assertNotAborted(signal);
      const snapshot = store.getSnapshot();
      const repair = await store.stageRepair(snapshot.epoch, signal);
      return response({ status: "staged", repair });
    },
  };

  return Object.freeze([getStatus, runAgentRoute, runAudit, stageRepair]);
}

export type StableToolRegistration = {
  readonly registered: boolean;
  readonly toolNames: readonly string[];
  readonly error?: string;
  readonly dispose: () => void;
};

export async function registerStableTools(
  port: WebMcpPort,
  store: WorkbenchStore,
): Promise<StableToolRegistration> {
  const registrationController = new AbortController();
  const dispose = () => registrationController.abort();

  if (!port.available) {
    if (port.provenance === "native") {
      store.setNativeSupport("unsupported");
    }
    return { registered: false, toolNames: [], dispose };
  }

  const tools = createStableTools(store, port.provenance);
  try {
    for (const tool of tools) {
      await port.registerTool(tool, { signal: registrationController.signal });
    }
    if (port.provenance === "native") {
      store.setNativeSupport("available");
    }
    return {
      registered: true,
      toolNames: tools.map((tool) => tool.name),
      dispose,
    };
  } catch (error) {
    dispose();
    if (port.provenance === "native") {
      store.setNativeSupport("registration_failed");
    }
    return {
      registered: false,
      toolNames: [],
      error: error instanceof Error ? error.message : "Registration failed.",
      dispose,
    };
  }
}
