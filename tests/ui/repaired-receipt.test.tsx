import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "../../src/App";
import { BrowserDigestService } from "../../src/core/digest";
import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";
import { FakeClock } from "../../src/test/fakeClock";

async function appliedStore() {
  const store = createWorkbenchStore({
    clock: new FakeClock(1_800_000_000_000),
    digestService: new BrowserDigestService(),
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

afterEach(() => vi.restoreAllMocks());

describe("repaired proof and receipt UI", () => {
  it("requires fresh evidence, turns green only after pass, and links all assertions", async () => {
    const user = userEvent.setup();
    const store = await appliedStore();
    render(<App store={store} />);

    expect(
      screen.getByRole("heading", { name: /recreate every route/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /verified proof is portable/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /begin fresh repaired rerun/i }),
    );
    expect(store.getSnapshot().routeEvidence).toEqual({});
    expect(
      screen.getByText(/3 fresh repaired routes still required/i),
    ).toBeInTheDocument();

    await act(async () => {
      const epoch = store.getSnapshot().epoch;
      store.recordRun(
        buildFixtureRun("visual", "protected"),
        "recorded",
        epoch,
      );
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
      await store.auditAndIssueRepairedReceipt(epoch);
    });

    expect(
      screen.getByRole("heading", {
        name: /same deletion. same protections. proven/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /verified proof is portable/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/6\/6 passed/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /evidence/i })).toHaveLength(18);
  });

  it("keeps the verified receipt visible when browser download creation fails", async () => {
    const user = userEvent.setup();
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
      buildFixtureRun("agent", "repaired-agent"),
      "simulated",
      epoch,
    );
    await store.auditAndIssueRepairedReceipt(epoch);
    render(<App store={store} />);

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => {
        throw new Error("downloads blocked by test browser");
      }),
    });
    await user.click(
      screen.getByRole("button", { name: /download canonical receipt json/i }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      /download failed; the verified receipt remains visible/i,
    );
    expect(
      screen.getByRole("heading", { name: /verified proof is portable/i }),
    ).toBeInTheDocument();
    expect(store.getSnapshot().phase).toBe("verified");
  });
});
