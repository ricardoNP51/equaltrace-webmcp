import { expect, test } from "@playwright/test";

test("the static workbench exposes an honest starting state", async ({
  page,
}) => {
  await page.goto("./");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "right result",
  );
  await expect(
    page.getByText("Fixture preview · not current evidence"),
  ).toBeVisible();

  await page.getByRole("button", { name: /reset and begin baseline/i }).click();

  await expect(
    page.getByText("Current session · evidence incomplete"),
  ).toBeVisible();
  await expect(page.getByText("Evidence is still incomplete.")).toBeVisible();
});

test("a simulated port updates the shared page but never claims native evidence", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: /reset and begin baseline/i }).click();

  const toolResult = await page.evaluate(async () => {
    const [{ workbenchStore }, { FakeWebMcpPort }, { registerStableTools }] =
      await Promise.all([
        import("/src/state/initialState.ts"),
        import("/src/test/fakeWebMcpPort.ts"),
        import("/src/webmcp/stableTools.ts"),
      ]);
    const port = new FakeWebMcpPort();
    await registerStableTools(port, workbenchStore);
    const scenario = workbenchStore.getSnapshot().scenario;
    const result = await port.invoke("equaltrace_run_agent_route", {
      scenarioId: scenario.id,
      scenarioVersion: scenario.version,
      seed: scenario.seed,
    });
    return result.content[0]?.text;
  });

  expect(toolResult).toContain('"evidenceProvenance":"simulated"');
  await expect(page.getByText("simulated evidence recorded")).toBeVisible();
  await expect(page.getByText("native evidence recorded")).toHaveCount(0);
  await expect(page.getByText("Native WebMCP unavailable here")).toBeVisible();
});
