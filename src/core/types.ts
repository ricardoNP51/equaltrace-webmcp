export const ROUTES = ["visual", "assistive", "agent"] as const;
export type Route = (typeof ROUTES)[number];

export type TraceSource = "pointer" | "keyboard" | "webmcp";

export type Invariant =
  | "disclosure"
  | "consent"
  | "feedback"
  | "reversibility"
  | "recovery"
  | "outcome";

export type Checkpoint =
  | "disclosure.consequences"
  | "consent.exact"
  | "commit.delete"
  | "feedback.complete"
  | "reversibility.cancel_window"
  | "recovery.guidance"
  | "outcome.account_deleted";

export type AccountState = {
  readonly accountId: string;
  readonly status: "active" | "deleted";
};

export type ProtectionRequirement = {
  readonly order: number;
  readonly invariant: Invariant;
  readonly checkpoint: Checkpoint;
  readonly label: string;
};

export type ScenarioDefinition = {
  readonly id: string;
  readonly version: string;
  readonly seed: string;
  readonly requestedOutcome: "account_deleted";
  readonly initialState: AccountState;
  readonly requirements: readonly ProtectionRequirement[];
};

export type TraceEvent = {
  readonly id: string;
  readonly runId: string;
  readonly sequence: number;
  readonly route: Route;
  readonly source: TraceSource;
  readonly checkpoint: Checkpoint;
  readonly invariant: Invariant;
  readonly scenarioId: string;
  readonly scenarioVersion: string;
  readonly seed: string;
  readonly evidence: string;
};

export type RunContext = {
  readonly runId: string;
  readonly route: Route;
  readonly source: TraceSource;
  readonly scenarioId: string;
  readonly scenarioVersion: string;
  readonly seed: string;
  readonly requestedOutcome: "account_deleted";
  readonly initialState: AccountState;
  accountState: AccountState;
  events: TraceEvent[];
};

export type RunSnapshot = Omit<RunContext, "events"> & {
  readonly accountState: AccountState;
  readonly events: readonly TraceEvent[];
};

export type DivergenceKind =
  | "missing_route"
  | "identity_mismatch"
  | "invalid_evidence"
  | "outcome_mismatch"
  | "missing_checkpoint"
  | "reordered_checkpoint"
  | "duplicated_checkpoint";

export type Divergence = {
  readonly kind: DivergenceKind;
  readonly route?: Route;
  readonly invariant?: Invariant;
  readonly checkpoint?: Checkpoint;
  readonly expectedEvidenceIds: readonly string[];
  readonly observedEvidenceIds: readonly string[];
  readonly explanation: string;
};

export type ComparisonResult = {
  readonly status: "incomplete" | "fail" | "pass";
  readonly outcomeParity: boolean;
  readonly firstDivergence: Divergence | null;
  readonly findings: readonly Divergence[];
};

export type ComparisonInput = {
  readonly scenario: ScenarioDefinition;
  readonly runs: Partial<Record<Route, RunSnapshot>>;
};

export type StagedRepair = {
  readonly repairId: string;
  readonly targetScenarioId: string;
  readonly targetScenarioVersion: string;
  readonly targetToolName: "equaltrace_run_agent_route";
  readonly seed: string;
  readonly requestedOutcome: "account_deleted";
  readonly addsCheckpoints: readonly Checkpoint[];
  readonly evidenceIds: readonly string[];
  readonly repairDigest: string;
  readonly approvalEpoch: number;
  readonly expiresAt: number;
};

export type RepairAuthority = {
  readonly repairId: string;
  readonly repairDigest: string;
  readonly targetScenarioId: string;
  readonly targetScenarioVersion: string;
  readonly seed: string;
  readonly approvalEpoch: number;
  readonly expiresAt: number;
};
