import { describe, expect, it } from "vitest";

import { compareProtectionParity } from "../../src/core/compare";
import type { RunSnapshot, TraceEvent } from "../../src/core/types";
import {
  ACCOUNT_DELETION_SCENARIO,
  buildFixtureRun,
} from "../../src/fixtures/accountDeletion";

function protectedRuns() {
  return {
    visual: buildFixtureRun("visual", "protected"),
    assistive: buildFixtureRun("assistive", "protected"),
    agent: buildFixtureRun("agent", "repaired-agent"),
  };
}

function compare(runs: Partial<ReturnType<typeof protectedRuns>>) {
  return compareProtectionParity({ scenario: ACCOUNT_DELETION_SCENARIO, runs });
}

function replaceEvents(
  run: RunSnapshot,
  events: readonly TraceEvent[],
): RunSnapshot {
  return Object.freeze({ ...run, events: Object.freeze(events) });
}

function reindex(
  run: RunSnapshot,
  events: readonly TraceEvent[],
): readonly TraceEvent[] {
  return events.map((event, index) => ({
    ...event,
    sequence: index + 1,
    id: `${run.runId}:event:${String(index + 1).padStart(2, "0")}`,
  }));
}

describe("protection parity comparator", () => {
  it("fails the known broken agent route at the first disclosure checkpoint", () => {
    const result = compare({
      visual: buildFixtureRun("visual", "protected"),
      assistive: buildFixtureRun("assistive", "protected"),
      agent: buildFixtureRun("agent", "broken-agent"),
    });

    expect(result.outcomeParity).toBe(true);
    expect(result.status).toBe("fail");
    expect(result.firstDivergence).toMatchObject({
      route: "agent",
      invariant: "disclosure",
      checkpoint: "disclosure.consequences",
      kind: "missing_checkpoint",
    });
  });

  it("passes only the fully protected three-route evidence set", () => {
    const result = compare(protectedRuns());

    expect(result.status).toBe("pass");
    expect(result.outcomeParity).toBe(true);
    expect(result.firstDivergence).toBeNull();
    expect(result.findings).toEqual([]);
  });

  it("returns incomplete when any route is absent", () => {
    const runs = protectedRuns();
    const result = compare({ visual: runs.visual, assistive: runs.assistive });

    expect(result.status).toBe("incomplete");
    expect(result.firstDivergence).toMatchObject({
      kind: "missing_route",
      route: "agent",
    });
  });

  it("refuses comparison when the seed drifts", () => {
    const runs = protectedRuns();
    const agent = { ...runs.agent, seed: "different-seed" };
    const result = compare({ ...runs, agent });

    expect(result.status).toBe("incomplete");
    expect(result.firstDivergence).toMatchObject({
      kind: "identity_mismatch",
      route: "agent",
    });
  });

  it("rejects fabricated source evidence", () => {
    const runs = protectedRuns();
    const first = runs.agent.events[0]!;
    const events = [
      { ...first, source: "pointer" as const },
      ...runs.agent.events.slice(1),
    ];
    const result = compare({
      ...runs,
      agent: replaceEvents(runs.agent, events),
    });

    expect(result.status).toBe("fail");
    expect(result.firstDivergence).toMatchObject({
      kind: "invalid_evidence",
      route: "agent",
    });
  });

  it("fails consent recorded after commitment", () => {
    const runs = protectedRuns();
    const consent = runs.agent.events.find(
      (event) => event.checkpoint === "consent.exact",
    )!;
    const withoutConsent = runs.agent.events.filter(
      (event) => event !== consent,
    );
    const commitIndex = withoutConsent.findIndex(
      (event) => event.checkpoint === "commit.delete",
    );
    const reordered = [
      ...withoutConsent.slice(0, commitIndex + 1),
      consent,
      ...withoutConsent.slice(commitIndex + 1),
    ];
    const events = reindex(runs.agent, reordered);
    const result = compare({
      ...runs,
      agent: replaceEvents(runs.agent, events),
    });

    expect(result.status).toBe("fail");
    expect(result.firstDivergence).toMatchObject({
      kind: "reordered_checkpoint",
      route: "agent",
      checkpoint: "consent.exact",
    });
  });

  it("fails duplicated semantic evidence", () => {
    const runs = protectedRuns();
    const disclosure = runs.agent.events[0]!;
    const events = reindex(runs.agent, [
      disclosure,
      { ...disclosure },
      ...runs.agent.events.slice(1),
    ]);
    const result = compare({
      ...runs,
      agent: replaceEvents(runs.agent, events),
    });

    expect(result.status).toBe("fail");
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "duplicated_checkpoint",
          route: "agent",
          checkpoint: "disclosure.consequences",
        }),
      ]),
    );
  });

  it("kills a repaired green when a protection regresses", () => {
    const runs = protectedRuns();
    const events = reindex(
      runs.agent,
      runs.agent.events.filter(
        (event) => event.checkpoint !== "recovery.guidance",
      ),
    );
    const result = compare({
      ...runs,
      agent: replaceEvents(runs.agent, events),
    });

    expect(result.status).toBe("fail");
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "missing_checkpoint",
          route: "agent",
          checkpoint: "recovery.guidance",
        }),
      ]),
    );
  });
});
