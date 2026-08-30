import { describe, expect, it, vi } from "vitest";

import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";
import { FakeClock } from "../../src/test/fakeClock";
import { FakeDigestService } from "../../src/test/fakeDigest";

async function appliedStore() {
  const store = createWorkbenchStore({
    clock: new FakeClock(1_800_000_000_000),
    digestService: new FakeDigestService(),
  });
  store.reset();
  const epoch = store.getSnapshot().epoch;
  store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
  store.recordRun(buildFixtureRun("assistive", "protected"), "recorded", epoch);
  store.recordRun(buildFixtureRun("agent", "broken-agent"), "simulated", epoch);
  store.audit(epoch);
  const repair = await store.stageRepair(epoch);
  const authority = store.approveRepairFromHumanInteraction(repair, epoch);
  store.reportRepairCapabilityRegistered(authority, "simulated");
  store.applyApprovedRepairFromCapability(
    authority,
    repair,
    new AbortController().signal,
  );
  return store;
}

describe("WorkbenchStore", () => {
  it("starts in an immutable honest preview", () => {
    const snapshot = createWorkbenchStore().getSnapshot();

    expect(snapshot.phase).toBe("preview");
    expect(snapshot.epoch).toBe(0);
    expect(snapshot.routeEvidence).toEqual({});
    expect(snapshot.comparison).toBeNull();
    expect(snapshot.nativeInvoked).toBe(false);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.routeEvidence)).toBe(true);
  });

  it("publishes a new deterministic baseline and notifies subscribers", () => {
    const store = createWorkbenchStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.reset();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toMatchObject({
      phase: "baseline_capture",
      epoch: 1,
      routeEvidence: {},
      nativeInvoked: false,
    });
  });

  it("rejects evidence before a visible reset", () => {
    const store = createWorkbenchStore();

    expect(() =>
      store.recordRun(buildFixtureRun("visual", "protected"), "recorded", 0),
    ).toThrow(/begin or reset/i);
  });

  it("rejects stale and incompatible evidence", () => {
    const store = createWorkbenchStore();
    store.reset();
    const visual = buildFixtureRun("visual", "protected");

    expect(() => store.recordRun(visual, "recorded", 0)).toThrow(/stale/i);
    expect(() =>
      store.recordRun({ ...visual, seed: "drifted" }, "recorded", 1),
    ).toThrow(/incompatible/i);
  });

  it("enforces route provenance and native availability", () => {
    const store = createWorkbenchStore();
    store.reset();

    expect(() =>
      store.recordRun(buildFixtureRun("visual", "protected"), "simulated", 1),
    ).toThrow(/cannot be recorded with simulated/i);
    expect(() =>
      store.recordRun(buildFixtureRun("agent", "broken-agent"), "native", 1),
    ).toThrow(/requires an available native/i);
  });

  it("shares broken simulated evidence without claiming native invocation", () => {
    const store = createWorkbenchStore();
    store.reset();
    const epoch = store.getSnapshot().epoch;

    store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
    store.recordRun(
      buildFixtureRun("assistive", "protected"),
      "recorded",
      epoch,
    );
    store.recordRun(
      buildFixtureRun("agent", "broken-agent"),
      "simulated",
      epoch,
    );
    const result = store.audit(epoch);

    expect(result.status).toBe("fail");
    expect(result.firstDivergence).toMatchObject({
      route: "agent",
      checkpoint: "disclosure.consequences",
    });
    expect(store.getSnapshot()).toMatchObject({
      phase: "baseline_failed",
      nativeInvoked: false,
    });
    expect(store.getSnapshot().routeEvidence.agent?.provenance).toBe(
      "simulated",
    );
  });

  it("reset invalidates captured evidence and advances the epoch", () => {
    const store = createWorkbenchStore();
    store.reset();
    store.recordRun(buildFixtureRun("visual", "protected"), "recorded", 1);

    store.reset();

    expect(store.getSnapshot()).toMatchObject({
      phase: "baseline_capture",
      epoch: 2,
      routeEvidence: {},
      comparison: null,
      nativeInvoked: false,
    });
  });

  it("recreates fresh repaired routes and issues a receipt only after a passing rerun", async () => {
    const store = await appliedStore();
    const appliedRepair = store.getSnapshot().appliedRepair;
    const oldEpoch = store.getSnapshot().epoch;

    store.beginRepairedRerun(oldEpoch);
    const epoch = store.getSnapshot().epoch;
    expect(store.getSnapshot()).toMatchObject({
      phase: "repaired_capture",
      epoch: oldEpoch + 1,
      routeEvidence: {},
      stagedRepair: null,
      approvedRepair: null,
      appliedRepair,
      agentPolicy: "repaired-agent",
    });

    store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
    store.recordRun(
      buildFixtureRun("assistive", "protected"),
      "recorded",
      epoch,
    );
    store.recordRun(
      buildFixtureRun("agent", "repaired-agent"),
      "simulated",
      epoch,
    );
    const receipt = await store.auditAndIssueRepairedReceipt(epoch);

    expect(receipt).not.toBeNull();
    expect(store.getSnapshot()).toMatchObject({
      phase: "verified",
      comparison: { status: "pass", outcomeParity: true },
      receipt: { receiptId: receipt!.receiptId, verdict: "pass" },
    });
    expect(store.getSnapshot().receiptJson).toContain(receipt!.receiptId);
  });

  it("fails at the repaired regression and never creates a passing receipt", async () => {
    const store = await appliedStore();
    store.beginRepairedRerun(store.getSnapshot().epoch);
    const epoch = store.getSnapshot().epoch;
    store.recordRun(buildFixtureRun("visual", "protected"), "recorded", epoch);
    store.recordRun(
      buildFixtureRun("assistive", "protected"),
      "recorded",
      epoch,
    );
    store.recordRun(
      buildFixtureRun("agent", "broken-agent"),
      "simulated",
      epoch,
    );

    const receipt = await store.auditAndIssueRepairedReceipt(epoch);

    expect(receipt).toBeNull();
    expect(store.getSnapshot()).toMatchObject({
      phase: "repaired_capture",
      comparison: {
        status: "fail",
        firstDivergence: {
          route: "agent",
          checkpoint: "disclosure.consequences",
        },
      },
      receipt: null,
      receiptJson: null,
    });
    await expect(store.issueParityReceipt(epoch)).rejects.toThrow(
      /complete passing/i,
    );
  });
});
