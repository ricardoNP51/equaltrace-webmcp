import { ROUTES } from "../core/types";
import type {
  WorkbenchSnapshot,
  WorkbenchStore,
} from "../state/WorkbenchStore";
import { StatusIcon } from "./StatusIcon";

export function RerunPanel({
  snapshot,
  store,
}: {
  readonly snapshot: WorkbenchSnapshot;
  readonly store: WorkbenchStore;
}) {
  if (
    snapshot.phase !== "repair_applied" &&
    snapshot.phase !== "repaired_capture" &&
    snapshot.phase !== "verified"
  ) {
    return null;
  }

  const completed = ROUTES.filter(
    (route) => snapshot.routeEvidence[route] !== undefined,
  ).length;
  const failed =
    snapshot.phase === "repaired_capture" &&
    snapshot.comparison?.status === "fail";
  const verified = snapshot.phase === "verified";

  return (
    <section className="rerun-panel" aria-labelledby="rerun-title">
      <div className="repair-heading">
        <span className="icon-shell">
          <StatusIcon name={verified ? "check" : failed ? "alert" : "route"} />
        </span>
        <div>
          <p className="section-label">Repaired proof</p>
          <h2 id="rerun-title">
            {verified
              ? "Parity proven across all three fresh routes"
              : failed
                ? "The repaired rerun exposed a regression"
                : snapshot.phase === "repair_applied"
                  ? "Recreate every route from the original seed"
                  : `${completed}/3 fresh repaired routes recorded`}
          </h2>
          <p>
            {verified
              ? "Outcome parity and every required semantic protection passed. The receipt below is bound to the fresh evidence."
              : failed
                ? "A green verdict and passing receipt remain unavailable. Restart the repaired proof after correcting the divergence."
                : "Applied policy state alone cannot pass. EqualTrace clears the old traces and requires new pointer, keyboard, and WebMCP evidence."}
          </p>
        </div>
      </div>

      <div className="rerun-actions">
        {snapshot.phase === "repair_applied" || failed || verified ? (
          <button
            type="button"
            className={verified ? "button-secondary" : undefined}
            onClick={() => store.beginRepairedRerun(snapshot.epoch)}
          >
            {verified
              ? "Repeat equivalent repaired proof"
              : failed
                ? "Restart repaired proof"
                : "Begin fresh repaired rerun"}
          </button>
        ) : null}
        {snapshot.receiptError && snapshot.comparison?.status === "pass" ? (
          <button
            type="button"
            onClick={() => {
              void store.issueParityReceipt(snapshot.epoch).catch(() => {});
            }}
          >
            Retry receipt issuance
          </button>
        ) : null}
      </div>
      {snapshot.receiptError && (
        <p className="receipt-error" role="alert">
          Receipt issuance failed safely: {snapshot.receiptError}
        </p>
      )}
    </section>
  );
}
