import { compareProtectionParity } from "../core/compare";
import type {
  ComparisonResult,
  Route,
  RunSnapshot,
  ScenarioDefinition,
  StagedRepair,
  TraceEvent,
} from "../core/types";
import { sourceForRoute } from "../core/validation";

export type WorkbenchPhase =
  "preview" | "baseline_capture" | "baseline_failed" | "repair_staged";
export type EvidenceProvenance = "recorded" | "native" | "simulated";
export type NativeSupport =
  "unknown" | "unsupported" | "registration_failed" | "available";

export type RouteEvidence = {
  readonly run: RunSnapshot;
  readonly provenance: EvidenceProvenance;
};

export type WorkbenchSnapshot = {
  readonly phase: WorkbenchPhase;
  readonly epoch: number;
  readonly scenario: ScenarioDefinition;
  readonly routeEvidence: Readonly<Partial<Record<Route, RouteEvidence>>>;
  readonly comparison: ComparisonResult | null;
  readonly nativeSupport: NativeSupport;
  readonly nativeInvoked: boolean;
  readonly stagedRepair: StagedRepair | null;
};

type Listener = () => void;

function cloneEvent(event: TraceEvent): TraceEvent {
  return Object.freeze({ ...event });
}

function cloneRun(run: RunSnapshot): RunSnapshot {
  return Object.freeze({
    ...run,
    initialState: Object.freeze({ ...run.initialState }),
    accountState: Object.freeze({ ...run.accountState }),
    events: Object.freeze(run.events.map(cloneEvent)),
  });
}

function freezeSnapshot(snapshot: WorkbenchSnapshot): WorkbenchSnapshot {
  return Object.freeze({
    ...snapshot,
    routeEvidence: Object.freeze({ ...snapshot.routeEvidence }),
    stagedRepair: snapshot.stagedRepair
      ? Object.freeze({
          ...snapshot.stagedRepair,
          addsCheckpoints: Object.freeze([
            ...snapshot.stagedRepair.addsCheckpoints,
          ]),
          evidenceIds: Object.freeze([...snapshot.stagedRepair.evidenceIds]),
        })
      : null,
  });
}

function assertEvidenceProvenance(
  route: Route,
  provenance: EvidenceProvenance,
) {
  const allowed =
    route === "agent"
      ? provenance === "native" || provenance === "simulated"
      : provenance === "recorded";

  if (!allowed) {
    throw new Error(
      `${route} cannot be recorded with ${provenance} provenance.`,
    );
  }
}

export class WorkbenchStore {
  private readonly listeners = new Set<Listener>();
  private snapshot: WorkbenchSnapshot;

  constructor(private readonly scenario: ScenarioDefinition) {
    this.snapshot = freezeSnapshot({
      phase: "preview",
      epoch: 0,
      scenario,
      routeEvidence: {},
      comparison: null,
      nativeSupport: "unknown",
      nativeInvoked: false,
      stagedRepair: null,
    });
  }

  readonly getSnapshot = () => this.snapshot;

  readonly subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  reset() {
    this.publish({
      phase: "baseline_capture",
      epoch: this.snapshot.epoch + 1,
      scenario: this.scenario,
      routeEvidence: {},
      comparison: null,
      nativeSupport: this.snapshot.nativeSupport,
      nativeInvoked: false,
      stagedRepair: null,
    });
  }

  setNativeSupport(nativeSupport: NativeSupport) {
    this.publish({ ...this.snapshot, nativeSupport });
  }

  recordRun(run: RunSnapshot, provenance: EvidenceProvenance, epoch: number) {
    if (this.snapshot.phase !== "baseline_capture") {
      throw new Error(
        "Begin or reset the baseline before recording route evidence.",
      );
    }

    if (epoch !== this.snapshot.epoch) {
      throw new Error(
        "Stale route evidence cannot enter the current baseline.",
      );
    }

    this.assertCompatibleRun(run);
    assertEvidenceProvenance(run.route, provenance);

    if (
      provenance === "native" &&
      this.snapshot.nativeSupport !== "available"
    ) {
      throw new Error(
        "Native evidence requires an available native WebMCP environment.",
      );
    }

    if (this.snapshot.routeEvidence[run.route]) {
      throw new Error(
        `${run.route} evidence is already recorded for this baseline.`,
      );
    }

    const entry = Object.freeze({ run: cloneRun(run), provenance });
    this.publish({
      ...this.snapshot,
      routeEvidence: { ...this.snapshot.routeEvidence, [run.route]: entry },
      comparison: null,
      nativeInvoked: this.snapshot.nativeInvoked || provenance === "native",
    });
  }

  audit(epoch: number): ComparisonResult {
    if (epoch !== this.snapshot.epoch) {
      throw new Error("A stale audit cannot evaluate the current baseline.");
    }

    if (this.snapshot.phase === "preview") {
      throw new Error("Begin or reset the baseline before auditing evidence.");
    }

    const runs: Partial<Record<Route, RunSnapshot>> = {};
    for (const [route, evidence] of Object.entries(
      this.snapshot.routeEvidence,
    ) as [Route, RouteEvidence][]) {
      runs[route] = evidence.run;
    }

    const comparison = compareProtectionParity({
      scenario: this.scenario,
      runs,
    });
    this.publish({
      ...this.snapshot,
      phase:
        comparison.status === "fail" ? "baseline_failed" : "baseline_capture",
      comparison,
    });
    return comparison;
  }

  stageRepair(epoch: number): StagedRepair {
    if (epoch !== this.snapshot.epoch) {
      throw new Error("A stale request cannot stage a repair.");
    }

    if (
      this.snapshot.phase !== "baseline_failed" ||
      this.snapshot.comparison?.status !== "fail"
    ) {
      throw new Error(
        "A current failed baseline is required before staging a repair.",
      );
    }

    const divergence = this.snapshot.comparison.firstDivergence;
    if (!divergence?.checkpoint || divergence.route !== "agent") {
      throw new Error("The current divergence is not eligible for repair.");
    }

    const repair = Object.freeze({
      repairId: `repair-${this.scenario.version}-${divergence.checkpoint}`,
      targetScenarioId: this.scenario.id,
      targetScenarioVersion: this.scenario.version,
      targetToolName: "equaltrace_run_agent_route" as const,
      seed: this.scenario.seed,
      addsCheckpoints: Object.freeze([divergence.checkpoint]),
      evidenceIds: Object.freeze([
        ...divergence.expectedEvidenceIds,
        ...divergence.observedEvidenceIds,
      ]),
    });

    this.publish({
      ...this.snapshot,
      phase: "repair_staged",
      stagedRepair: repair,
    });
    return repair;
  }

  private assertCompatibleRun(run: RunSnapshot) {
    const matches =
      run.scenarioId === this.scenario.id &&
      run.scenarioVersion === this.scenario.version &&
      run.seed === this.scenario.seed &&
      run.requestedOutcome === this.scenario.requestedOutcome &&
      run.initialState.accountId === this.scenario.initialState.accountId &&
      run.initialState.status === this.scenario.initialState.status &&
      run.source === sourceForRoute(run.route);

    if (!matches) {
      throw new Error(
        "Route evidence is incompatible with the active deterministic scenario.",
      );
    }
  }

  private publish(snapshot: WorkbenchSnapshot) {
    this.snapshot = freezeSnapshot(snapshot);
    this.listeners.forEach((listener) => listener());
  }
}
