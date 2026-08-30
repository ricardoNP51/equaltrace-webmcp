import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ROUTES = ["visual", "assistive", "agent"];
const SOURCES = ["pointer", "keyboard", "webmcp"];
const ASSERTIONS = [
  ["disclosure", "disclosure.consequences"],
  ["consent", "consent.exact"],
  ["feedback", "feedback.complete"],
  ["reversibility", "reversibility.cancel_window"],
  ["recovery", "recovery.guidance"],
  ["outcome", "outcome.account_deleted"],
];

function canonicalValue(value) {
  if (value === null || typeof value !== "object") {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error("Non-JSON receipt value.");
    return serialized;
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalValue).join(",")}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalValue(value[key])}`)
    .join(",")}}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exactKeys(value, keys, label) {
  assert(
    value && typeof value === "object" && !Array.isArray(value),
    `${label} must be an object.`,
  );
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} has unexpected or missing fields.`,
  );
}

export function verifyReceipt(receipt) {
  exactKeys(
    receipt,
    [
      "schemaVersion",
      "applicationVersion",
      "scenario",
      "finalOutcome",
      "outcomeParity",
      "routes",
      "assertions",
      "repair",
      "verdict",
      "receiptId",
    ],
    "receipt",
  );
  assert(
    receipt.schemaVersion === "1.0.0",
    "Unsupported receipt schema version.",
  );
  assert(
    typeof receipt.applicationVersion === "string" &&
      receipt.applicationVersion.length > 0,
    "Missing application version.",
  );
  exactKeys(
    receipt.scenario,
    ["id", "version", "seed", "requestedOutcome", "initialState"],
    "scenario",
  );
  exactKeys(
    receipt.scenario.initialState,
    ["accountId", "status"],
    "scenario.initialState",
  );
  assert(
    receipt.scenario.requestedOutcome === "account_deleted",
    "Unexpected requested outcome.",
  );
  assert(
    receipt.scenario.initialState.status === "active",
    "Unexpected initial state.",
  );
  assert(
    receipt.finalOutcome === "account_deleted",
    "Unexpected final outcome.",
  );
  assert(receipt.outcomeParity === true, "Outcome parity did not pass.");
  assert(receipt.verdict === "pass", "Receipt verdict is not pass.");
  exactKeys(receipt.repair, ["repairId", "repairDigest"], "repair");
  assert(
    receipt.repair.repairId.length > 0 &&
      receipt.repair.repairDigest.length > 0,
    "Repair identity is incomplete.",
  );

  assert(
    Array.isArray(receipt.routes) && receipt.routes.length === 3,
    "Exactly three routes are required.",
  );
  receipt.routes.forEach((route, index) => {
    exactKeys(
      route,
      ["route", "runId", "source", "evidenceIds"],
      `routes[${index}]`,
    );
    assert(
      route.route === ROUTES[index],
      `Route order mismatch at index ${index}.`,
    );
    assert(
      route.source === SOURCES[index],
      `Route source mismatch at index ${index}.`,
    );
    assert(
      typeof route.runId === "string" && route.runId.length > 0,
      `Missing run identity at index ${index}.`,
    );
    assert(
      Array.isArray(route.evidenceIds) && route.evidenceIds.length >= 6,
      `Incomplete evidence for ${route.route}.`,
    );
    assert(
      new Set(route.evidenceIds).size === route.evidenceIds.length,
      `Duplicate evidence for ${route.route}.`,
    );
  });

  assert(
    Array.isArray(receipt.assertions) && receipt.assertions.length === 6,
    "Exactly six assertions are required.",
  );
  receipt.assertions.forEach((assertion, index) => {
    exactKeys(
      assertion,
      ["order", "invariant", "checkpoint", "passed", "evidenceIds"],
      `assertions[${index}]`,
    );
    const expected = ASSERTIONS[index];
    assert(
      assertion.order === index + 1,
      `Assertion order mismatch at index ${index}.`,
    );
    assert(
      assertion.invariant === expected[0] &&
        assertion.checkpoint === expected[1],
      `Assertion meaning mismatch at index ${index}.`,
    );
    assert(
      assertion.passed === true,
      `Assertion ${assertion.checkpoint} did not pass.`,
    );
    assert(
      Array.isArray(assertion.evidenceIds) &&
        assertion.evidenceIds.length === 3,
      `Assertion ${assertion.checkpoint} needs three evidence links.`,
    );
    assertion.evidenceIds.forEach((evidenceId, routeIndex) => {
      assert(
        receipt.routes[routeIndex].evidenceIds.includes(evidenceId),
        `Assertion ${assertion.checkpoint} references unknown evidence.`,
      );
    });
  });

  assert(
    /^[a-f0-9]{64}$/.test(receipt.receiptId),
    "Receipt identity is not a SHA-256 hex digest.",
  );
  const { receiptId, ...body } = receipt;
  const expectedId = createHash("sha256")
    .update(canonicalValue(body), "utf8")
    .digest("hex");
  assert(
    receiptId === expectedId,
    `Receipt digest mismatch: expected ${expectedId}, received ${receiptId}.`,
  );
  return { receiptId, canonicalJson: canonicalValue(receipt) };
}

async function main() {
  const path = process.argv[2] ?? "tests/fixtures/parity-receipt.json";
  const raw = await readFile(path, "utf8");
  const receipt = JSON.parse(raw);
  const result = verifyReceipt(receipt);
  process.stdout.write(`EqualTrace receipt verified: ${result.receiptId}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
