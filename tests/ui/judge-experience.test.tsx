import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "../../src/App";
import { buildFixtureRun } from "../../src/fixtures/accountDeletion";
import { createWorkbenchStore } from "../../src/state/initialState";

describe("judge-first evidence experience", () => {
  it("explains the known bypass before the collapsed trace and labels it preview", async () => {
    const user = userEvent.setup();
    render(<App store={createWorkbenchStore()} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /outcome passed.*safety contract failed/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Fixture preview · not current evidence"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /agent deleted before consequences were disclosed/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not count as current-session or native/i),
    ).toBeInTheDocument();

    const details = screen.getByText("Open trace evidence").closest("details");
    expect(details).not.toHaveAttribute("open");
    await user.click(screen.getByText("Open trace evidence"));
    expect(details).toHaveAttribute("open");
    expect(
      screen.getByText(/deterministic fixture events/i),
    ).toBeInTheDocument();
  });

  it("links current failed evidence and reports simulated provenance honestly", () => {
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
    store.audit(epoch);

    render(<App store={store} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /outcome passed.*safety contract failed/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Current session · simulated agent evidence"),
    ).toBeInTheDocument();
    expect(screen.getByText(/equal outcome is confirmed/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/does not count as current-session or native/i),
    ).not.toBeInTheDocument();

    const expectedLink = screen.getAllByRole("link", {
      name: /visual evidence/i,
    })[0];
    const agentLink = screen.getByRole("link", {
      name: /first agent evidence/i,
    });
    expect(expectedLink).toHaveAttribute(
      "href",
      expect.stringMatching(/^#evidence-/),
    );
    expect(agentLink).toHaveAttribute(
      "href",
      expect.stringMatching(/^#evidence-/),
    );
  });
});
