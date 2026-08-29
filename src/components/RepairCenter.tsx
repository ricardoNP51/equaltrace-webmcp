import { useEffect } from "react";

import type {
  WorkbenchSnapshot,
  WorkbenchStore,
} from "../state/WorkbenchStore";
import { StatusIcon } from "./StatusIcon";

export function RepairCenter({
  snapshot,
  store,
}: {
  readonly snapshot: WorkbenchSnapshot;
  readonly store: WorkbenchStore;
}) {
  const repair = snapshot.stagedRepair;

  useEffect(() => {
    if (!repair) return;
    const delay = store.repairExpiryDelay();
    if (delay === null) return;
    const timeout = globalThis.setTimeout(
      () => store.expireRepairIfNeeded(),
      Math.min(delay + 1, 2_147_483_647),
    );
    return () => globalThis.clearTimeout(timeout);
  }, [repair, store]);

  if (!repair) return null;

  const approved = snapshot.phase === "repair_approved";
  const expiry = new Date(repair.expiresAt);

  return (
    <section className="repair-center" aria-labelledby="repair-center-title">
      <div className="repair-heading">
        <span className="icon-shell">
          <StatusIcon name={approved ? "check" : "shield"} />
        </span>
        <div>
          <p className="section-label">Human authority boundary</p>
          <h2 id="repair-center-title">
            {approved
              ? "Exact repair approved by a person"
              : "Review the exact bounded repair"}
          </h2>
          <p>
            {approved
              ? "Approval is bound to this digest, scenario, seed, epoch, and expiry. The consequential WebMCP capability remains absent until the next implementation gate."
              : "Staging changed neither policy nor capability. Only these visible controls can approve or reject the exact proposal."}
          </p>
        </div>
      </div>

      <dl className="repair-facts">
        <div>
          <dt>Affected action</dt>
          <dd>
            Delete fictional account{" "}
            <code>{snapshot.scenario.initialState.accountId}</code>
          </dd>
        </div>
        <div>
          <dt>Target tool</dt>
          <dd>
            <code>{repair.targetToolName}</code>
          </dd>
        </div>
        <div>
          <dt>Exact change</dt>
          <dd>
            Add <code>{repair.addsCheckpoints.join(", ")}</code> before deletion
          </dd>
        </div>
        <div>
          <dt>Consequence</dt>
          <dd>
            The agent must disclose permanent account loss before it may commit
            the same deletion outcome.
          </dd>
        </div>
        <div>
          <dt>Scenario / seed</dt>
          <dd>
            <code>{repair.targetScenarioId}</code> · <code>{repair.seed}</code>
          </dd>
        </div>
        <div>
          <dt>Approval expires</dt>
          <dd>
            <time dateTime={expiry.toISOString()}>
              {expiry.toLocaleString()}
            </time>
          </dd>
        </div>
        <div className="repair-identity">
          <dt>Repair identity</dt>
          <dd>
            <code>{repair.repairId}</code>
          </dd>
        </div>
        <div className="repair-identity">
          <dt>SHA-256 repair digest</dt>
          <dd>
            <code>{repair.repairDigest}</code>
          </dd>
        </div>
      </dl>

      <div className="capability-absence" role="status" aria-live="polite">
        <strong>Repair capability: absent</strong>
        <span>
          {approved
            ? "Human authority is recorded, but no apply tool is registered in this phase."
            : "The agent can inspect this proposal but cannot approve or apply it."}
        </span>
      </div>

      <div className="repair-actions">
        {approved ? (
          <button
            type="button"
            className="button-secondary"
            onClick={() =>
              store.revokeRepairApprovalFromHumanInteraction(snapshot.epoch)
            }
          >
            Revoke human approval
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                store.approveRepairFromHumanInteraction(
                  {
                    repairId: repair.repairId,
                    repairDigest: repair.repairDigest,
                    expiresAt: repair.expiresAt,
                  },
                  snapshot.epoch,
                )
              }
            >
              Approve this exact repair
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                store.rejectRepairFromHumanInteraction(snapshot.epoch)
              }
            >
              Reject repair
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                store.closeRepairReviewFromHumanInteraction(snapshot.epoch)
              }
            >
              Close without approval
            </button>
          </>
        )}
      </div>
    </section>
  );
}
