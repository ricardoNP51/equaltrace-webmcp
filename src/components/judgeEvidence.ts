import { compareProtectionParity } from "../core/compare";
import type {
  ComparisonResult,
  Route,
  RunSnapshot,
  TraceEvent,
} from "../core/types";
import { ROUTES } from "../core/types";
import { buildFixtureRun } from "../fixtures/accountDeletion";
import type {
  EvidenceProvenance,
  WorkbenchSnapshot,
} from "../state/WorkbenchStore";

export type DisplayProvenance = EvidenceProvenance | "preview";
export type DisplayRouteEvidence = {
  readonly run: RunSnapshot;
  readonly provenance: DisplayProvenance;
};

const previewRuns: Record<Route, RunSnapshot> = {
  visual: buildFixtureRun("visual", "protected"),
  assistive: buildFixtureRun("assistive", "protected"),
  agent: buildFixtureRun("agent", "broken-agent"),
};

export function displayEvidence(
  snapshot: WorkbenchSnapshot,
): Readonly<Partial<Record<Route, DisplayRouteEvidence>>> {
  if (snapshot.phase !== "preview") return snapshot.routeEvidence;
  return Object.freeze(
    Object.fromEntries(
      ROUTES.map((route) => [
        route,
        Object.freeze({ run: previewRuns[route], provenance: "preview" }),
      ]),
    ),
  );
}

export function displayComparison(
  snapshot: WorkbenchSnapshot,
): ComparisonResult | null {
  if (snapshot.phase !== "preview") return snapshot.comparison;
  return compareProtectionParity({
    scenario: snapshot.scenario,
    runs: previewRuns,
  });
}

export function protectionCoverage(
  snapshot: WorkbenchSnapshot,
  run: RunSnapshot,
) {
  const covered = snapshot.scenario.requirements.filter((requirement) =>
    run.events.some((event) => event.checkpoint === requirement.checkpoint),
  ).length;
  return { covered, total: snapshot.scenario.requirements.length };
}

export function eventById(
  snapshot: WorkbenchSnapshot,
  eventId: string,
): TraceEvent | undefined {
  return ROUTES.flatMap(
    (route) => displayEvidence(snapshot)[route]?.run.events ?? [],
  ).find((event) => event.id === eventId);
}

export function evidenceAnchor(eventId: string) {
  return `evidence-${eventId.replaceAll(":", "-")}`;
}
