import type { Route, ScenarioDefinition, TraceSource } from "./types";

const SOURCE_BY_ROUTE: Readonly<Record<Route, TraceSource>> = Object.freeze({
  visual: "pointer",
  assistive: "keyboard",
  agent: "webmcp",
});

export function sourceForRoute(route: Route): TraceSource {
  return SOURCE_BY_ROUTE[route];
}

export function assertRouteSource(route: Route, source: TraceSource) {
  if (SOURCE_BY_ROUTE[route] !== source) {
    throw new Error(`Route ${route} cannot emit ${source} evidence.`);
  }
}

export function assertBoundedText(
  value: string,
  field: string,
  maxLength = 500,
) {
  if (value.trim().length === 0 || value.length > maxLength) {
    throw new Error(
      `${field} must contain between 1 and ${maxLength} characters.`,
    );
  }
}

export function assertScenarioDefinition(scenario: ScenarioDefinition) {
  assertBoundedText(scenario.id, "scenario.id", 80);
  assertBoundedText(scenario.version, "scenario.version", 40);
  assertBoundedText(scenario.seed, "scenario.seed", 80);
  assertBoundedText(
    scenario.initialState.accountId,
    "scenario.initialState.accountId",
    80,
  );

  if (scenario.initialState.status !== "active") {
    throw new Error(
      "The golden scenario must begin with an active fictional account.",
    );
  }

  if (scenario.requirements.length === 0) {
    throw new Error(
      "A scenario must define at least one protection requirement.",
    );
  }

  scenario.requirements.forEach((requirement, index) => {
    if (requirement.order !== index + 1) {
      throw new Error(
        "Protection requirements must use contiguous one-based ordering.",
      );
    }
  });
}
