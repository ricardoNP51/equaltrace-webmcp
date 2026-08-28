import { ROUTES, type Route } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { StatusIcon } from "./StatusIcon";

const routeInstruction: Record<Route, string> = {
  visual: "Complete the visual journey with a primary pointer.",
  assistive: "Complete the assistive journey with Enter or space only.",
  agent: "Invoke equaltrace_run_agent_route through WebMCP.",
};

export function NextActionPanel({
  snapshot,
}: {
  readonly snapshot: WorkbenchSnapshot;
}) {
  const missing = ROUTES.filter((route) => !snapshot.routeEvidence[route]);
  let title = "Generate current-session evidence";
  let copy =
    "Reset the deterministic seed, complete the three real routes, then audit them together.";
  let detail = "Start with Reset and begin baseline.";

  if (snapshot.phase === "baseline_capture" && missing.length > 0) {
    title = `${missing.length} route${missing.length === 1 ? "" : "s"} still block the audit`;
    copy =
      "EqualTrace will not infer missing evidence or promote a partial run to pass.";
    detail = routeInstruction[missing[0]!];
  } else if (snapshot.phase === "baseline_capture") {
    title = "All three routes are ready to compare";
    copy =
      "Run the baseline audit to align each semantic checkpoint and reveal the earliest protection mismatch.";
    detail = "Use Audit baseline evidence above.";
  } else if (
    snapshot.phase === "baseline_failed" ||
    snapshot.phase === "repair_staged"
  ) {
    title = "Bypass proven. Preserve human authority next.";
    copy =
      "The next phase stages one bounded repair for the missing disclosure. Staging cannot approve or apply it.";
    detail = "Next gate: exact, visible human review and approval.";
  }

  return (
    <aside className="next-action" aria-labelledby="next-action-title">
      <span className="icon-shell">
        <StatusIcon
          name={snapshot.comparison?.status === "fail" ? "alert" : "route"}
        />
      </span>
      <div>
        <p className="section-label">Blocking guidance</p>
        <h2 id="next-action-title">{title}</h2>
        <p>{copy}</p>
        <strong>{detail}</strong>
      </div>
    </aside>
  );
}
