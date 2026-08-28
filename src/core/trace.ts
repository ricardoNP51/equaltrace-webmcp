import type { Checkpoint, Invariant, RunContext, TraceEvent } from "./types";
import { assertBoundedText, assertRouteSource } from "./validation";

type AppendTraceInput = {
  readonly checkpoint: Checkpoint;
  readonly invariant: Invariant;
  readonly evidence: string;
};

export function appendTraceEvent(
  context: RunContext,
  input: AppendTraceInput,
): TraceEvent {
  assertRouteSource(context.route, context.source);
  assertBoundedText(input.evidence, "trace.evidence");

  if (context.events.some((event) => event.checkpoint === input.checkpoint)) {
    throw new Error(
      `Checkpoint ${input.checkpoint} was already recorded for this route.`,
    );
  }

  const sequence = context.events.length + 1;
  const event: TraceEvent = Object.freeze({
    id: `${context.runId}:event:${String(sequence).padStart(2, "0")}`,
    runId: context.runId,
    sequence,
    route: context.route,
    source: context.source,
    checkpoint: input.checkpoint,
    invariant: input.invariant,
    scenarioId: context.scenarioId,
    scenarioVersion: context.scenarioVersion,
    seed: context.seed,
    evidence: input.evidence,
  });

  context.events.push(event);
  return event;
}
