import { compareProtectionParity } from "../core/compare";
import type { Clock, DigestService } from "../core/digest";
import { deriveStagedRepair, REPAIR_APPROVAL_WINDOW_MS } from "../core/repair";
import type {
  AgentPolicy,
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
  | "repair_approved"
  | "repair_applied";
export type EvidenceProvenance = "recorded" | "native" | "simulated";
export type NativeSupport =
  "unknown" | "unsupported" | "registration_failed" | "available";

export type RepairCapabilityStatus =
  "absent" | "registering" | "registration_reported" | "registration_failed";

export type RepairCapabilityState = {
  readonly status: RepairCapabilityStatus;
  readonly provenance: "native" | "simulated" | null;
  readonly authorityNonce: string | null;
  readonly reason:
    | "not_approved"
    | "awaiting_registration"
    | "registration_in_progress"
    | "registration_reported"
    | "used"
    | "expired"
    | "reset"
    | "revoked"
    | "proposal_edit"
    | "seed_drift"
    | "scenario_drift"
    | "intent_drift"
    | "cancelled"
    | "execution_failed"
    | "registration_failed";
  readonly error: string | null;
};

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
  readonly appliedRepair: RepairAuthority | null;
  readonly agentPolicy: AgentPolicy;
  readonly repairCapability: RepairCapabilityState;
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
    appliedRepair: snapshot.appliedRepair
      ? Object.freeze({ ...snapshot.appliedRepair })
      : null,
    repairCapability: Object.freeze({ ...snapshot.repairCapability }),
  });
}

function absentCapability(
  reason: RepairCapabilityState["reason"] = "not_approved",
): RepairCapabilityState {
  return {
    status: "absent",
    provenance: null,
    authorityNonce: null,
    reason,
    error: null,
  };
}

