import type { RunContext } from "./types";
import { appendTraceEvent } from "./trace";

function requireActive(context: RunContext) {
  if (context.accountState.status !== "active") {
    throw new Error("This command requires an active fictional account.");
  }
}

function requireDeleted(context: RunContext) {
  if (context.accountState.status !== "deleted") {
    throw new Error("This command requires a deleted fictional account.");
  }
}

export function discloseConsequences(context: RunContext) {
  requireActive(context);
  appendTraceEvent(context, {
    checkpoint: "disclosure.consequences",
    invariant: "disclosure",
    evidence: `Deletion permanently disables fictional account ${context.initialState.accountId}.`,
  });
}

export function captureExactConsent(context: RunContext) {
  requireActive(context);
  appendTraceEvent(context, {
    checkpoint: "consent.exact",
    invariant: "consent",
    evidence: `Explicit consent binds deletion to fictional account ${context.initialState.accountId}.`,
  });
}

export function commitDeletion(context: RunContext) {
  requireActive(context);
  context.accountState = Object.freeze({
    accountId: context.accountState.accountId,
    status: "deleted",
  });
  appendTraceEvent(context, {
    checkpoint: "commit.delete",
    invariant: "outcome",
    evidence: `Deletion committed for fictional account ${context.initialState.accountId}.`,
  });
}

export function provideCompletionFeedback(context: RunContext) {
  requireDeleted(context);
  appendTraceEvent(context, {
    checkpoint: "feedback.complete",
    invariant: "feedback",
    evidence: `Fictional account ${context.initialState.accountId} is now deleted.`,
  });
}

export function exposeCancellationWindow(context: RunContext) {
  requireDeleted(context);
  appendTraceEvent(context, {
    checkpoint: "reversibility.cancel_window",
    invariant: "reversibility",
    evidence: "The simulated deletion can be cancelled for 30 minutes.",
  });
}

export function provideRecoveryGuidance(context: RunContext) {
  requireDeleted(context);
  appendTraceEvent(context, {
    checkpoint: "recovery.guidance",
    invariant: "recovery",
    evidence:
      "Use the simulated recovery path if this deletion was unintended.",
  });
}

export function recordDeletedOutcome(context: RunContext) {
  requireDeleted(context);
  appendTraceEvent(context, {
    checkpoint: "outcome.account_deleted",
    invariant: "outcome",
    evidence: `Observed state: fictional account ${context.initialState.accountId} is deleted.`,
  });
}
