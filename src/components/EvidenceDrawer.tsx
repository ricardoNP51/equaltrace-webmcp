import { ROUTES } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import { displayEvidence, evidenceAnchor } from "./judgeEvidence";

export function EvidenceDrawer({
  snapshot,
}: {
  readonly snapshot: WorkbenchSnapshot;
}) {
  const evidence = displayEvidence(snapshot);
  const preview = snapshot.phase === "preview";
  return (
    <section className="evidence-section" aria-labelledby="evidence-title">
      <div>
        <p className="section-label">Progressive evidence</p>
        <h2 id="evidence-title">Inspect the semantic trace ledger</h2>
      </div>
      <details className="evidence-drawer">
        <summary>
          <span>Open trace evidence</span>
          <span className="summary-meta">
            {preview ? "Fixture preview" : "Current session"}
          </span>
        </summary>
        <div className="evidence-content">
          <p className="drawer-intro">
            {preview
              ? "These deterministic fixture events explain the known bypass. They are not native evidence."
              : "These events were captured in this page session. Provenance is shown for every route."}
          </p>
          {ROUTES.map((route) => {
            const entry = evidence[route];
            return (
              <article className="trace-group" key={route}>
                <div className="trace-heading">
                  <h3>{route} route</h3>
                  <span>
                    {entry
                      ? `${entry.provenance} · ${entry.run.source}`
                      : "not recorded"}
                  </span>
                </div>
                {entry ? (
                  <ol className="trace-list">
                    {entry.run.events.map((event) => (
                      <li id={evidenceAnchor(event.id)} key={event.id}>
                        <div>
                          <span className="trace-sequence">
                            {String(event.sequence).padStart(2, "0")}
                          </span>
                          <code>{event.checkpoint}</code>
                        </div>
                        <p>{event.evidence}</p>
                        <code className="event-id">{event.id}</code>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="empty-evidence">
                    No evidence recorded for this route.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </details>
    </section>
  );
}
