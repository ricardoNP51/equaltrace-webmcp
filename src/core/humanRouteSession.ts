import {
  captureExactConsent,
  commitDeletion,
  discloseConsequences,
  exposeCancellationWindow,
  provideCompletionFeedback,
  provideRecoveryGuidance,
  recordDeletedOutcome,
} from "./commands";
import { createRunContext, snapshotRun } from "./scenario";
import type {
  Route,
  RunContext,
  RunSnapshot,
  ScenarioDefinition,
} from "./types";

export type HumanRoute = Extract<Route, "visual" | "assistive">;
export type HumanRouteStep = "ready" | "disclosed" | "consented" | "completed";

export interface HumanRouteSession {
  readonly route: HumanRoute;
  readonly step: HumanRouteStep;
  reviewConsequences(): void;
  confirmExactConsent(): void;
  commit(): RunSnapshot;
}

class DeterministicHumanRouteSession implements HumanRouteSession {
  private currentStep: HumanRouteStep = "ready";

  constructor(
    readonly route: HumanRoute,
    private readonly context: RunContext,
  ) {}

  get step() {
    return this.currentStep;
  }

  reviewConsequences() {
    this.requireStep("ready");
    discloseConsequences(this.context);
    this.currentStep = "disclosed";
  }

  confirmExactConsent() {
    this.requireStep("disclosed");
    captureExactConsent(this.context);
    this.currentStep = "consented";
  }

  commit() {
    this.requireStep("consented");
    commitDeletion(this.context);
    provideCompletionFeedback(this.context);
    exposeCancellationWindow(this.context);
    provideRecoveryGuidance(this.context);
    recordDeletedOutcome(this.context);
    this.currentStep = "completed";
    return snapshotRun(this.context);
  }

  private requireStep(expected: HumanRouteStep) {
    if (this.currentStep !== expected) {
      throw new Error(
        `${this.route} route expected ${expected}, received ${this.currentStep}.`,
      );
    }
  }
}

function createSession(
  scenario: ScenarioDefinition,
  route: HumanRoute,
  runCycle: "baseline" | "repaired" = "baseline",
): HumanRouteSession {
  const source = route === "visual" ? "pointer" : "keyboard";
  const context = createRunContext(
    scenario,
    route,
    source,
    `current-${runCycle}-${route}`,
  );
  return new DeterministicHumanRouteSession(route, context);
}

export function createVisualRouteSession(
  scenario: ScenarioDefinition,
  runCycle: "baseline" | "repaired" = "baseline",
) {
  return createSession(scenario, "visual", runCycle);
}

export function createAssistiveRouteSession(
  scenario: ScenarioDefinition,
  runCycle: "baseline" | "repaired" = "baseline",
) {
  return createSession(scenario, "assistive", runCycle);
}
