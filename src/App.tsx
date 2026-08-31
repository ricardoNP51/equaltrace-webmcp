import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { FirstDivergencePanel } from "./components/FirstDivergencePanel";
import { HumanRouteJourney } from "./components/HumanRouteJourney";
import { NextActionPanel } from "./components/NextActionPanel";
import { RepairCenter } from "./components/RepairCenter";
import { ReceiptPanel } from "./components/ReceiptPanel";
import { RerunPanel } from "./components/RerunPanel";
import { RouteSummaryGrid } from "./components/RouteSummaryGrid";
import { ScenarioHeader } from "./components/ScenarioHeader";
import { VerdictHero } from "./components/VerdictHero";
import { ROUTES } from "./core/types";
import { EQUALTRACE_RELEASE_COMMIT, EQUALTRACE_RELEASE_NAME } from "./release";
import { workbenchStore } from "./state/initialState";
import type { WorkbenchStore } from "./state/WorkbenchStore";
import { useWorkbench } from "./state/useWorkbench";

type AppProps = {
  readonly store?: WorkbenchStore;
};

export function App({ store = workbenchStore }: AppProps) {
  const snapshot = useWorkbench(store);
  const isPreview = snapshot.phase === "preview";
  const captureActive =
    snapshot.phase === "baseline_capture" ||
    snapshot.phase === "repaired_capture";
  const repairedCapture = snapshot.phase === "repaired_capture";
  const allRoutesRecorded = ROUTES.every(
    (route) => snapshot.routeEvidence[route] !== undefined,
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to audit workbench
      </a>
      <main className="app-shell" id="main-content" tabIndex={-1}>
        <VerdictHero snapshot={snapshot} onReset={() => store.reset()} />
        <ScenarioHeader snapshot={snapshot} onReset={() => store.reset()} />

        <section className="workbench-section" aria-labelledby="routes-title">
          <div className="section-heading">
            <div>
              <p className="section-label">Forensic route ledger</p>
              <h2 id="routes-title">
                Same action. Three routes. One protection contract.
              </h2>
            </div>
            <span className="status-pill" data-tone="neutral">
              Semantic protection parity
            </span>
          </div>

          <RouteSummaryGrid snapshot={snapshot} />

          {captureActive && (
            <div className="human-journeys" aria-label="Human route capture">
              <HumanRouteJourney
                key={`visual-${snapshot.epoch}`}
                route="visual"
                scenario={snapshot.scenario}
                runCycle={repairedCapture ? "repaired" : "baseline"}
                onComplete={(run) =>
                  store.recordRun(run, "recorded", snapshot.epoch)
                }
              />
              <HumanRouteJourney
                key={`assistive-${snapshot.epoch}`}
                route="assistive"
                scenario={snapshot.scenario}
                runCycle={repairedCapture ? "repaired" : "baseline"}
                onComplete={(run) =>
                  store.recordRun(run, "recorded", snapshot.epoch)
                }
              />
            </div>
          )}

          {!isPreview &&
            (snapshot.phase === "baseline_capture" || repairedCapture) &&
            snapshot.comparison?.status !== "fail" && (
              <div className="audit-control">
                <div>
                  <p className="control-title">Run the semantic comparison</p>
                  <p className="action-help">
                    {allRoutesRecorded
                      ? repairedCapture
                        ? "All three fresh repaired routes are ready. Passing will issue the deterministic receipt."
                        : "All three isolated routes are ready. The audit compares ordered protections, not screenshots."
                      : "Complete both human routes and invoke the agent Site tool to unlock the audit."}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!allRoutesRecorded}
                  onClick={() => {
                    if (repairedCapture) {
                      void store
                        .auditAndIssueRepairedReceipt(snapshot.epoch)
                        .catch(() => {});
                    } else {
                      store.audit(snapshot.epoch);
                    }
                  }}
                >
                  {repairedCapture
                    ? "Verify repaired evidence and issue receipt"
                    : "Audit baseline evidence"}
                </button>
              </div>
            )}
        </section>

        <FirstDivergencePanel snapshot={snapshot} />
        <RepairCenter snapshot={snapshot} store={store} />
        <RerunPanel snapshot={snapshot} store={store} />
        <ReceiptPanel snapshot={snapshot} />
        <NextActionPanel snapshot={snapshot} />
        <EvidenceDrawer snapshot={snapshot} />

        <footer className="site-footer">
          <div>
            <span>EqualTrace</span>
            <p>Same action. Same protections. Provable.</p>
          </div>
          <p className="release-identity">
            Release <code>{EQUALTRACE_RELEASE_NAME}</code> · commit{" "}
            <code>
              {EQUALTRACE_RELEASE_COMMIT === "development"
                ? "development"
                : EQUALTRACE_RELEASE_COMMIT.slice(0, 12)}
            </code>
          </p>
        </footer>
      </main>
    </>
  );
}
