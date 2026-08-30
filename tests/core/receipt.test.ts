import { describe, expect, it } from "vitest";

import { canonicalize } from "../../src/core/canonicalize";
import { compareProtectionParity } from "../../src/core/compare";
import { BrowserDigestService } from "../../src/core/digest";
import {
  buildParityReceipt,
  canonicalReceiptJson,
  parityReceiptBody,
} from "../../src/core/receipt";
import type {
  ParityReceiptBody,
  RepairAuthority,
  Route,
  RunSnapshot,
} from "../../src/core/types";
import {
  ACCOUNT_DELETION_SCENARIO,
  buildFixtureRun,
} from "../../src/fixtures/accountDeletion";

const digestService = new BrowserDigestService();
const appliedRepair: RepairAuthority = {
  repairId: "repair-disclosure-equaltrace-golden-01",
  repairDigest:
    "6a8e249b57bca0e40533e799654ef059b979293215c7a80e8bfa13a782cddecb",
  targetScenarioId: ACCOUNT_DELETION_SCENARIO.id,
  targetScenarioVersion: ACCOUNT_DELETION_SCENARIO.version,
  seed: ACCOUNT_DELETION_SCENARIO.seed,
  approvalEpoch: 1,
  nonce: "excluded-from-receipt",
  expiresAt: 1_800_000_120_000,
};

function repairedRuns(): Record<Route, RunSnapshot> {
  return {
    visual: buildFixtureRun("visual", "protected"),
    assistive: buildFixtureRun("assistive", "protected"),
    agent: buildFixtureRun("agent", "repaired-agent"),
  };
}

async function receiptFor(runs = repairedRuns()) {
  const comparison = compareProtectionParity({
    scenario: ACCOUNT_DELETION_SCENARIO,
    runs,
  });
  return buildParityReceipt({
    scenario: ACCOUNT_DELETION_SCENARIO,
    runs,
    comparison,
    appliedRepair,
    digestService,
  });
}

describe("deterministic parity receipt", () => {
  it("produces identical canonical bytes and SHA-256 identity for equivalent runs", async () => {
    const first = await receiptFor();
    const second = await receiptFor();

    expect(first.receiptId).toMatch(/^[a-f0-9]{64}$/);
    expect(second.receiptId).toBe(first.receiptId);
    expect(canonicalReceiptJson(second)).toBe(canonicalReceiptJson(first));
    expect(first.assertions).toHaveLength(6);
    expect(first.routes).toHaveLength(3);
    expect(
      first.assertions.every((assertion) => assertion.evidenceIds.length === 3),
    ).toBe(true);
  });

  it("changes identity for every meaningful receipt class", async () => {
    const receipt = await receiptFor();
    const body = parityReceiptBody(receipt);
    const mutations: readonly ((value: Record<string, unknown>) => void)[] = [
      (value) =>
        ((value.scenario as Record<string, unknown>).seed = "changed-seed"),
      (value) =>
        ((value.scenario as Record<string, unknown>).version = "2.0.0"),
      (value) =>
        ((value.repair as Record<string, unknown>).repairId = "changed-repair"),
      (value) =>
        ((value.routes as Record<string, unknown>[])[0]!.runId = "changed-run"),
      (value) =>
        ((
          (value.routes as Record<string, unknown>[])[1]!
            .evidenceIds as string[]
        )[0] = "changed-evidence"),
      (value) =>
        ((value.assertions as Record<string, unknown>[])[0]!.checkpoint =
          "changed.checkpoint"),
      (value) =>
        ((
          (value.assertions as Record<string, unknown>[])[5]!
            .evidenceIds as string[]
        )[2] = "changed-link"),
      (value) => (value.finalOutcome = "changed_outcome"),
      (value) => (value.outcomeParity = false),
      (value) => (value.verdict = "fail"),
    ];

    for (const mutate of mutations) {
      const changed = JSON.parse(JSON.stringify(body)) as Record<
        string,
        unknown
      >;
      mutate(changed);
      const changedId = await digestService.sha256(canonicalize(changed));
      expect(changedId).not.toBe(receipt.receiptId);
    }
  });

  it("refuses incomplete, failed, or independently regressed evidence", async () => {
    const complete = repairedRuns();
    const incomplete = { visual: complete.visual };
    const incompleteComparison = compareProtectionParity({
      scenario: ACCOUNT_DELETION_SCENARIO,
      runs: incomplete,
    });
    await expect(
      buildParityReceipt({
        scenario: ACCOUNT_DELETION_SCENARIO,
        runs: incomplete as Record<Route, RunSnapshot>,
        comparison: incompleteComparison,
        appliedRepair,
        digestService,
      }),
    ).rejects.toThrow(/complete passing/i);

    const regressed = {
      ...complete,
      agent: buildFixtureRun("agent", "broken-agent"),
    };
    const failedComparison = compareProtectionParity({
      scenario: ACCOUNT_DELETION_SCENARIO,
      runs: regressed,
    });
    await expect(
      buildParityReceipt({
        scenario: ACCOUNT_DELETION_SCENARIO,
        runs: regressed,
        comparison: failedComparison,
        appliedRepair,
        digestService,
      }),
    ).rejects.toThrow(/complete passing/i);

    await expect(
      buildParityReceipt({
        scenario: ACCOUNT_DELETION_SCENARIO,
        runs: regressed,
        comparison: {
          ...failedComparison,
          status: "pass",
          outcomeParity: true,
        },
        appliedRepair,
        digestService,
      }),
    ).rejects.toThrow(/independent protection-parity/i);
  });

  it("excludes volatile approval time and nonce from semantic receipt identity", async () => {
    const first = await receiptFor();
    const runs = repairedRuns();
    const comparison = compareProtectionParity({
      scenario: ACCOUNT_DELETION_SCENARIO,
      runs,
    });
    const second = await buildParityReceipt({
      scenario: ACCOUNT_DELETION_SCENARIO,
      runs,
      comparison,
      appliedRepair: {
        ...appliedRepair,
        nonce: "another-session",
        expiresAt: 9_999_999_999_999,
      },
      digestService,
    });
    expect(second.receiptId).toBe(first.receiptId);
    expect(
      canonicalize(parityReceiptBody(second) satisfies ParityReceiptBody),
    ).toBe(canonicalize(parityReceiptBody(first)));
  });
});
