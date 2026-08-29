import { describe, expect, it } from "vitest";

import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";
import { FakeWebMcpPort } from "../../src/test/fakeWebMcpPort";
import {
  registerStableTools,
  STABLE_TOOL_NAMES,
} from "../../src/webmcp/stableTools";

function activeScenarioInput(store: ReturnType<typeof createWorkbenchStore>) {
  const scenario = store.getSnapshot().scenario;
  return {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    seed: scenario.seed,
  };
}

function parsedContent(response: {
  readonly content: readonly { readonly text: string }[];
}) {
  const first = response.content[0];
  if (!first) throw new Error("Expected a text tool response.");
  return JSON.parse(first.text) as Record<string, unknown>;
}

describe("stable WebMCP tools", () => {
  it("registers exactly four constant-schema simulated tools and tears them down", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();

    const registration = await registerStableTools(port, store);

    expect(registration.registered).toBe(true);
    expect([...port.registered.keys()]).toEqual(STABLE_TOOL_NAMES);
    expect(port.registered.has("equaltrace_apply_approved_repair")).toBe(false);
    for (const tool of port.registered.values()) {
      expect(tool.inputSchema).toMatchObject({
        type: "object",
        additionalProperties: false,
      });
    }
    expect(store.getSnapshot().nativeSupport).toBe("unknown");

    registration.dispose();
    expect(port.registered.size).toBe(0);
  });

  it("rejects extra fields and incompatible scenario identity at runtime", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();

    await expect(
      port.invoke("equaltrace_get_status", { ignored: true }),
    ).rejects.toThrow(/empty object/i);
    await expect(
      port.invoke("equaltrace_run_agent_route", {
        ...activeScenarioInput(store),
        actor: "human",
      }),
    ).rejects.toThrow(/unsupported fields/i);
    await expect(
      port.invoke("equaltrace_run_agent_route", {
        ...activeScenarioInput(store),
        seed: "wrong-seed",
      }),
    ).rejects.toThrow(/does not match/i);
  });

  it("honors execution cancellation before shared state changes", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();
    const controller = new AbortController();
    controller.abort(new DOMException("Cancelled", "AbortError"));

    await expect(
      port.invoke(
        "equaltrace_run_agent_route",
        activeScenarioInput(store),
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(store.getSnapshot().routeEvidence.agent).toBeUndefined();
  });

  it("accepts native clients that omit optional execution metadata", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();
    const tool = port.registered.get("equaltrace_run_agent_route");
    if (!tool) throw new Error("Expected the agent tool to be registered.");

    await tool.execute(activeScenarioInput(store));

    expect(store.getSnapshot().routeEvidence.agent?.provenance).toBe(
      "simulated",
    );
  });

  it("records simulated agent evidence in the same store without a native claim", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();

    const result = parsedContent(
      await port.invoke(
        "equaltrace_run_agent_route",
        activeScenarioInput(store),
      ),
    );

    expect(result).toMatchObject({
      status: "recorded",
      evidenceProvenance: "simulated",
      outcome: "deleted",
    });
    expect(store.getSnapshot().routeEvidence.agent?.provenance).toBe(
      "simulated",
    );
    expect(store.getSnapshot().nativeInvoked).toBe(false);
  });

  it("audits recorded routes and stages only the bounded first-divergence repair", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();
    const epoch = store.getSnapshot().epoch;
    store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
    store.recordRun(
      buildFixtureRun("assistive", "protected"),
      "recorded",
      epoch,
    );
    await port.invoke("equaltrace_run_agent_route", activeScenarioInput(store));

    const audit = parsedContent(await port.invoke("equaltrace_run_audit", {}));
    expect(audit).toMatchObject({
      status: "fail",
      firstDivergence: {
        route: "agent",
        checkpoint: "disclosure.consequences",
      },
    });

    const staged = parsedContent(
      await port.invoke("equaltrace_stage_repair", {}),
    );
    expect(staged).toMatchObject({
      status: "staged",
      repair: {
        targetToolName: "equaltrace_run_agent_route",
        addsCheckpoints: ["disclosure.consequences"],
      },
    });
    expect(store.getSnapshot()).toMatchObject({ phase: "repair_staged" });
    expect(port.registered.has("equaltrace_apply_approved_repair")).toBe(false);

    await expect(
      port.invoke("equaltrace_stage_repair", {
        actor: "human",
        approve: true,
      }),
    ).rejects.toThrow(/empty object/i);
    expect(store.getSnapshot().approvedRepair).toBeNull();
  });

  it("keeps audit incomplete when real human routes are missing", async () => {
    const store = createWorkbenchStore();
    const port = new FakeWebMcpPort();
    await registerStableTools(port, store);
    store.reset();
    await port.invoke("equaltrace_run_agent_route", activeScenarioInput(store));

    const result = parsedContent(await port.invoke("equaltrace_run_audit", {}));
    expect(result.status).toBe("incomplete");
    await expect(port.invoke("equaltrace_stage_repair", {})).rejects.toThrow(
      /failed baseline/i,
    );
  });
});
