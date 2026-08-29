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

export const APPLY_REPAIR_INPUT_SCHEMA = Object.freeze({
  type: "object",
  properties: Object.freeze({
    repairId: boundedString(256),
    repairDigest: boundedString(256),
  }),
  required: Object.freeze(["repairId", "repairDigest"]),
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

export function parseApplyRepairInput(input: unknown): {
  readonly repairId: string;
  readonly repairDigest: string;
} {
  if (!isRecord(input)) {
    throw new Error("Repair tool input must be an object.");
  }

  const keys = Object.keys(input);
  const allowed = new Set(["repairId", "repairDigest"]);
  if (keys.length !== 2 || keys.some((key) => !allowed.has(key))) {
    throw new Error("Repair input contains missing or unsupported fields.");
  }

  const { repairId, repairDigest } = input;
  const valid =
    typeof repairId === "string" &&
    repairId.length >= 1 &&
    repairId.length <= 256 &&
    typeof repairDigest === "string" &&
    repairDigest.length >= 1 &&
    repairDigest.length <= 256;
  if (!valid) {
    throw new Error("Repair identity fields must be bounded strings.");
  }

  return { repairId, repairDigest };
}