function sameAuthority(
  left: RepairAuthority | null,
  right: RepairAuthority,
): boolean {
  return (
    left !== null &&
    left.repairId === right.repairId &&
    left.repairDigest === right.repairDigest &&
    left.targetScenarioId === right.targetScenarioId &&
    left.targetScenarioVersion === right.targetScenarioVersion &&
    left.seed === right.seed &&
    left.approvalEpoch === right.approvalEpoch &&
    left.nonce === right.nonce &&
    left.expiresAt === right.expiresAt
  );
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
  private approvalNonceSequence = 0;
  private repairApplicationInFlight = false;

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
      appliedRepair: null,
      agentPolicy: "broken-agent",
      repairCapability: absentCapability(),
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
      appliedRepair: null,
      agentPolicy: "broken-agent",
      repairCapability: absentCapability("reset"),
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
      this.snapshot.phase === "repair_approved" ||
      this.snapshot.phase === "repair_applied"
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
      nonce: `approval-${repair.approvalEpoch}-${++this.approvalNonceSequence}`,
      expiresAt: repair.expiresAt,
    });
    this.publish({
      ...this.snapshot,
      phase: "repair_approved",
      approvedRepair: authority,
      appliedRepair: null,
      repairCapability: absentCapability("awaiting_registration"),
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
      repairCapability: absentCapability(expired ? "expired" : "revoked"),
    });
  }

  repairExpiryDelay(): number | null {
    if (
      this.snapshot.phase !== "repair_staged" &&
      this.snapshot.phase !== "repair_approved"
    ) {
      return null;
    }
    const repair = this.snapshot.stagedRepair;
    if (!repair) return null;
    return Math.max(0, repair.expiresAt - this.dependencies.clock.now());
  }

  expireRepairIfNeeded(): boolean {
    if (
      this.snapshot.phase !== "repair_staged" &&
      this.snapshot.phase !== "repair_approved"
    ) {
      return false;
    }
    const repair = this.snapshot.stagedRepair;
    if (!repair || this.dependencies.clock.now() < repair.expiresAt) {
      return false;
    }
    this.discardRepair("baseline_failed", "expired");
    return true;
  }

  reportRepairCapabilityRegistering(
    authority: RepairAuthority,
    provenance: "native" | "simulated",
  ): boolean {
    if (!this.hasCurrentAuthority(authority)) return false;
    this.publish({
      ...this.snapshot,
      repairCapability: {
        status: "registering",
        provenance,
        authorityNonce: authority.nonce,
        reason: "registration_in_progress",
        error: null,
      },
    });
    return true;
  }

  reportRepairCapabilityRegistered(
    authority: RepairAuthority,
    provenance: "native" | "simulated",
  ): boolean {
    if (!this.hasCurrentAuthority(authority)) return false;
    this.publish({
      ...this.snapshot,
      repairCapability: {
        status: "registration_reported",
        provenance,
        authorityNonce: authority.nonce,
        reason: "registration_reported",
        error: null,
      },
    });
    return true;
  }

  reportRepairCapabilityRegistrationFailure(
    authority: RepairAuthority,
    error: string,
  ): boolean {
    if (!this.hasCurrentAuthority(authority)) return false;
    const expired = this.dependencies.clock.now() >= authority.expiresAt;
    this.publish({
      ...this.snapshot,
      phase: expired ? "baseline_failed" : "repair_staged",
      stagedRepair: expired ? null : this.snapshot.stagedRepair,
      approvedRepair: null,
      repairCapability: {
        status: "registration_failed",
        provenance: null,
        authorityNonce: null,
        reason: "registration_failed",
        error,
      },
    });
    return true;
  }

  invalidateRepairCapabilityExecution(
    authority: RepairAuthority,
    reason: "cancelled" | "execution_failed",
  ): boolean {
    if (!this.hasCurrentAuthority(authority)) return false;
    const expired = this.dependencies.clock.now() >= authority.expiresAt;
    this.publish({
      ...this.snapshot,
      phase: expired ? "baseline_failed" : "repair_staged",
      stagedRepair: expired ? null : this.snapshot.stagedRepair,
      approvedRepair: null,
      repairCapability: absentCapability(expired ? "expired" : reason),
    });
    return true;
  }

  applyApprovedRepairFromCapability(
    authority: RepairAuthority,
    exactRepair: {
      readonly repairId: string;
      readonly repairDigest: string;
    },
    signal: AbortSignal,
  ): RepairAuthority {
    if (this.repairApplicationInFlight) {
      throw new Error("Another repair application is already in flight.");
    }
    this.repairApplicationInFlight = true;
    try {
      if (signal.aborted) {
        throw signal.reason instanceof Error
          ? signal.reason
          : new DOMException("Repair application was cancelled.", "AbortError");
      }
      if (!this.hasCurrentAuthority(authority)) {
        throw new Error("The repair capability authority is stale or invalid.");
      }
      if (
        exactRepair.repairId !== authority.repairId ||
        exactRepair.repairDigest !== authority.repairDigest
      ) {
        throw new Error("Repair input does not match the approved authority.");
      }
      if (this.dependencies.clock.now() >= authority.expiresAt) {
        this.discardRepair("baseline_failed", "expired");
        throw new Error("The approved repair capability expired.");
      }
      if (
        this.snapshot.repairCapability.status !== "registration_reported" ||
        this.snapshot.repairCapability.authorityNonce !== authority.nonce ||
        this.snapshot.agentPolicy !== "broken-agent"
      ) {
        throw new Error("The repair capability is not currently valid.");
      }

      this.publish({
        ...this.snapshot,
        phase: "repair_applied",
        approvedRepair: null,
        appliedRepair: authority,
        agentPolicy: "repaired-agent",
        repairCapability: absentCapability("used"),
      });
      return authority;
    } finally {
      this.repairApplicationInFlight = false;
    }
  }

  invalidateRepairForProposalEdit(epoch: number) {
    this.invalidateRepairForDrift(epoch, "proposal_edit");
  }

  invalidateRepairForSeedDrift(epoch: number) {
    this.invalidateRepairForDrift(epoch, "seed_drift");
  }

  invalidateRepairForScenarioDrift(epoch: number) {
    this.invalidateRepairForDrift(epoch, "scenario_drift");
  }

  invalidateRepairForIntentDrift(epoch: number) {
    this.invalidateRepairForDrift(epoch, "intent_drift");
  }

  private assertCurrentHumanReview(epoch: number, action: string) {
    if (epoch !== this.snapshot.epoch) {
      throw new Error(`A stale human decision cannot ${action} a repair.`);
    }
    if (this.snapshot.phase !== "repair_staged") {
      throw new Error("No current staged repair is awaiting human review.");
    }
  }

  private discardRepair(
    phase: "baseline_failed",
    reason: RepairCapabilityState["reason"] = "not_approved",
  ) {
    this.publish({
      ...this.snapshot,
      phase,
      stagedRepair: null,
      approvedRepair: null,
      repairCapability: absentCapability(reason),
    });
  }

  private hasCurrentAuthority(authority: RepairAuthority): boolean {
    return (
      this.snapshot.phase === "repair_approved" &&
      sameAuthority(this.snapshot.approvedRepair, authority) &&
      this.snapshot.stagedRepair?.repairId === authority.repairId &&
      this.snapshot.stagedRepair.repairDigest === authority.repairDigest &&
      this.snapshot.stagedRepair.expiresAt === authority.expiresAt &&
      authority.targetScenarioId === this.scenario.id &&
      authority.targetScenarioVersion === this.scenario.version &&
      authority.seed === this.scenario.seed &&
      authority.approvalEpoch === this.snapshot.epoch
    );
  }

  private invalidateRepairForDrift(
    epoch: number,
    reason: "proposal_edit" | "seed_drift" | "scenario_drift" | "intent_drift",
  ) {
    if (epoch !== this.snapshot.epoch) {
      throw new Error(
        "A stale transition cannot invalidate current authority.",
      );
    }
    if (
      this.snapshot.phase !== "repair_staged" &&
      this.snapshot.phase !== "repair_approved"
    ) {
      throw new Error("No current repair is available to invalidate.");
    }
    this.discardRepair("baseline_failed", reason);
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
