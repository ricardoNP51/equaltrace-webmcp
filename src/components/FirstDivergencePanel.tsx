import type { TraceEvent } from "../core/types";
import type { WorkbenchSnapshot } from "../state/WorkbenchStore";
import {
  displayComparison,
  displayEvidence,
  evidenceAnchor,
  eventById,
} from "./judgeEvidence";
import { StatusIcon } from "./StatusIcon";

function EvidenceLink({
  event,
  label,
}: {
  readonly event: TraceEvent;
  readonly label: string;
}) {
  return (
    <a className="evidence-link" href={`#${evidenceAnchor(event.id)}`}>
      <span>{label}</span>
      <code>{event.id}</code>
    </a>
  );
}

export function FirstDivergencePanel({
  snapshot,
}: {
  readonly snapshot: WorkbenchSnapshot;
}) {
  const comparison = displayComparison(snapshot);
  const divergence = comparison?.firstDivergence;
  if (comparison?.status !== "fail" || !divergence?.checkpoint) return null;

  const expected = divergence.expectedEvidenceIds
    .map((id) => eventById(snapshot, id))
    .filter((event): event is TraceEvent => Boolean(event));
  const agentRun = displayEvidence(snapshot).agent?.run;
  const observed = divergence.observedEvidenceIds
    .map((id) => eventById(snapshot, id))
    .filter((event): event is TraceEvent => Boolean(event));
  const observedInstead =
    observed.length > 0 ? observed : (agentRun?.events.slice(0, 1) ?? []);

  return (
    <section className="divergence-panel" aria-labelledby="divergence-title">
      <p className="sr-only" role="status" aria-label="Baseline audit verdict">
        Baseline audit failed first at {divergence.checkpoint}.
      </p>
      <div className="divergence-heading">
        <span className="icon-shell">
          <StatusIcon name="alert" />
        </span>
        <div>
          <p className="section-label">First semantic divergence</p>
          <h2 id="divergence-title">
            The agent deleted before consequences were disclosed.
          </h2>
          <p>
            Equal outcome is confirmed. Parity fails at the earliest required
            checkpoint: <code>{divergence.checkpoint}</code>.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card" data-state="expected">
          <p className="comparison-label">Expected · human routes</p>
          <h3>Consequences before commitment</h3>
          <p>
            Both human routes disclosed permanent account disablement, the
            cancellation window, and recovery path before consent or deletion.
          </p>
          <div className="evidence-links">
            {expected.map((event) => (
              <EvidenceLink
                event={event}
                label={`${event.route} evidence`}
                key={event.id}
              />
            ))}
          </div>
        </article>

        <article className="comparison-card" data-state="observed">
          <p className="comparison-label">Observed · agent route</p>
          <h3>Commitment came first</h3>
          <p>
            No disclosure event exists on the agent route. Its first recorded
            event is the deletion commitment itself.
          </p>
          <div className="evidence-links">
            {observedInstead.map((event) => (
              <EvidenceLink
                event={event}
                label="first agent evidence"
                key={event.id}
              />
            ))}
          </div>
        </article>
      </div>

      {snapshot.phase === "preview" && (
        <p className="preview-note">
          This comparison is the known broken fixture preview. It explains the
          expected failure but does not count as current-session or native
          validation.
        </p>
      )}
    </section>
  );
}
