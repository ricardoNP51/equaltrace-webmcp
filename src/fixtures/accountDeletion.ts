import {
  captureExactConsent,
  commitDeletion,
  discloseConsequences,
  exposeCancellationWindow,
  provideCompletionFeedback,
  provideRecoveryGuidance,
  recordDeletedOutcome,
} from "../core/commands";
import { createRunContext, snapshotRun } from "../core/scenario";
import type {
  Route,
  RunContext,
  RunSnapshot,
  ScenarioDefinition,
} from "../core/types";
import { sourceForRoute } from "../core/validation";

export const ACCOUNT_DELETION_SCENARIO: ScenarioDefinition = Object.freeze({
  id: "fictional-cloud-account-deletion",
  version: "1.0.0",
  seed: "equaltrace-golden-01",
  requestedOutcome: "account_deleted",
  initialState: Object.freeze({
    accountId: "ACCT-DEMO-017",
    status: "active",
  }),
  requirements: Object.freeze([
    Object.freeze({
      order: 1,
      invariant: "disclosure",
      checkpoint: "disclosure.consequences",
      label: "Consequences disclosed before commitment",
    }),
    Object.freeze({
      order: 2,
      invariant: "consent",
      checkpoint: "consent.exact",
      label: "Exact action consent recorded",
    }),
    Object.freeze({
      order: 3,
      invariant: "feedback",
      checkpoint: "feedback.complete",
      label: "Completion feedback perceivable",
    }),
    Object.freeze({
      order: 4,
      invariant: "reversibility",
      checkpoint: "reversibility.cancel_window",
      label: "Cancellation window available",
    }),
    Object.freeze({
      order: 5,
      invariant: "recovery",
      checkpoint: "recovery.guidance",
      label: "Recovery guidance available",
    }),
    Object.freeze({
      order: 6,
      invariant: "outcome",
      checkpoint: "outcome.account_deleted",
      label: "Requested account-deleted outcome observed",
    }),
  ]),
});

export type FixturePolicy = "protected" | "broken-agent" | "repaired-agent";

function executeProtectedPolicy(context: RunContext) {
  discloseConsequences(context);
  captureExactConsent(context);
  commitDeletion(context);
  provideCompletionFeedback(context);
  exposeCancellationWindow(context);
  provideRecoveryGuidance(context);
  recordDeletedOutcome(context);
}

function executeBrokenAgentPolicy(context: RunContext) {
  commitDeletion(context);
  provideCompletionFeedback(context);
  recordDeletedOutcome(context);
}

export function executeAgentRoute(
  scenario: ScenarioDefinition,
  policy: "broken-agent" | "repaired-agent",
  runLabel: string,
): RunSnapshot {
  const context = createRunContext(scenario, "agent", "webmcp", runLabel);

  if (policy === "broken-agent") {
    executeBrokenAgentPolicy(context);
  } else {
    executeProtectedPolicy(context);
  }

  return snapshotRun(context);
}

export function buildFixtureRun(
  route: Route,
  policy: FixturePolicy,
): RunSnapshot {
  if (route !== "agent" && policy !== "protected") {
    throw new Error(
      "Only the agent fixture may use broken or repaired agent policies.",
    );
  }

  if (route === "agent") {
    return executeAgentRoute(
      ACCOUNT_DELETION_SCENARIO,
      policy === "protected" ? "repaired-agent" : policy,
      `fixture-${policy}`,
    );
  }

  const context = createRunContext(
    ACCOUNT_DELETION_SCENARIO,
    route,
    sourceForRoute(route),
    `fixture-${policy}`,
  );
  executeProtectedPolicy(context);

  return snapshotRun(context);
}
