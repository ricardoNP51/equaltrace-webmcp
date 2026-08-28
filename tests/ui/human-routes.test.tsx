import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "../../src/App";
import { createWorkbenchStore } from "../../src/state/initialState";

describe("real human route journeys", () => {
  it("records the visual route only from pointer actions and manages focus", async () => {
    const user = userEvent.setup();
    const store = createWorkbenchStore();
    render(<App store={store} />);
    await user.click(
      screen.getByRole("button", { name: /reset and begin baseline/i }),
    );

    const review = screen.getByRole("button", {
      name: /review visual route consequences/i,
    });
    review.focus();
    await user.keyboard("{Enter}");
    expect(review).toBeInTheDocument();
    expect(store.getSnapshot().routeEvidence.visual).toBeUndefined();

    await user.click(review);
    const consent = screen.getAllByRole("button", {
      name: /consent to delete fictional account/i,
    })[0];
    expect(consent).toHaveFocus();
    if (!consent) throw new Error("Expected the visual consent control.");
    await user.click(consent);

    const commit = screen.getAllByRole("button", {
      name: /delete fictional account/i,
    })[0];
    expect(commit).toHaveFocus();
    if (!commit) throw new Error("Expected the visual commit control.");
    await user.click(commit);

    expect(
      screen.getByRole("heading", { name: /route complete: account deleted/i }),
    ).toHaveFocus();
    expect(store.getSnapshot().routeEvidence.visual?.run.source).toBe(
      "pointer",
    );
    expect(
      screen.getByRole("status", {
        name: /visual pointer route announcements/i,
      }),
    ).toHaveTextContent(/cancellation is available for 30 minutes/i);
  });

  it("records the assistive route only from Enter and announces each decision", async () => {
    const user = userEvent.setup();
    const store = createWorkbenchStore();
    render(<App store={store} />);
    await user.click(
      screen.getByRole("button", { name: /reset and begin baseline/i }),
    );

    const review = screen.getByRole("button", {
      name: /review keyboard route consequences/i,
    });
    await user.click(review);
    expect(store.getSnapshot().routeEvidence.assistive).toBeUndefined();

    review.focus();
    await user.keyboard("{Enter}");
    const status = screen.getByRole("status", {
      name: /keyboard and assistive route announcements/i,
    });
    expect(status).toHaveTextContent(/consequences disclosed/i);

    const consent = screen.getAllByRole("button", {
      name: /consent to delete fictional account/i,
    })[0];
    expect(consent).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(status).toHaveTextContent(/exact consent recorded/i);

    const commit = screen.getAllByRole("button", {
      name: /delete fictional account/i,
    })[0];
    expect(commit).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(store.getSnapshot().routeEvidence.assistive?.run.source).toBe(
      "keyboard",
    );
    expect(status).toHaveTextContent(/simulated recovery path/i);
  });
});
