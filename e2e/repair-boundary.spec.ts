import { expect, test } from "@playwright/test";

test("staging stays agent-bounded while exact approval stays visible and human-only", async ({
  page,
}) => {
  await page.goto("./?approve=true&actor=human");
  await expect(
    page.getByRole("button", { name: /approve this exact repair/i }),
  ).toHaveCount(0);

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

  const toolState = await page.evaluate(async () => {
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
    await port.invoke("equaltrace_run_audit", {});
    await port.invoke("equaltrace_stage_repair", {});
    return {
      phase: workbenchStore.getSnapshot().phase,
      tools: [...port.registered.keys()],
    };
  });

  expect(toolState.phase).toBe("repair_staged");
  expect(toolState.tools).not.toContain("equaltrace_apply_approved_repair");
  await expect(
    page.getByRole("heading", { name: /review the exact bounded repair/i }),
  ).toBeVisible();
  await expect(page.getByText(/repair capability: absent/i)).toBeVisible();

  await page
    .getByRole("button", { name: /approve this exact repair/i })
    .click();

  const approval = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    const snapshot = workbenchStore.getSnapshot();
    return {
      phase: snapshot.phase,
      approvedRepair: snapshot.approvedRepair,
    };
  });
  expect(approval.phase).toBe("repair_approved");
  expect(approval.approvedRepair).toMatchObject({
    targetScenarioId: "fictional-cloud-account-deletion",
    seed: "equaltrace-golden-01",
  });
  await expect(page.getByText(/no apply tool is registered/i)).toBeVisible();
});
