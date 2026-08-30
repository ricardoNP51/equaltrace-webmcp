import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import {
  createAssistiveRouteSession,
  createVisualRouteSession,
  type HumanRoute,
  type HumanRouteSession,
  type HumanRouteStep,
} from "../core/humanRouteSession";
import type { RunSnapshot, ScenarioDefinition } from "../core/types";

type HumanRouteJourneyProps = {
  readonly route: HumanRoute;
  readonly scenario: ScenarioDefinition;
  readonly onComplete: (run: RunSnapshot) => void;
  readonly runCycle?: "baseline" | "repaired";
};

const routeName: Readonly<Record<HumanRoute, string>> = {
  visual: "Visual pointer route",
  assistive: "Keyboard and assistive route",
};

function makeSession(
  route: HumanRoute,
  scenario: ScenarioDefinition,
  runCycle: "baseline" | "repaired",
): HumanRouteSession {
  return route === "visual"
    ? createVisualRouteSession(scenario, runCycle)
    : createAssistiveRouteSession(scenario, runCycle);
}

export function HumanRouteJourney({
  route,
  scenario,
  onComplete,
  runCycle = "baseline",
}: HumanRouteJourneyProps) {
  const [session] = useState<HumanRouteSession>(() =>
    makeSession(route, scenario, runCycle),
  );
  const [step, setStep] = useState<HumanRouteStep>("ready");
  const [announcement, setAnnouncement] = useState(
    `${routeName[route]} ready.`,
  );
  const [error, setError] = useState<string | null>(null);
  const consentRef = useRef<HTMLButtonElement>(null);
  const commitRef = useRef<HTMLButtonElement>(null);
  const completionRef = useRef<HTMLHeadingElement>(null);
  const accountId = scenario.initialState.accountId;
  const journeyId = `${route}-journey`;

  useEffect(() => {
    if (step === "disclosed") consentRef.current?.focus();
    if (step === "consented") commitRef.current?.focus();
    if (step === "completed") completionRef.current?.focus();
  }, [step]);

  function advance(action: "review" | "consent" | "commit") {
    try {
      setError(null);
      if (action === "review") {
        session.reviewConsequences();
        setStep("disclosed");
        setAnnouncement(
          `Consequences disclosed. Deletion permanently disables fictional account ${accountId}. Exact consent is required next.`,
        );
        return;
      }

      if (action === "consent") {
        session.confirmExactConsent();
        setStep("consented");
        setAnnouncement(
          `Exact consent recorded for deleting fictional account ${accountId}. The final delete action is ready.`,
        );
        return;
      }

      const run = session.commit();
      onComplete(run);
      setStep("completed");
      setAnnouncement(
        `${routeName[route]} complete. Fictional account ${accountId} is deleted. Cancellation is available for 30 minutes, with a simulated recovery path.`,
      );
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "The route could not advance.";
      setError(message);
      setAnnouncement(`Route error. ${message}`);
    }
  }

  function pointerAction(
    action: "review" | "consent" | "commit",
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (route !== "visual" || !event.isPrimary || event.button !== 0) return;
    advance(action);
  }

  function keyboardAction(
    action: "review" | "consent" | "commit",
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (route !== "assistive" || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }
    event.preventDefault();
    advance(action);
  }

  const inputProps = (action: "review" | "consent" | "commit") =>
    route === "visual"
      ? {
          onPointerUp: (event: PointerEvent<HTMLButtonElement>) =>
            pointerAction(action, event),
        }
      : {
          onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
            keyboardAction(action, event),
        };

  return (
    <article className="journey" aria-labelledby={`${journeyId}-title`}>
      <div className="journey-heading">
        <div>
          <p className="section-label">
            {route === "visual" ? "Pointer-origin" : "Keyboard-origin"}
          </p>
          <h3 id={`${journeyId}-title`}>{routeName[route]}</h3>
        </div>
        <span className="status-pill">Step {step}</span>
      </div>

      {step === "ready" && (
        <div className="journey-step">
          <p>
            Begin with the consequences. No deletion or consent is recorded at
            this step.
          </p>
          <button type="button" {...inputProps("review")}>
            Review {route === "visual" ? "visual" : "keyboard"} route
            consequences
          </button>
        </div>
      )}

      {(step === "disclosed" || step === "consented") && (
        <div className="protection-copy" id={`${journeyId}-consequences`}>
          <strong>Consequences disclosed</strong>
          <p>
            Deletion permanently disables fictional account {accountId}. This
            simulation provides a 30-minute cancellation window and a recovery
            path if deletion is unintended.
          </p>
        </div>
      )}

      {step === "disclosed" && (
        <div className="journey-step">
          <p id={`${journeyId}-consent-copy`}>
            Give explicit consent for this exact action and account. Consent is
            recorded before commitment.
          </p>
          <button
            ref={consentRef}
            type="button"
            aria-describedby={`${journeyId}-consequences ${journeyId}-consent-copy`}
            {...inputProps("consent")}
          >
            Consent to delete fictional account {accountId}
          </button>
        </div>
      )}

      {step === "consented" && (
        <div className="journey-step danger-step">
          <p id={`${journeyId}-commit-copy`}>
            Exact consent is recorded. This final action changes only the
            isolated fictional route state.
          </p>
          <button
            ref={commitRef}
            type="button"
            aria-describedby={`${journeyId}-commit-copy`}
            {...inputProps("commit")}
          >
            Delete fictional account {accountId}
          </button>
        </div>
      )}

      {step === "completed" && (
        <div className="completion-panel">
          <h4 ref={completionRef} tabIndex={-1}>
            Route complete: account deleted
          </h4>
          <p>
            Fictional account {accountId} is deleted. Cancellation remains
            available for 30 minutes. Use the simulated recovery path if this
            deletion was unintended.
          </p>
        </div>
      )}

      {error && <p role="alert">{error}</p>}
      <div
        className="sr-only"
        role="status"
        aria-label={`${routeName[route]} announcements`}
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </article>
  );
}
