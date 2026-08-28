import { describe, expect, it } from "vitest";

import {
  createAssistiveRouteSession,
  createVisualRouteSession,
} from "../../src/core/humanRouteSession";
import { ACCOUNT_DELETION_SCENARIO } from "../../src/fixtures/accountDeletion";

function complete(
  session:
    | ReturnType<typeof createVisualRouteSession>
    | ReturnType<typeof createAssistiveRouteSession>,
) {
  session.reviewConsequences();
  session.confirmExactConsent();
  return session.commit();
}

describe("human route sessions", () => {
  it("executes the visual route through pointer-origin domain evidence", () => {
    const run = complete(createVisualRouteSession(ACCOUNT_DELETION_SCENARIO));

    expect(run.route).toBe("visual");
    expect(run.source).toBe("pointer");
    expect(run.accountState.status).toBe("deleted");
    expect(run.events.map((event) => event.checkpoint)).toEqual([
      "disclosure.consequences",
      "consent.exact",
      "commit.delete",
      "feedback.complete",
      "reversibility.cancel_window",
      "recovery.guidance",
      "outcome.account_deleted",
    ]);
    expect(run.events.every((event) => event.source === "pointer")).toBe(true);
  });

  it("executes an independent assistive route through keyboard-origin evidence", () => {
    const visual = complete(
      createVisualRouteSession(ACCOUNT_DELETION_SCENARIO),
    );
    const assistive = complete(
      createAssistiveRouteSession(ACCOUNT_DELETION_SCENARIO),
    );

    expect(assistive.route).toBe("assistive");
    expect(assistive.source).toBe("keyboard");
    expect(assistive.events.every((event) => event.source === "keyboard")).toBe(
      true,
    );
    expect(assistive.events.map((event) => event.checkpoint)).toEqual(
      visual.events.map((event) => event.checkpoint),
    );
    expect(assistive.runId).not.toBe(visual.runId);
    expect(assistive.seed).toBe(visual.seed);
    expect(assistive.scenarioVersion).toBe(visual.scenarioVersion);
  });

  it("fails closed when consent or commitment is attempted out of order", () => {
    const session = createVisualRouteSession(ACCOUNT_DELETION_SCENARIO);

    expect(() => session.confirmExactConsent()).toThrow(/expected disclosed/i);
    expect(() => session.commit()).toThrow(/expected consented/i);
    session.reviewConsequences();
    expect(() => session.commit()).toThrow(/expected consented/i);
    session.confirmExactConsent();
    session.commit();
    expect(() => session.commit()).toThrow(/received completed/i);
  });
});
