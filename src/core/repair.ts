import { canonicalize } from "./canonicalize";
import type { DigestService } from "./digest";
import type { Divergence, ScenarioDefinition, StagedRepair } from "./types";

export const REPAIR_APPROVAL_WINDOW_MS = 2 * 60 * 1000;

type RepairIdentity = Omit<
  StagedRepair,
  "repairDigest" | "approvalEpoch" | "expiresAt"
>;

function deriveIdentity(
  scenario: ScenarioDefinition,
  divergence: Divergence,
): RepairIdentity {
  if (
    divergence.route !== "agent" ||
    divergence.kind !== "missing_checkpoint" ||
    !divergence.checkpoint
  ) {
    throw new Error("Only a missing agent checkpoint can produce a repair.");
  }

  return Object.freeze({
    repairId: `repair-${scenario.version}-${divergence.checkpoint}`,
    targetScenarioId: scenario.id,
    targetScenarioVersion: scenario.version,
    targetToolName: "equaltrace_run_agent_route" as const,
    seed: scenario.seed,
    requestedOutcome: scenario.requestedOutcome,
    addsCheckpoints: Object.freeze([divergence.checkpoint]),
    evidenceIds: Object.freeze([
      ...divergence.expectedEvidenceIds,
      ...divergence.observedEvidenceIds,
    ]),
  });
}

export async function deriveStagedRepair({
  scenario,
  divergence,
  approvalEpoch,
  expiresAt,
  digestService,
}: {
  readonly scenario: ScenarioDefinition;
  readonly divergence: Divergence;
  readonly approvalEpoch: number;
  readonly expiresAt: number;
  readonly digestService: DigestService;
}): Promise<StagedRepair> {
  if (!Number.isSafeInteger(approvalEpoch) || approvalEpoch < 0) {
    throw new Error("Repair approval epoch must be a non-negative integer.");
  }
  if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
    throw new Error("Repair expiry must be a positive finite timestamp.");
  }

  const identity = deriveIdentity(scenario, divergence);
  const repairDigest = await digestService.sha256(canonicalize(identity));
  if (!/^[a-zA-Z0-9:_-]{8,256}$/.test(repairDigest)) {
    throw new Error("Repair digest service returned an invalid digest.");
  }

  return Object.freeze({
    ...identity,
    repairDigest,
    approvalEpoch,
    expiresAt,
  });
}
