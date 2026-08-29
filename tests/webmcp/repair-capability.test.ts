import { describe, expect, it } from "vitest";

import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";
import type { WorkbenchStore } from "../../src/state/WorkbenchStore";
import { FakeClock } from "../../src/test/fakeClock";
import { FakeDigestService } from "../../src/test/fakeDigest";
import { FakeWebMcpPort } from "../../src/test/fakeWebMcpPort";
import type {
  WebMcpPort,
  WebMcpRegistrationOptions,
  WebMcpTool,
} from "../../src/webmcp/port";
import {
  APPLY_APPROVED_REPAIR_TOOL_NAME,
  startRepairCapabilityLifecycle,
} from "../../src/webmcp/repairCapability";

const NOW = 1_800_000_000_000;

async function stageRepair(store: WorkbenchStore) {
  store.reset();
  const epoch = store.getSnapshot().epoch;
  store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
  store.recordRun(buildFixtureRun("assistive", "protected"), "recorded", epoch);
  store.recordRun(buildFixtureRun("agent", "broken-agent"), "simulated", epoch);
  store.audit(epoch);
  return store.stageRepair(epoch);
}

async function approvedHarness() {
  const clock = new FakeClock(NOW);
  const store = createWorkbenchStore({
    clock,
    digestService: new FakeDigestService(),
  });
  const port = new FakeWebMcpPort();
  const lifecycle = startRepairCapabilityLifecycle(port, store);
  const repair = await stageRepair(store);
  const authority = store.approveRepairFromHumanInteraction(
    repair,
    store.getSnapshot().epoch,
  );
  await lifecycle.whenIdle();
  return { clock, store, port, lifecycle, repair, authority };
}

function exactInput(repair: { repairId: string; repairDigest: string }) {
  return {
    repairId: repair.repairId,
    repairDigest: repair.repairDigest,
  };
}

