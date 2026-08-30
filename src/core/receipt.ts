import { canonicalize } from "./canonicalize";
import { compareProtectionParity } from "./compare";
import type { DigestService } from "./digest";
import type {
  ComparisonResult,
  ParityReceipt,
  ParityReceiptBody,
  RepairAuthority,
  Route,
  RunSnapshot,
  ScenarioDefinition,
} from "./types";
import { ROUTES } from "./types";

export const RECEIPT_SCHEMA_VERSION = "1.0.0" as const;
export const EQUALTRACE_APPLICATION_VERSION = "1.0.0";

export type BuildParityReceiptInput = {
  readonly scenario: ScenarioDefinition;
  readonly runs: Readonly<Record<Route, RunSnapshot>>;
  readonly comparison: ComparisonResult;
  readonly appliedRepair: RepairAuthority;
  readonly digestService: DigestService;
};

function freezeReceipt(receipt: ParityReceipt): ParityReceipt {
  return Object.freeze({
    ...receipt,
    scenario: Object.freeze({
      ...receipt.scenario,
      initialState: Object.freeze({ ...receipt.scenario.initialState }),
    }),
    routes: Object.freeze(
      receipt.routes.map((route) =>
        Object.freeze({
          ...route,
          evidenceIds: Object.freeze([...route.evidenceIds]),
        }),
      ),
    ),
    assertions: Object.freeze(
      receipt.assertions.map((assertion) =>
        Object.freeze({
          ...assertion,
          evidenceIds: Object.freeze([...assertion.evidenceIds]),
        }),
      ),
    ),
    repair: Object.freeze({ ...receipt.repair }),
  });
}

export function parityReceiptBody(receipt: ParityReceipt): ParityReceiptBody {
  const { receiptId, ...body } = receipt;
  void receiptId;
  return body;
}

export function canonicalReceiptJson(receipt: ParityReceipt): string {
  return canonicalize(receipt);
}

export async function buildParityReceipt({
  scenario,
  runs,
  comparison,
  appliedRepair,
  digestService,
}: BuildParityReceiptInput): Promise<ParityReceipt> {
  if (comparison.status !== "pass" || !comparison.outcomeParity) {
    throw new Error(
      "A parity receipt requires a complete passing repaired comparison.",
    );
  }

  if (
    appliedRepair.targetScenarioId !== scenario.id ||
    appliedRepair.targetScenarioVersion !== scenario.version ||
    appliedRepair.seed !== scenario.seed
  ) {
    throw new Error("The applied repair does not match the receipt scenario.");
  }

  const independentComparison = compareProtectionParity({ scenario, runs });
  if (
    independentComparison.status !== "pass" ||
    !independentComparison.outcomeParity
  ) {
    throw new Error(
      "Receipt evidence failed independent protection-parity validation.",
    );
  }

  const routes = ROUTES.map((route) => {
    const run = runs[route];
    if (!run) {
      throw new Error(`Receipt evidence is missing the ${route} route.`);
    }
    return {
      route,
      runId: run.runId,
      source: run.source,
      evidenceIds: run.events.map((event) => event.id),
    };
  });

  const assertions = scenario.requirements.map((requirement) => {
    const evidenceIds = ROUTES.map((route) => {
      const match = runs[route].events.find(
        (event) => event.checkpoint === requirement.checkpoint,
      );
      if (!match) {
        throw new Error(
          `Passing assertion ${requirement.checkpoint} has no ${route} evidence.`,
        );
      }
      return match.id;
    });
    return {
      order: requirement.order,
      invariant: requirement.invariant,
      checkpoint: requirement.checkpoint,
      passed: true as const,
      evidenceIds,
    };
  });

  const body: ParityReceiptBody = {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    applicationVersion: EQUALTRACE_APPLICATION_VERSION,
    scenario: {
      id: scenario.id,
      version: scenario.version,
      seed: scenario.seed,
      requestedOutcome: scenario.requestedOutcome,
      initialState: { ...scenario.initialState },
    },
    finalOutcome: "account_deleted",
    outcomeParity: true,
    routes,
    assertions,
    repair: {
      repairId: appliedRepair.repairId,
      repairDigest: appliedRepair.repairDigest,
    },
    verdict: "pass",
  };
  const receiptId = await digestService.sha256(canonicalize(body));
  return freezeReceipt({ ...body, receiptId });
}
