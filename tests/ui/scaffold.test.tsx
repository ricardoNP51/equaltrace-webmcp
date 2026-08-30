import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "../../src/App";
import { createWorkbenchStore } from "../../src/state/initialState";

describe("EqualTrace scaffold", () => {
  it("labels the fictional preview and resets into an honest incomplete state", async () => {
    const user = userEvent.setup();
    render(<App store={createWorkbenchStore()} />);

    expect(screen.getByText(/fictional account deletion/i)).toBeInTheDocument();
    expect(
      screen.getByText("Fixture preview · not current evidence"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /reset and begin baseline/i }),
    );

    expect(
      screen.getByText("Current session · evidence incomplete"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Evidence is still incomplete."),
    ).toBeInTheDocument();
    expect(screen.getByText(/challenge-v1\.0\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/development/i)).toBeInTheDocument();
  });
});
