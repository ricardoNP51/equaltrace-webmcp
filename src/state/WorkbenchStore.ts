import { compareProtectionParity } from "../core/compare";
import type { Clock, DigestService } from "../core/digest";
import { deriveStagedRepair, REPAIR_APPROVAL_WINDOW_MS } from "../core/repair";
import type {
  ComparisonResult,
  RepairAuthority,
  Route,
  RunSnapshot,
  ScenarioDefinition,
  StagedRepair,
  TraceEvent,
} from "../core/types";
import { sourceForRoute } from "../core/validation";

export type WorkbenchPhase =
  | "preview"
  | "baseline_capture"
  | "baseline_failed"
  | "repair_staged"
  | "repair_approved";
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
  readonly approvedRepair: RepairAuthority | null;
};

export type WorkbenchDependencies = {
  readonly clock: Clock;
  readonly digestService: DigestService;
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
    approvedRepair: snapshot.approvedRepair
      ? Object.freeze({ ...snapshot.approvedRepair })
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

  constructor(
    private readonly scenario: ScenarioDefinition,
    private readonly dependencies: WorkbenchDependencies,
  ) {
    this.snapshot = freezeSnapshot({
      phase: "preview",
      epoch: 0,
      scenario,
      routeEvidence: {},
      comparison: null,
      nativeSupport: "unknown",
      nativeInvoked: false,
      stagedRepair: null,
      approvedRepair: null,
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
      approvedRepair: null,
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
    if (
      this.snapshot.phase === "repair_staged" ||
      this.snapshot.phase === "repair_approved"
    ) {
      throw new Error("Repair review must be resolved before another audit.");
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

  async stageRepair(
    epoch: number,
    signal?: AbortSignal,
  ): Promise<StagedRepair> {
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

    const baselineSnapshot = this.snapshot;
    const repair = await deriveStagedRepair({
      scenario: this.scenario,
      divergence,
      approvalEpoch: epoch,
      expiresAt: this.dependencies.clock.now() + REPAIR_APPROVAL_WINDOW_MS,
      digestService: this.dependencies.digestService,
    });

    if (signal?.aborted) {
      throw signal.reason instanceof Error
        ? signal.reason
        : new DOMException("Repair staging was cancelled.", "AbortError");
    }
    if (this.snapshot !== baselineSnapshot) {
      throw new Error(
        "The baseline changed while the repair was being staged.",
      );
    }

    this.publish({
      ...this.snapshot,
      phase: "repair_staged",
      stagedRepair: repair,
      approvedRepair: null,
    });
    return repair;
  }

  approveRepairFromHumanInteraction(
    exactRepair: {
      readonly repairId: string;
      readonly repairDigest: string;
      readonly expiresAt: number;
    },
    epoch: number,
  ): RepairAuthority {
    if (epoch !== this.snapshot.epoch) {
      throw new Error("A stale human decision cannot approve a repair.");
    }
    if (this.snapshot.phase !== "repair_staged") {
      throw new Error("A visible staged repair is required for approval.");
    }

    const repair = this.snapshot.stagedRepair;
    if (!repair) {
      throw new Error("No exact repair is available for human approval.");
    }
    if (this.dependencies.clock.now() >= repair.expiresAt) {
      this.discardRepair("baseline_failed");
      throw new Error("The repair review expired and must be staged again.");
    }

    const exactMatch =
      repair.repairId === exactRepair.repairId &&
      repair.repairDigest === exactRepair.repairDigest &&
      repair.expiresAt === exactRepair.expiresAt &&
      repair.approvalEpoch === epoch &&
      repair.targetScenarioId === this.scenario.id &&
      repair.targetScenarioVersion === this.scenario.version &&
      repair.seed === this.scenario.seed;
    if (!exactMatch) {
      throw new Error(
        "Human approval does not match the visible exact repair.",
      );
    }

    const authority = Object.freeze({
      repairId: repair.repairId,
      repairDigest: repair.repairDigest,
      targetScenarioId: repair.targetScenarioId,
      targetScenarioVersion: repair.targetScenarioVersion,
      seed: repair.seed,
      approvalEpoch: repair.approvalEpoch,
      expiresAt: repair.expiresAt,
    });
    this.publish({
      ...this.snapshot,
      phase: "repair_approved",
      approvedRepair: authority,
    });
    return authority;
  }

  rejectRepairFromHumanInteraction(epoch: number) {
    this.assertCurrentHumanReview(epoch, "reject");
    this.discardRepair("baseline_failed");
  }

  closeRepairReviewFromHumanInteraction(epoch: number) {
    this.assertCurrentHumanReview(epoch, "close");
    this.discardRepair("baseline_failed");
  }

  revokeRepairApprovalFromHumanInteraction(epoch: number) {
    if (epoch !== this.snapshot.epoch) {
      throw new Error("A stale human decision cannot revoke approval.");
    }
    if (
      this.snapshot.phase !== "repair_approved" ||
      !this.snapshot.stagedRepair ||
      !this.snapshot.approvedRepair
    ) {
      throw new Error("No current human approval is available to revoke.");
    }

    const expired =
      this.dependencies.clock.now() >= this.snapshot.stagedRepair.expiresAt;
    this.publish({
      ...this.snapshot,
      phase: expired ? "baseline_failed" : "repair_staged",
      stagedRepair: expired ? null : this.snapshot.stagedRepair,
      approvedRepair: null,
    });
  }

  repairExpiryDelay(): number | null {
    const repair = this.snapshot.stagedRepair;
    if (!repair) return null;
    return Math.max(0, repair.expiresAt - this.dependencies.clock.now());
  }

  expireRepairIfNeeded(): boolean {
    const repair = this.snapshot.stagedRepair;
    if (!repair || this.dependencies.clock.now() < repair.expiresAt) {
      return false;
    }
    this.discardRepair("baseline_failed");
    return true;
  }

  private assertCurrentHumanReview(epoch: number, action: string) {
    if (epoch !== this.snapshot.epoch) {
      throw new Error(`A stale human decision cannot ${action} a repair.`);
    }
    if (this.snapshot.phase !== "repair_staged") {
      throw new Error("No current staged repair is awaiting human review.");
    }
  }

  private discardRepair(phase: "baseline_failed") {
    this.publish({
      ...this.snapshot,
      phase,
      stagedRepair: null,
      approvedRepair: null,
    });
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
