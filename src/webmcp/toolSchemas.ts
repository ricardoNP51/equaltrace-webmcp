const boundedString = (maxLength: number) =>
  Object.freeze({ type: "string", minLength: 1, maxLength });

export const EMPTY_INPUT_SCHEMA = Object.freeze({
  type: "object",
  properties: Object.freeze({}),
  additionalProperties: false,
});

export const RUN_AGENT_INPUT_SCHEMA = Object.freeze({
  type: "object",
  properties: Object.freeze({
    scenarioId: boundedString(128),
    scenarioVersion: boundedString(32),
    seed: boundedString(128),
  }),
  required: Object.freeze(["scenarioId", "scenarioVersion", "seed"]),
  additionalProperties: false,
});

type ScenarioToolInput = {
  readonly scenarioId: string;
  readonly scenarioVersion: string;
  readonly seed: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseEmptyInput(input: unknown): Record<string, never> {
  if (!isRecord(input) || Object.keys(input).length !== 0) {
    throw new Error("This tool accepts an empty object and no extra fields.");
  }
  return {};
}

export function parseScenarioToolInput(input: unknown): ScenarioToolInput {
  if (!isRecord(input)) {
    throw new Error("Tool input must be an object.");
  }

  const keys = Object.keys(input);
  const allowed = new Set(["scenarioId", "scenarioVersion", "seed"]);
  if (keys.length !== 3 || keys.some((key) => !allowed.has(key))) {
    throw new Error("Tool input contains missing or unsupported fields.");
  }

  const { scenarioId, scenarioVersion, seed } = input;
  const valid =
    typeof scenarioId === "string" &&
    scenarioId.length >= 1 &&
    scenarioId.length <= 128 &&
    typeof scenarioVersion === "string" &&
    scenarioVersion.length >= 1 &&
    scenarioVersion.length <= 32 &&
    typeof seed === "string" &&
    seed.length >= 1 &&
    seed.length <= 128;

  if (!valid) {
    throw new Error("Scenario identity fields must be bounded strings.");
  }

  return { scenarioId, scenarioVersion, seed };
}
