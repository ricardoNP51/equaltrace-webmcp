import type {
  Checkpoint,
  ComparisonInput,
  ComparisonResult,
  Divergence,
  ProtectionRequirement,
  Route,
  RunSnapshot,
} from "./types";
import { ROUTES } from "./types";
import { sourceForRoute } from "./validation";

function finding(
  values: Omit<Divergence, "expectedEvidenceIds" | "observedEvidenceIds"> &
    Partial<Pick<Divergence, "expectedEvidenceIds" | "observedEvidenceIds">>,
): Divergence {
  return Object.freeze({
    expectedEvidenceIds: Object.freeze([...(values.expectedEvidenceIds ?? [])]),
    observedEvidenceIds: Object.freeze([...(values.observedEvidenceIds ?? [])]),
    ...values,
  });
}

function referenceEvidenceIds(
  runs: Partial<Record<Route, RunSnapshot>>,
  checkpoint: Checkpoint,
): readonly string[] {
  return Object.freeze(
    (["visual", "assistive"] as const).flatMap((route) =>
      (runs[route]?.events ?? [])
        .filter((event) => event.checkpoint === checkpoint)
        .map((event) => event.id),
    ),
  );
}

function identityFindings(input: ComparisonInput): Divergence[] {
  const findings: Divergence[] = [];

  for (const route of ROUTES) {
    const run = input.runs[route];
    if (!run) continue;

    const identityMatches =
      run.route === route &&
      run.scenarioId === input.scenario.id &&
      run.scenarioVersion === input.scenario.version &&
      run.seed === input.scenario.seed &&
      run.requestedOutcome === input.scenario.requestedOutcome &&
      run.initialState.accountId === input.scenario.initialState.accountId &&
      run.initialState.status === input.scenario.initialState.status;

    if (!identityMatches) {
      findings.push(
        finding({
          kind: "identity_mismatch",
          route,
          explanation: `${route} does not share the exact scenario identity and initial state.`,
        }),
      );
    }
  }

  return findings;
}

function integrityFindings(run: RunSnapshot): Divergence[] {
  const findings: Divergence[] = [];
  const expectedSource = sourceForRoute(run.route);

  run.events.forEach((event, index) => {
    const expectedSequence = index + 1;
    const expectedId = `${run.runId}:event:${String(expectedSequence).padStart(2, "0")}`;
    const isValid =
      event.runId === run.runId &&
      event.id === expectedId &&
      event.sequence === expectedSequence &&
      event.route === run.route &&
      event.source === expectedSource &&
      event.scenarioId === run.scenarioId &&
      event.scenarioVersion === run.scenarioVersion &&
      event.seed === run.seed;

    if (!isValid) {
      findings.push(
        finding({
          kind: "invalid_evidence",
          route: run.route,
          checkpoint: event.checkpoint,
          invariant: event.invariant,
          observedEvidenceIds: [event.id],
          explanation: `${run.route} contains evidence with invalid identity, source, or ordering.`,
        }),
      );
    }
  });

  if (run.accountState.status !== "deleted") {
    findings.push(
      finding({
        kind: "outcome_mismatch",
        route: run.route,
        invariant: "outcome",
        checkpoint: "outcome.account_deleted",
        explanation: `${run.route} did not reach the requested deleted-account outcome.`,
      }),
    );
  }

  return findings;
}

