import type { Route } from "../core/types";
import { ROUTES } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { displayEvidence, protectionCoverage } from "./judgeEvidence";
import { StatusIcon } from "./StatusIcon";

const metadata: Record<Route, { name: string; source: string }> = {
  visual: { name: "Visual", source: "Pointer interaction" },
  assistive: { name: "Assistive", source: "Keyboard interaction" },
  agent: { name: "Agent", source: "WebMCP invocation" },
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
  return (
    <div className="route-grid">
      {ROUTES.map((route, index) => {
        const entry = evidence[route];
        const coverage = entry ? protectionCoverage(snapshot, entry.run) : null;
        const isBroken =
          route === "agent" &&
          Boolean(entry) &&
          (coverage?.covered ?? 0) < (coverage?.total ?? 0);
        return (
          <article
            className="route-card"
            data-state={entry ? (isBroken ? "fail" : "complete") : "pending"}
            key={route}
          >
            <div className="route-card-topline">
              <span className="route-number">0{index + 1}</span>
              <span className="icon-shell">
                <StatusIcon
                  name={entry ? (isBroken ? "alert" : "check") : "pending"}
                />
              </span>
            </div>
            <p className="route-source">{metadata[route].source}</p>
            <h3>{metadata[route].name} route</h3>
            <p className="route-status">
              {evidenceLabel(route, entry?.provenance ?? "", Boolean(entry))}
            </p>
            <div className="route-metrics">
              <span>
                Outcome{" "}
                <strong>
                  {entry ? entry.run.accountState.status : "pending"}
                </strong>
              </span>
              <span>
                Protections{" "}
                <strong>
                  {coverage ? `${coverage.covered}/${coverage.total}` : "—"}
                </strong>
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
