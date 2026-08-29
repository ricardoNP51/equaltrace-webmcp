import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "../../src/App";
import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";
import { FakeClock } from "../../src/test/fakeClock";
import { FakeDigestService } from "../../src/test/fakeDigest";

async function stagedStore() {
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
  await store.stageRepair(epoch);
  return store;
}

describe("visible human repair boundary", () => {
  it("shows exact bounded scope and grants authority only from the visible control", async () => {
    const user = userEvent.setup();
    const store = await stagedStore();
    const repair = store.getSnapshot().stagedRepair!;
    render(<App store={store} />);

    expect(
      screen.getByRole("heading", { name: /review the exact bounded repair/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(repair.repairId)).toBeInTheDocument();
    expect(screen.getByText(repair.repairDigest)).toBeInTheDocument();
    expect(screen.getByText(/repair capability: absent/i)).toBeInTheDocument();
    expect(
      screen.getByText(/staging changed neither policy nor capability/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /approve this exact repair/i }),
    );

    expect(store.getSnapshot().phase).toBe("repair_approved");
    expect(store.getSnapshot().approvedRepair).toMatchObject({
      repairId: repair.repairId,
      repairDigest: repair.repairDigest,
    });
    expect(
      screen.getByRole("heading", {
        name: /exact repair approved by a person/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no apply tool is registered/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /revoke human approval/i }),
    );
    expect(store.getSnapshot().approvedRepair).toBeNull();
    expect(
      screen.getByRole("button", { name: /approve this exact repair/i }),
    ).toBeInTheDocument();
  });

  it("offers rejection and close without inventing hidden approval state", async () => {
    const user = userEvent.setup();
    const rejected = await stagedStore();
    const view = render(<App store={rejected} />);

    await user.click(screen.getByRole("button", { name: /reject repair/i }));
    expect(rejected.getSnapshot().approvedRepair).toBeNull();
    expect(
      screen.queryByText(/sha-256 repair digest/i),
    ).not.toBeInTheDocument();

    view.unmount();
    const closed = await stagedStore();
    render(<App store={closed} />);
    await user.click(
      screen.getByRole("button", { name: /close without approval/i }),
    );
    expect(closed.getSnapshot().stagedRepair).toBeNull();
    expect(closed.getSnapshot().approvedRepair).toBeNull();
  });
});
