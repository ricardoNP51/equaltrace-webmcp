import type { Checkpoint, Route } from "../core/types";
import { ROUTES } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { displayEvidence, protectionCoverage } from "./judgeEvidence";
import { StatusIcon } from "./StatusIcon";

const metadata: Record<
  Route,
  { icon: "agent" | "assistive" | "visual"; name: string; source: string }
> = {
  visual: { icon: "visual", name: "Visual", source: "Pointer interaction" },
  assistive: {
    icon: "assistive",
    name: "Assistive",
    source: "Keyboard interaction",
  },
  agent: { icon: "agent", name: "WebMCP Agent", source: "Native invocation" },
};

const checkpointOrder: readonly Checkpoint[] = [
  "outcome.account_deleted",
  "disclosure.consequences",
  "consent.exact",
  "feedback.complete",
  "reversibility.cancel_window",
  "recovery.guidance",
];

const checkpointCopy: Record<Checkpoint, { label: string; pass: string }> = {
  "commit.delete": { label: "Commit", pass: "Committed" },
  "consent.exact": { label: "Consent", pass: "Exact consent captured" },
  "disclosure.consequences": {
    label: "Disclosure",
    pass: "Consequences shown",
  },
  "feedback.complete": { label: "Feedback", pass: "Confirmation shown" },
  "outcome.account_deleted": { label: "Outcome", pass: "Completed" },
  "recovery.guidance": { label: "Recovery", pass: "Recovery path shown" },
  "reversibility.cancel_window": {
    label: "Reversibility",
    pass: "Undo available",
  },
};

function evidenceLabel(route: Route, provenance: string, exists: boolean) {
  if (!exists)
    return route === "agent" ? "Awaiting WebMCP invocation" : "Not recorded";
  if (provenance === "preview") return "Fixture preview";
  if (provenance === "native") return "Native evidence recorded";
  if (provenance === "simulated") return "Simulated evidence recorded";
  return "Current-session evidence recorded";
}

export function RouteSummaryGrid({
  snapshot,
}: {
  readonly snapshot: WorkbenchSnapshot;
}) {
  const evidence = displayEvidence(snapshot);
  const coverages = Object.fromEntries(
    ROUTES.map((route) => {
      const entry = evidence[route];
      return [route, entry ? protectionCoverage(snapshot, entry.run) : null];
    }),
  ) as Record<Route, { covered: number; total: number } | null>;

  function hasCheckpoint(route: Route, checkpoint: Checkpoint) {
    return Boolean(
      evidence[route]?.run.events.some(
        (event) => event.checkpoint === checkpoint,
      ),
    );
  }

  return (
    <div
      className="route-ledger"
      role="table"
      aria-label="Route protection ledger"
    >
      <div className="ledger-row ledger-head" role="row">
        <div className="ledger-checkpoint" role="columnheader">
          Checkpoint
        </div>
        {ROUTES.map((route) => {
          const entry = evidence[route];
          const coverage = coverages[route];
          const broken = Boolean(coverage && coverage.covered < coverage.total);
          return (
            <div
              className="ledger-route-head"
              data-state={entry ? (broken ? "fail" : "complete") : "pending"}
              key={route}
              role="columnheader"
            >
              <span className="ledger-route-name">
                <StatusIcon name={metadata[route].icon} />
                {metadata[route].name}
              </span>
              <strong>
                {coverage ? `${coverage.covered}/${coverage.total}` : "—"}
              </strong>
              <small>
                {evidenceLabel(route, entry?.provenance ?? "", Boolean(entry))}
              </small>
            </div>
          );
        })}
      </div>

      {checkpointOrder.map((checkpoint) => (
        <div className="ledger-row" key={checkpoint} role="row">
          <div className="ledger-checkpoint" role="rowheader">
            <span>{checkpointCopy[checkpoint].label}</span>
            <code>{checkpoint}</code>
          </div>
          {ROUTES.map((route) => {
            const exists = hasCheckpoint(route, checkpoint);
            return (
              <div
                className="ledger-cell"
                data-state={exists ? "pass" : "missing"}
                key={route}
                role="cell"
              >
                <span>
                  {exists ? checkpointCopy[checkpoint].pass : "Missing"}
                </span>
                <span className="ledger-status-icon">
                  <StatusIcon name={exists ? "check" : "alert"} />
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