function requirementFindings(
  input: ComparisonInput,
  requirement: ProtectionRequirement,
  previousSequenceByRoute: Record<Route, number>,
): Divergence[] {
  const findings: Divergence[] = [];
  const expectedEvidenceIds = referenceEvidenceIds(
    input.runs,
    requirement.checkpoint,
  );

  for (const route of ROUTES) {
    const run = input.runs[route];
    if (!run) continue;

    const matches = run.events.filter(
      (event) => event.checkpoint === requirement.checkpoint,
    );

    if (matches.length === 0) {
      findings.push(
        finding({
          kind: "missing_checkpoint",
          route,
          invariant: requirement.invariant,
          checkpoint: requirement.checkpoint,
          expectedEvidenceIds,
          explanation: `${route} reached the outcome without ${requirement.label.toLowerCase()}.`,
        }),
      );
      continue;
    }

    if (matches.length > 1) {
      findings.push(
        finding({
          kind: "duplicated_checkpoint",
          route,
          invariant: requirement.invariant,
          checkpoint: requirement.checkpoint,
          expectedEvidenceIds,
          observedEvidenceIds: matches.map((event) => event.id),
          explanation: `${route} duplicated the ${requirement.checkpoint} evidence.`,
        }),
      );
      continue;
    }

    const match = matches[0];
    if (!match) continue;

    if (match.invariant !== requirement.invariant) {
      findings.push(
        finding({
          kind: "invalid_evidence",
          route,
          invariant: requirement.invariant,
          checkpoint: requirement.checkpoint,
          expectedEvidenceIds,
          observedEvidenceIds: [match.id],
          explanation: `${route} assigned the wrong invariant to ${requirement.checkpoint}.`,
        }),
      );
      continue;
    }

    const commit = run.events.find(
      (event) => event.checkpoint === "commit.delete",
    );
    const mustPrecedeCommit =
      requirement.invariant === "disclosure" ||
      requirement.invariant === "consent";
    if (mustPrecedeCommit && commit && match.sequence > commit.sequence) {
      findings.push(
        finding({
          kind: "reordered_checkpoint",
          route,
          invariant: requirement.invariant,
          checkpoint: requirement.checkpoint,
          expectedEvidenceIds,
          observedEvidenceIds: [match.id, commit.id],
          explanation: `${route} recorded ${requirement.checkpoint} after the consequential commitment.`,
        }),
      );
      continue;
    }

    if (match.sequence <= previousSequenceByRoute[route]) {
      findings.push(
        finding({
          kind: "reordered_checkpoint",
          route,
          invariant: requirement.invariant,
          checkpoint: requirement.checkpoint,
          expectedEvidenceIds,
          observedEvidenceIds: [match.id],
          explanation: `${route} recorded ${requirement.checkpoint} outside the required semantic order.`,
        }),
      );
      continue;
    }

    previousSequenceByRoute[route] = match.sequence;
  }

  return findings;
}

export function compareProtectionParity(
  input: ComparisonInput,
): ComparisonResult {
  const missingRoutes = ROUTES.filter((route) => !input.runs[route]);
  if (missingRoutes.length > 0) {
    const findings = missingRoutes.map((route) =>
      finding({
        kind: "missing_route",
        route,
        explanation: `${route} evidence has not been recorded.`,
      }),
    );

    return Object.freeze({
      status: "incomplete",
      outcomeParity: false,
      firstDivergence: findings[0] ?? null,
      findings: Object.freeze(findings),
    });
  }

  const identity = identityFindings(input);
  if (identity.length > 0) {
    return Object.freeze({
      status: "incomplete",
      outcomeParity: false,
      firstDivergence: identity[0] ?? null,
      findings: Object.freeze(identity),
    });
  }

  const integrity = ROUTES.flatMap((route) =>
    integrityFindings(input.runs[route]!),
  );
  const outcomeParity = ROUTES.every(
    (route) => input.runs[route]?.accountState.status === "deleted",
  );
  const previousSequenceByRoute: Record<Route, number> = {
    visual: 0,
    assistive: 0,
    agent: 0,
  };
  const protections = input.scenario.requirements.flatMap((requirement) =>
    requirementFindings(input, requirement, previousSequenceByRoute),
  );
  const findings = [...integrity, ...protections];

  return Object.freeze({
    status: findings.length === 0 && outcomeParity ? "pass" : "fail",
    outcomeParity,
    firstDivergence: findings[0] ?? null,
    findings: Object.freeze(findings),
  });
}
