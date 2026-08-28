import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { FirstDivergencePanel } from "./components/FirstDivergencePanel";
import { HumanRouteJourney } from "./components/HumanRouteJourney";
import { NextActionPanel } from "./components/NextActionPanel";
import { RouteSummaryGrid } from "./components/RouteSummaryGrid";
import { ScenarioHeader } from "./components/ScenarioHeader";
import { VerdictHero } from "./components/VerdictHero";
import { ROUTES } from "./core/types";
import { workbenchStore } from "./state/initialState";
import type { WorkbenchStore } from "./state/WorkbenchStore";
import { useWorkbench } from "./state/useWorkbench";

type AppProps = {
  readonly store?: WorkbenchStore;
};

export function App({ store = workbenchStore }: AppProps) {
  const snapshot = useWorkbench(store);
  const isPreview = snapshot.phase === "preview";
  const baselineActive = snapshot.phase === "baseline_capture";
  const allRoutesRecorded = ROUTES.every(
    (route) => snapshot.routeEvidence[route] !== undefined,
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to audit workbench
      </a>
      <main className="app-shell" id="main-content">
        <VerdictHero snapshot={snapshot} onReset={() => store.reset()} />
        <ScenarioHeader snapshot={snapshot} onReset={() => store.reset()} />

        <section className="workbench-section" aria-labelledby="routes-title">
          <div className="section-heading">
            <div>
              <p className="section-label">Comparable routes</p>
              <h2 id="routes-title">Same action. Three paths. One standard.</h2>
            </div>
            <span className="status-pill" data-tone="neutral">
              Semantic protection parity
            </span>
          </div>

          <RouteSummaryGrid snapshot={snapshot} />

          {baselineActive && (
            <div className="human-journeys" aria-label="Human route capture">
              <HumanRouteJourney
                key={`visual-${snapshot.epoch}`}
                route="visual"
                scenario={snapshot.scenario}
                onComplete={(run) =>
                  store.recordRun(run, "recorded", snapshot.epoch)
                }
              />
              <HumanRouteJourney
                key={`assistive-${snapshot.epoch}`}
                route="assistive"
                scenario={snapshot.scenario}
                onComplete={(run) =>
                  store.recordRun(run, "recorded", snapshot.epoch)
                }
              />
            </div>
          )}

          {!isPreview && snapshot.comparison?.status !== "fail" && (
            <div className="audit-control">
              <div>
                <p className="control-title">Run the semantic comparison</p>
                <p className="action-help">
                  {allRoutesRecorded
                    ? "All three isolated routes are ready. The audit compares ordered protections, not screenshots."
                    : "Complete both human routes and invoke the agent Site tool to unlock the audit."}
                </p>
              </div>
              <button
                type="button"
                disabled={!allRoutesRecorded}
                onClick={() => store.audit(snapshot.epoch)}
              >
                Audit baseline evidence
              </button>
            </div>
          )}
        </section>

        <FirstDivergencePanel snapshot={snapshot} />
        <NextActionPanel snapshot={snapshot} />
        <EvidenceDrawer snapshot={snapshot} />

        <footer className="site-footer">
          <span>EqualTrace</span>
          <p>Same action. Same protections. Provable.</p>
        </footer>
      </main>
    </>
  );
}
