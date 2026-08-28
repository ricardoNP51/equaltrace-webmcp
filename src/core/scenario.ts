import type {
  AccountState,
  Route,
  RunContext,
  RunSnapshot,
  ScenarioDefinition,
  TraceEvent,
  TraceSource,
} from "./types";
import { assertRouteSource, assertScenarioDefinition } from "./validation";

function freezeAccountState(state: AccountState): AccountState {
  return Object.freeze({ ...state });
}

function freezeTraceEvent(event: TraceEvent): TraceEvent {
  return Object.freeze({ ...event });
}

export function createRunContext(
  scenario: ScenarioDefinition,
  route: Route,
  source: TraceSource,
  runLabel: string,
): RunContext {
  assertScenarioDefinition(scenario);
  assertRouteSource(route, source);

  const initialState = freezeAccountState(scenario.initialState);

  return {
    runId: `${scenario.id}:${scenario.version}:${scenario.seed}:${route}:${runLabel}`,
    route,
    source,
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    seed: scenario.seed,
    requestedOutcome: scenario.requestedOutcome,
    initialState,
    accountState: { ...initialState },
    events: [],
  };
}

export function snapshotRun(context: RunContext): RunSnapshot {
  return Object.freeze({
    runId: context.runId,
    route: context.route,
    source: context.source,
    scenarioId: context.scenarioId,
    scenarioVersion: context.scenarioVersion,
    seed: context.seed,
    requestedOutcome: context.requestedOutcome,
    initialState: freezeAccountState(context.initialState),
    accountState: freezeAccountState(context.accountState),
    events: Object.freeze(context.events.map(freezeTraceEvent)),
  });
}
