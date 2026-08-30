import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const SHA = /^[a-f0-9]{40}$/;
const RECEIPT = /^[a-f0-9]{64}$/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function verifyRecord(record, index) {
  const label = `records[${index}]`;
  assert(
    record.classification === "native-local",
    `${label} must be native-local.`,
  );
  assert(
    typeof record.client === "string" && record.client.length > 0,
    `${label} needs a client.`,
  );
  assert(
    typeof record.clientVersion === "string" && record.clientVersion.length > 0,
    `${label} needs a client version.`,
  );
  assert(
    /^https?:\/\//.test(record.origin),
    `${label} needs an HTTP(S) origin.`,
  );
  assert(SHA.test(record.commit), `${label} needs an exact commit SHA.`);
  assert(
    Array.isArray(record.claims) && record.claims.length > 0,
    `${label} needs bounded claims.`,
  );
  assert(
    typeof record.limitations === "string" && record.limitations.length > 0,
    `${label} needs limitations.`,
  );
  const path = resolve(record.file);
  await access(path);
  const content = await readFile(path, "utf8");
  assert(
    content.includes(record.commit),
    `${label} file does not name its commit.`,
  );
  assert(
    content.includes(record.origin),
    `${label} file does not name its origin.`,
  );
  assert(
    /native/i.test(content),
    `${label} file does not identify native evidence.`,
  );
}

async function verifyRelease(release) {
  assert(release.requiredRuns === 5, "Release policy must require five runs.");
  assert(
    release.status === "pending" || release.status === "complete",
    "Release status is invalid.",
  );
  if (release.status === "pending") {
    assert(
      release.runs.length === 0,
      "Pending release evidence cannot contain claimed runs.",
    );
    return;
  }
  assert(
    SHA.test(release.releaseCommit),
    "Complete release evidence needs an exact commit SHA.",
  );
  assert(
    /^https:\/\//.test(release.publicOrigin),
    "Complete release evidence needs an HTTPS origin.",
  );
  assert(
    typeof release.evidenceFile === "string" && release.evidenceFile.length > 0,
    "Complete release evidence needs a file.",
  );
  assert(
    Array.isArray(release.runs) && release.runs.length === release.requiredRuns,
    "Complete release evidence needs exactly five runs.",
  );
  const evidencePath = resolve(release.evidenceFile);
  await access(evidencePath);
  const evidence = await readFile(evidencePath, "utf8");
  assert(
    evidence.includes(release.releaseCommit),
    "Release evidence file does not name its commit.",
  );
  assert(
    evidence.includes(release.publicOrigin),
    "Release evidence file does not name its public origin.",
  );
  const receiptIds = new Set();
  release.runs.forEach((run, index) => {
    assert(
      run.sequence === index + 1,
      `Release run ${index + 1} has the wrong sequence.`,
    );
    assert(run.status === "pass", `Release run ${index + 1} did not pass.`);
    assert(
      run.capabilityLifecycle === "absent-appeared-used-absent",
      `Release run ${index + 1} lacks the exact capability lifecycle.`,
    );
    assert(
      RECEIPT.test(run.receiptId),
      `Release run ${index + 1} needs a SHA-256 receipt.`,
    );
    receiptIds.add(run.receiptId);
  });
  assert(
    receiptIds.size === 1,
    "Equivalent release runs produced different receipt identities.",
  );
}

async function main() {
  const manifestPath = process.argv[2] ?? "evidence/native/manifest.json";
  const manifest = await readJson(manifestPath);
  assert(
    manifest.schemaVersion === "1.0.0",
    "Unsupported native evidence manifest version.",
  );
  await access(resolve(manifest.policy));
  assert(
    Array.isArray(manifest.records) && manifest.records.length > 0,
    "Native evidence manifest is empty.",
  );
  await Promise.all(manifest.records.map(verifyRecord));
  await verifyRelease(manifest.release);
  process.stdout.write(
    `EqualTrace native evidence verified: ${manifest.records.length} local records; release ${manifest.release.status}.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