describe("temporary repair capability lifecycle", () => {
  it("is absent before approval and registers only the exact constant tool afterward", async () => {
    const store = createWorkbenchStore({
      clock: new FakeClock(NOW),
      digestService: new FakeDigestService(),
    });
    const port = new FakeWebMcpPort();
    const lifecycle = startRepairCapabilityLifecycle(port, store);
    const repair = await stageRepair(store);
    await lifecycle.whenIdle();

    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    store.approveRepairFromHumanInteraction(repair, store.getSnapshot().epoch);
    await lifecycle.whenIdle();

    expect([...port.registered.keys()]).toEqual([
      APPLY_APPROVED_REPAIR_TOOL_NAME,
    ]);
    expect(port.registered.get(APPLY_APPROVED_REPAIR_TOOL_NAME)).toMatchObject({
      name: APPLY_APPROVED_REPAIR_TOOL_NAME,
      inputSchema: {
        required: ["repairId", "repairDigest"],
        additionalProperties: false,
      },
    });
    expect(store.getSnapshot().repairCapability).toMatchObject({
      status: "registration_reported",
      provenance: "simulated",
    });
    lifecycle.dispose();
  });

  it("applies the repaired policy once, removes registration, and rejects replay or concurrency", async () => {
    const { store, port, lifecycle, repair } = await approvedHarness();
    const captured = port.registered.get(APPLY_APPROVED_REPAIR_TOOL_NAME)!;
    const attempts = await Promise.allSettled([
      port.invoke(APPLY_APPROVED_REPAIR_TOOL_NAME, exactInput(repair)),
      port.invoke(APPLY_APPROVED_REPAIR_TOOL_NAME, exactInput(repair)),
    ]);

    expect(
      attempts.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(store.getSnapshot()).toMatchObject({
      phase: "repair_applied",
      agentPolicy: "repaired-agent",
      approvedRepair: null,
      repairCapability: { status: "absent", reason: "used" },
    });
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    await expect(captured.execute(exactInput(repair))).rejects.toThrow(
      /no longer valid/i,
    );
    lifecycle.dispose();
  });

  it("fails closed on a wrong digest and consumes the failed authority", async () => {
    const { store, port, lifecycle, repair } = await approvedHarness();

    await expect(
      port.invoke(APPLY_APPROVED_REPAIR_TOOL_NAME, {
        ...exactInput(repair),
        repairDigest: "wrong-digest",
      }),
    ).rejects.toThrow(/does not match/i);
    await lifecycle.whenIdle();

    expect(store.getSnapshot()).toMatchObject({
      phase: "repair_staged",
      approvedRepair: null,
      agentPolicy: "broken-agent",
      repairCapability: { status: "absent", reason: "execution_failed" },
    });
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    lifecycle.dispose();
  });

  it("removes authority when execution is cancelled", async () => {
    const { store, port, lifecycle, repair } = await approvedHarness();
    const controller = new AbortController();
    controller.abort(new DOMException("Cancelled", "AbortError"));

    await expect(
      port.invoke(
        APPLY_APPROVED_REPAIR_TOOL_NAME,
        exactInput(repair),
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    await lifecycle.whenIdle();

    expect(store.getSnapshot().repairCapability).toMatchObject({
      status: "absent",
      reason: "cancelled",
    });
    expect(store.getSnapshot().approvedRepair).toBeNull();
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    lifecycle.dispose();
  });

  it("rejects a stale closure without disturbing a newly approved nonce", async () => {
    const { store, port, lifecycle, repair, authority } =
      await approvedHarness();
    const staleTool = port.registered.get(APPLY_APPROVED_REPAIR_TOOL_NAME)!;
    store.revokeRepairApprovalFromHumanInteraction(store.getSnapshot().epoch);
    await lifecycle.whenIdle();
    const nextAuthority = store.approveRepairFromHumanInteraction(
      repair,
      store.getSnapshot().epoch,
    );
    await lifecycle.whenIdle();

    expect(nextAuthority.nonce).not.toBe(authority.nonce);
    await expect(staleTool.execute(exactInput(repair))).rejects.toThrow(
      /no longer valid/i,
    );
    expect(store.getSnapshot().approvedRepair?.nonce).toBe(nextAuthority.nonce);
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(true);
    lifecycle.dispose();
  });

  it("removes registration on expiry", async () => {
    const { clock, store, port, lifecycle } = await approvedHarness();
    clock.advance(2 * 60 * 1000);
    expect(store.expireRepairIfNeeded()).toBe(true);
    await lifecycle.whenIdle();

    expect(store.getSnapshot().repairCapability).toMatchObject({
      status: "absent",
      reason: "expired",
    });
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    lifecycle.dispose();
  });

  it.each([
    ["reset", (store: WorkbenchStore) => store.reset(), "reset"],
    [
      "revocation",
      (store: WorkbenchStore) =>
        store.revokeRepairApprovalFromHumanInteraction(
          store.getSnapshot().epoch,
        ),
      "revoked",
    ],
    [
      "proposal edit",
      (store: WorkbenchStore) =>
        store.invalidateRepairForProposalEdit(store.getSnapshot().epoch),
      "proposal_edit",
    ],
    [
      "seed drift",
      (store: WorkbenchStore) =>
        store.invalidateRepairForSeedDrift(store.getSnapshot().epoch),
      "seed_drift",
    ],
    [
      "scenario drift",
      (store: WorkbenchStore) =>
        store.invalidateRepairForScenarioDrift(store.getSnapshot().epoch),
      "scenario_drift",
    ],
    [
      "intent drift",
      (store: WorkbenchStore) =>
        store.invalidateRepairForIntentDrift(store.getSnapshot().epoch),
      "intent_drift",
    ],
  ])("removes registration after %s", async (_name, invalidate, reason) => {
    const { store, port, lifecycle } = await approvedHarness();
    invalidate(store);
    await lifecycle.whenIdle();

    expect(store.getSnapshot().approvedRepair).toBeNull();
    expect(store.getSnapshot().repairCapability.reason).toBe(reason);
    expect(port.registered.has(APPLY_APPROVED_REPAIR_TOOL_NAME)).toBe(false);
    lifecycle.dispose();
  });

  it("fails registration safely and requires a fresh approval", async () => {
    class FailingPort implements WebMcpPort {
      readonly provenance = "simulated" as const;
      readonly available = true;
      async registerTool() {
        throw new Error("Synthetic registration failure");
      }
    }

    const store = createWorkbenchStore({
      clock: new FakeClock(NOW),
      digestService: new FakeDigestService(),
    });
    const lifecycle = startRepairCapabilityLifecycle(new FailingPort(), store);
    const repair = await stageRepair(store);
    store.approveRepairFromHumanInteraction(repair, store.getSnapshot().epoch);
    await lifecycle.whenIdle();

    expect(store.getSnapshot()).toMatchObject({
      phase: "repair_staged",
      approvedRepair: null,
      repairCapability: {
        status: "registration_failed",
        reason: "registration_failed",
        error: "Synthetic registration failure",
      },
    });
    lifecycle.dispose();
  });

  it("aborts an in-flight registration immediately when reset invalidates authority", async () => {
    let finishRegistration!: () => void;
    let registrationSignal: AbortSignal | undefined;
    let capturedTool: WebMcpTool | undefined;
    class DeferredPort implements WebMcpPort {
      readonly provenance = "simulated" as const;
      readonly available = true;
      async registerTool(
        tool: WebMcpTool,
        options?: WebMcpRegistrationOptions,
      ) {
        capturedTool = tool;
        registrationSignal = options?.signal;
        await new Promise<void>((resolve) => {
          finishRegistration = resolve;
        });
      }
    }

    const store = createWorkbenchStore({
      clock: new FakeClock(NOW),
      digestService: new FakeDigestService(),
    });
    const lifecycle = startRepairCapabilityLifecycle(new DeferredPort(), store);
    const repair = await stageRepair(store);
    store.approveRepairFromHumanInteraction(repair, store.getSnapshot().epoch);
    for (let index = 0; index < 5 && !registrationSignal; index += 1) {
      await Promise.resolve();
    }
    expect(registrationSignal).toBeDefined();

    store.reset();
    expect(registrationSignal?.aborted).toBe(true);
    finishRegistration();
    await lifecycle.whenIdle();

    expect(store.getSnapshot()).toMatchObject({
      phase: "baseline_capture",
      approvedRepair: null,
      repairCapability: { status: "absent", reason: "reset" },
    });
    await expect(capturedTool!.execute(exactInput(repair))).rejects.toThrow(
      /no longer valid/i,
    );
    lifecycle.dispose();
  });
});
