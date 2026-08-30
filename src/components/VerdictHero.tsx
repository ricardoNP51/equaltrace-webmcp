import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { StatusIcon } from "./StatusIcon";

type VerdictHeroProps = {
  readonly snapshot: WorkbenchSnapshot;
  readonly onReset: () => void;
};

function provenanceLabel(snapshot: WorkbenchSnapshot) {
  if (snapshot.phase === "preview")
    return "Fixture preview · not current evidence";
  if (snapshot.phase === "verified")
    return snapshot.routeEvidence.agent?.provenance === "native"
      ? "Verified rerun · native agent evidence"
      : "Verified rerun · simulated agent evidence";
  const agent = snapshot.routeEvidence.agent;
  if (agent?.provenance === "native")
    return "Current session · native agent evidence";
  if (agent?.provenance === "simulated")
    return "Current session · simulated agent evidence";
  return "Current session · evidence incomplete";
}

export function VerdictHero({ snapshot, onReset }: VerdictHeroProps) {
  const isPreview = snapshot.phase === "preview";
  const failed = snapshot.comparison?.status === "fail";
  const verified = snapshot.phase === "verified";
  const capture =
    snapshot.phase === "baseline_capture" ||
    snapshot.phase === "repaired_capture";
  const title = verified
    ? "Same deletion. Same protections. Proven."
    : failed
      ? "Same deletion. Unequal protection."
      : capture
        ? "Prove whether every path preserves the same protections."
        : "The agent got the right result. It skipped the protections.";
  const explanation = verified
    ? "Fresh pointer, keyboard, and WebMCP evidence preserved every required protection and the requested outcome. A deterministic receipt now binds the proof."
    : failed
      ? "All three routes deleted the same fictional account, but the agent committed before receiving the consequence disclosure required on both human routes."
      : capture
        ? "Record the pointer, keyboard, and WebMCP routes from one deterministic seed. EqualTrace will fail closed until all three are comparable."
        : "This known broken fixture reaches the requested outcome on every route. The agent path starts with deletion, while people must first see consequences and give exact consent.";

  return (
    <header className="hero" aria-labelledby="page-title">
      <div className="brand-row">
        <a className="brand" href="#main-content" aria-label="EqualTrace home">
          <span className="brand-mark">
            <StatusIcon name="shield" />
          </span>
          <span>EqualTrace</span>
        </a>
        <span
          className="provenance"
          data-state={
            verified
              ? "pass"
              : isPreview
                ? "preview"
                : failed
                  ? "fail"
                  : "recorded"
          }
        >
          {provenanceLabel(snapshot)}
        </span>
      </div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker">
            Protection parity for consequential WebMCP actions
          </p>
          <h1 id="page-title">{title}</h1>
          <p className="lede">{explanation}</p>
          <div className="hero-actions">
            <button type="button" onClick={onReset}>
              {isPreview ? "Reset and begin baseline" : "Reset baseline"}
            </button>
            <p className="action-help">
              Fictional account deletion. Deterministic, local-only, and safe to
              reset.
            </p>
          </div>
        </div>

        <aside
          className="verdict-card"
          data-state={
            verified
              ? "pass"
              : failed
                ? "fail"
                : isPreview
                  ? "preview"
                  : "pending"
          }
          aria-label="Current verdict"
        >
          <div className="verdict-card-heading">
            <span className="icon-shell">
              <StatusIcon
                name={
                  verified ? "check" : failed || isPreview ? "alert" : "pending"
                }
              />
            </span>
            <span>
              {verified
                ? "Protection parity verified"
                : isPreview
                  ? "Known bypass"
                  : failed
                    ? "Protection failure"
                    : "Audit pending"}
            </span>
          </div>
          <p className="verdict-statement">
            {verified
              ? "Outcome and all protections passed."
              : capture
                ? "Evidence is still incomplete."
                : "Outcome passed. Protection parity failed."}
          </p>
          <div className="verdict-facts">
            <div>
              <span>Outcome</span>
              <strong>{capture ? "Pending" : "Deleted on 3/3 routes"}</strong>
            </div>
            <div>
              <span>{verified ? "Protections" : "First gap"}</span>
              <strong>
                {verified
                  ? "6/6 on 3/3 routes"
                  : capture
                    ? "Not audited"
                    : "Disclosure missing"}
              </strong>
            </div>
          </div>
          {isPreview && (
            <p className="preview-warning">
              Preview only — run the routes to produce current-session evidence.
            </p>
          )}
        </aside>
      </div>
    </header>
  );
}
