import { describe, expect, it } from "vitest";

import { createRunContext, snapshotRun } from "../../src/core/scenario";
import {
  ACCOUNT_DELETION_SCENARIO,
  buildFixtureRun,
} from "../../src/fixtures/accountDeletion";

describe("deterministic account-deletion scenario", () => {
  it("creates identical fixture evidence for equivalent runs", () => {
    expect(buildFixtureRun("visual", "protected")).toEqual(
      buildFixtureRun("visual", "protected"),
    );
  });

  it("binds routes to their real evidence source", () => {
    expect(() =>
      createRunContext(
        ACCOUNT_DELETION_SCENARIO,
        "assistive",
        "pointer",
        "invalid",
      ),
    ).toThrow(/cannot emit pointer evidence/i);
  });

  it("returns immutable run snapshots", () => {
    const run = buildFixtureRun("agent", "broken-agent");

    expect(Object.isFrozen(run)).toBe(true);
    expect(Object.isFrozen(run.events)).toBe(true);
    expect(Object.isFrozen(run.events[0])).toBe(true);
  });

  it("keeps mutable execution state out of published snapshots", () => {
    const context = createRunContext(
      ACCOUNT_DELETION_SCENARIO,
      "visual",
      "pointer",
      "isolation",
    );
    const snapshot = snapshotRun(context);

    context.accountState = { accountId: "ACCT-DEMO-017", status: "deleted" };

    expect(snapshot.accountState.status).toBe("active");
  });
});
