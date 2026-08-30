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
  } else if (snapshot.phase === "baseline_failed") {
    title = "Bypass proven. Preserve human authority next.";
    copy =
      "The agent may now stage one bounded repair for the missing disclosure. Staging cannot approve or apply it.";
    detail = "Invoke equaltrace_stage_repair through WebMCP.";
  } else if (snapshot.phase === "repair_staged") {
    title = "Exact repair staged. Human decision required.";
    copy =
      "The proposal is bound to the current failure, scenario, seed, digest, and expiry. No agent-accessible path can approve it.";
    detail = "Review the exact change above, then approve, reject, or close.";
  } else if (snapshot.phase === "repair_approved") {
    title = "Human authority recorded. Temporary registration is bounded.";
    copy =
      "The apply capability is tied to the exact digest, nonce, scenario, seed, epoch, and expiry. UI registration state is not native discovery evidence.";
    detail =
      "Ask the supported agent to discover and invoke the exact repair tool.";
  } else if (snapshot.phase === "repair_applied") {
    title = "Repair applied once. Capability removed.";
    copy =
      "The shared agent policy is repaired and the approval can no longer be replayed. A complete three-route rerun is still required before any green verdict.";
    detail = "Begin the fresh repaired rerun above.";
  } else if (snapshot.phase === "repaired_capture" && missing.length > 0) {
    title = `${missing.length} fresh repaired route${missing.length === 1 ? "" : "s"} still required`;
    copy =
      "Old baseline traces were removed. Only evidence recreated after the applied repair can unlock verification.";
    detail = routeInstruction[missing[0]!];
  } else if (
    snapshot.phase === "repaired_capture" &&
    snapshot.comparison?.status === "fail"
  ) {
    title = "Regression found. No receipt issued.";
    copy =
      "The repaired proof failed at the recorded first divergence; a status label cannot override the comparator.";
    detail =
      "Inspect the evidence, correct the regression, then restart the repaired proof.";
  } else if (snapshot.phase === "repaired_capture") {
    title = "Fresh repaired evidence is ready";
    copy =
      "Run the repaired audit. EqualTrace will independently validate every route before hashing a receipt.";
    detail = "Use Verify repaired evidence and issue receipt above.";
  } else if (snapshot.phase === "verified") {
    title = "Winner chain complete: repaired parity is proven";
    copy =
      "The green verdict is backed by fresh evidence and a canonical portable receipt, not by applied policy state alone.";
    detail =
      "Download the receipt or repeat the equivalent proof to confirm determinism.";
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
