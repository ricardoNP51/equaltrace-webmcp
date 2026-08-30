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
    const [
      { workbenchStore },
      { FakeWebMcpPort },
      { registerStableTools },
      { startRepairCapabilityLifecycle },
    ] = await Promise.all([
      import("/src/state/initialState.ts"),
      import("/src/test/fakeWebMcpPort.ts"),
      import("/src/webmcp/stableTools.ts"),
      import("/src/webmcp/repairCapability.ts"),
    ]);
    const port = new FakeWebMcpPort();
    await registerStableTools(port, workbenchStore);
    const lifecycle = startRepairCapabilityLifecycle(port, workbenchStore);
    Reflect.set(globalThis, "__equalTraceTestPort", port);
    Reflect.set(globalThis, "__equalTraceTestLifecycle", lifecycle);
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
    const port = Reflect.get(globalThis, "__equalTraceTestPort") as {
      registered: Map<string, unknown>;
    };
    const lifecycle = Reflect.get(globalThis, "__equalTraceTestLifecycle") as {
      whenIdle(): Promise<void>;
    };
    await lifecycle.whenIdle();
    const snapshot = workbenchStore.getSnapshot();
    return {
      phase: snapshot.phase,
      approvedRepair: snapshot.approvedRepair,
      capability: snapshot.repairCapability,
      tools: [...port.registered.keys()],
    };
  });
  expect(approval.phase).toBe("repair_approved");
  expect(approval.approvedRepair).toMatchObject({
    targetScenarioId: "fictional-cloud-account-deletion",
    seed: "equaltrace-golden-01",
  });
  expect(approval.capability).toMatchObject({
    status: "registration_reported",
    provenance: "simulated",
  });
  expect(approval.tools).toContain("equaltrace_apply_approved_repair");
  await expect(
    page.getByText(/not proof that an agent discovered it/i),
  ).toBeVisible();

  const applied = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    const port = Reflect.get(globalThis, "__equalTraceTestPort") as {
      registered: Map<string, unknown>;
      invoke(name: string, input: unknown): Promise<unknown>;
    };
    const repair = workbenchStore.getSnapshot().stagedRepair!;
    await port.invoke("equaltrace_apply_approved_repair", {
      repairId: repair.repairId,
      repairDigest: repair.repairDigest,
    });
    return {
      snapshot: workbenchStore.getSnapshot(),
      tools: [...port.registered.keys()],
    };
  });
  expect(applied.snapshot).toMatchObject({
    phase: "repair_applied",
    agentPolicy: "repaired-agent",
    repairCapability: { status: "absent", reason: "used" },
  });
  expect(applied.tools).not.toContain("equaltrace_apply_approved_repair");
  await expect(
    page.getByRole("heading", { name: /repair applied exactly once/i }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: /begin fresh repaired rerun/i })
    .click();
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

  const repairedAssistiveReview = page.getByRole("button", {
    name: /review keyboard route consequences/i,
  });
  await repairedAssistiveReview.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  const verified = await page.evaluate(async () => {
    const { workbenchStore } = await import("/src/state/initialState.ts");
    const port = Reflect.get(globalThis, "__equalTraceTestPort") as {
      invoke(
        name: string,
        input: unknown,
      ): Promise<{
        content: readonly { text: string }[];
      }>;
    };
    const scenario = workbenchStore.getSnapshot().scenario;
    await port.invoke("equaltrace_run_agent_route", {
      scenarioId: scenario.id,
      scenarioVersion: scenario.version,
      seed: scenario.seed,
    });
    const audit = await port.invoke("equaltrace_run_audit", {});
    return {
      audit: JSON.parse(audit.content[0]!.text) as Record<string, unknown>,
      snapshot: workbenchStore.getSnapshot(),
    };
  });

  expect(verified.audit).toMatchObject({
    status: "pass",
    outcomeParity: true,
    receiptId: verified.snapshot.receipt?.receiptId,
  });
  expect(verified.snapshot).toMatchObject({
    phase: "verified",
    comparison: { status: "pass", outcomeParity: true },
    receipt: { verdict: "pass" },
  });
  await expect(
    page.getByRole("heading", {
      name: /same deletion. same protections. proven/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /verified proof is portable/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /evidence/i })).toHaveCount(18);
});
