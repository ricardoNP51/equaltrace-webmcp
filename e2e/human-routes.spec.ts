import { expect, test } from "@playwright/test";

test("the visual journey records pointer-origin evidence only", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: /reset and begin baseline/i }).click();
  await page
    .getByRole("button", { name: /review visual route consequences/i })
    .click();
  await page
    .getByRole("button", { name: /consent to delete fictional account/i })
    .first()
    .click();
  await page
    .getByRole("button", { name: /delete fictional account/i })
    .first()
    .click();

  const evidence = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    return workbenchStore.getSnapshot().routeEvidence.visual;
  });
  expect(evidence?.provenance).toBe("recorded");
  expect(evidence?.run.source).toBe("pointer");
  expect(evidence?.run.events).toHaveLength(7);
  expect(
    evidence?.run.events.every((event) => event.source === "pointer"),
  ).toBe(true);
});

test("the assistive journey completes keyboard-only with deterministic focus", async ({
  page,
}) => {
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /skip to audit workbench/i }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /equaltrace home/i }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: /reset and begin baseline/i }),
  ).toBeFocused();
  await page.keyboard.press("Enter");

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /inspect evidence/i }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /reset seed/i })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: /review visual route consequences/i }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  const review = page.getByRole("button", {
    name: /review keyboard route consequences/i,
  });
  await expect(review).toBeFocused();
  await page.keyboard.press("Enter");

  const consent = page
    .getByRole("button", { name: /consent to delete fictional account/i })
    .first();
  await expect(consent).toBeFocused();
  await page.keyboard.press("Enter");
  const commit = page
    .getByRole("button", { name: /delete fictional account/i })
    .first();
  await expect(commit).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: /route complete: account deleted/i }),
  ).toBeFocused();
  await expect(
    page.getByRole("status", {
      name: /keyboard and assistive route announcements/i,
    }),
  ).toContainText(/cancellation is available for 30 minutes/i);

  const evidence = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    return workbenchStore.getSnapshot().routeEvidence.assistive;
  });
  expect(evidence?.run.source).toBe("keyboard");
  expect(
    evidence?.run.events.every((event) => event.source === "keyboard"),
  ).toBe(true);
});

test("three isolated routes reach the same outcome and fail at agent disclosure", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: /reset and begin baseline/i }).click();

  await page
    .getByRole("button", { name: /review visual route consequences/i })
    .click();
  await page
    .getByRole("button", { name: /consent to delete fictional account/i })
    .first()
    .click();
  await page
    .getByRole("button", { name: /delete fictional account/i })
    .first()
    .click();

  const assistiveReview = page.getByRole("button", {
    name: /review keyboard route consequences/i,
  });
  await assistiveReview.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  await page.evaluate(async () => {
    const [{ workbenchStore }, { FakeWebMcpPort }, { registerStableTools }] =
      await Promise.all([
        import("/src/state/initialState.ts"),
        import("/src/test/fakeWebMcpPort.ts"),
        import("/src/webmcp/stableTools.ts"),
      ]);
    const port = new FakeWebMcpPort();
    await registerStableTools(port, workbenchStore);
    const scenario = workbenchStore.getSnapshot().scenario;
    await port.invoke("equaltrace_run_agent_route", {
      scenarioId: scenario.id,
      scenarioVersion: scenario.version,
      seed: scenario.seed,
    });
  });

  await page.getByRole("button", { name: /audit baseline evidence/i }).click();
  await expect(page.getByRole("status")).toContainText(
    /baseline audit failed first at disclosure\.consequences/i,
  );

  const proof = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    const snapshot = workbenchStore.getSnapshot();
    return {
      routes: Object.values(snapshot.routeEvidence).map((entry) => ({
        route: entry.run.route,
        source: entry.run.source,
        outcome: entry.run.accountState.status,
        seed: entry.run.seed,
        version: entry.run.scenarioVersion,
      })),
      comparison: snapshot.comparison,
    };
  });
  expect(proof.routes).toEqual([
    {
      route: "visual",
      source: "pointer",
      outcome: "deleted",
      seed: "equaltrace-golden-01",
      version: "1.0.0",
    },
    {
      route: "assistive",
      source: "keyboard",
      outcome: "deleted",
      seed: "equaltrace-golden-01",
      version: "1.0.0",
    },
    {
      route: "agent",
      source: "webmcp",
      outcome: "deleted",
      seed: "equaltrace-golden-01",
      version: "1.0.0",
    },
  ]);
  expect(proof.comparison).toMatchObject({
    status: "fail",
    outcomeParity: true,
    firstDivergence: {
      route: "agent",
      checkpoint: "disclosure.consequences",
    },
  });
});
