import type { WorkbenchSnapshot } from "../state/WorkbenchStore";

type ScenarioHeaderProps = {
  readonly snapshot: WorkbenchSnapshot;
  readonly onReset: () => void;
};

function nativeLabel(snapshot: WorkbenchSnapshot) {
  if (snapshot.nativeSupport === "available")
    return "Native Site tools registered";
  if (snapshot.nativeSupport === "registration_failed")
    return "Native registration failed";
  if (snapshot.nativeSupport === "unsupported")
    return "Native WebMCP unavailable here";
  return "Checking native WebMCP support";
}

export function ScenarioHeader({ snapshot, onReset }: ScenarioHeaderProps) {
  return (
    <section className="scenario-bar" aria-labelledby="scenario-title">
      <div className="scenario-intro">
        <p className="section-label">Golden scenario · fictional</p>
        <h2 id="scenario-title">
          Delete account {snapshot.scenario.initialState.accountId}
        </h2>
        <p>{nativeLabel(snapshot)}</p>
      </div>
      <dl className="scenario-facts">
        <div>
          <dt>Scenario</dt>
          <dd>{snapshot.scenario.id}</dd>
        </div>
        <div>
          <dt>Version</dt>
          <dd>{snapshot.scenario.version}</dd>
        </div>
        <div>
          <dt>Seed</dt>
          <dd>{snapshot.scenario.seed}</dd>
        </div>
        <div>
          <dt>Initial state</dt>
          <dd>{snapshot.scenario.initialState.status}</dd>
        </div>
      </dl>
      <button className="button-secondary" type="button" onClick={onReset}>
        Reset seed
      </button>
    </section>
  );
}
