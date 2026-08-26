# Technical Spec

## Overview

EqualTrace is a static, local-first React application that executes one deterministic fictional account-deletion scenario through visual, keyboard/assistive, and native WebMCP routes. Every route creates a separate run from the same scenario definition, seed, domain engine, and initial state. The application compares ordered semantic protections, identifies the first divergence, gates a bounded repair behind visible human approval, reruns every route, and exports a deterministic receipt.

The competition build has no backend, database, authentication, external model API, or real destructive integration. Its technical novelty is entirely in the browser: shared live state, native WebMCP tools, semantic trace evidence, fail-closed comparison, and a dynamic consequential capability whose registration lifetime is bound to exact human approval.

This spec implements all nine PRD epics and preserves the dependency gates in `docs/ROADMAP.md`.

## Stack

### Application

- **Node.js 22 LTS-compatible runtime and npm** for local development and reproducible scripts.
- **React** for the human-facing workbench and accessible interaction flows.
- **TypeScript with strict mode** for domain, evidence, receipt, and WebMCP contracts.
- **Vite** for a small static build with no server runtime.
- **Plain CSS with design tokens** for maximum control and minimum dependency surface.
- **Web Crypto `crypto.subtle.digest`** for SHA-256 receipt and repair digests.
- **Browser `AbortController` / `AbortSignal`** for dynamic WebMCP registration lifetime.

### Verification

- **Vitest** for pure domain, comparator, receipt, and lifecycle tests.
- **React Testing Library** and **user-event** for observable component behavior.
- **Playwright** for browser journeys, viewport checks, keyboard interaction, and failure states.
- **axe-core Playwright integration** for automated accessibility checks.
- **ESLint** for static quality checks.

### Deployment

- **GitHub Pages** as the primary static HTTPS target, deployed from a GitHub Actions workflow after local release gates pass.
- A single page with no client-side URL router, server rewrite, credential, or secret requirement.
- Relative Vite assets so the same build works under the repository Pages subpath and other static hosts.

### Primary documentation

- [OpenAI Site tools / WebMCP guide](https://learn.chatgpt.com/docs/webmcp)
- [WebMCP Community Group specification](https://webmachinelearning.github.io/webmcp/)
- [Chrome WebMCP developer guide](https://developer.chrome.com/docs/ai/webmcp)
- [Chrome WebMCP security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [Chrome WebMCP eval guidance](https://developer.chrome.com/docs/ai/webmcp/evals)
- [React documentation](https://react.dev/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Vite documentation](https://vite.dev/guide/)
- [Vitest documentation](https://vitest.dev/guide/)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

Exact package versions are selected once during scaffold and frozen in `package-lock.json`. The build never depends on a floating CDN script.

## Architecture

### Architectural rule: one engine, isolated comparable runs

The three routes do not mutate one shared account sequentially. Each route receives an isolated `RunContext` created from the same immutable `ScenarioDefinition`, seed, requested outcome, and initial account state. All contexts execute the same pure domain commands. This prevents the first deletion from making later routes impossible while preserving a genuinely shared source of truth.

```text
Visual UI ──────────────┐
Keyboard/assistive UI ──┼─> WorkbenchStore ─> Domain commands ─> Route RunContext
Native WebMCP tools ────┘          │                  │
                                   │                  └─> ordered TraceEvent records
                                   ├─> parity comparator
                                   ├─> repair authority lifecycle
                                   └─> canonical receipt exporter
```

### Domain engine

The domain layer is pure TypeScript and has no React, DOM, timer, or WebMCP dependency. It owns:

- fictional account state;
- deterministic scenario creation;
- disclosure, consent, deletion, feedback, cancellation-window, and recovery commands;
- broken and repaired agent policies;
- semantic trace-event creation;
- runtime input validation;
- comparable run snapshots.

Every consequential mutation enters through a named domain command. UI and WebMCP handlers cannot assign domain state directly.

Implements: `prd.md > Epic 2`, `Epic 3`, `Epic 4`.

### Workbench state machine

One in-memory `WorkbenchStore` owns the current session. React subscribes to immutable snapshots; WebMCP handlers call the same store commands.

Primary phases:

```text
preview
  -> baseline_capture
  -> baseline_failed
  -> repair_staged
  -> repair_approved
  -> repair_applied
  -> repaired_capture
  -> verified
```

Any invalid, partial, cancelled, expired, unsupported, or mismatched state remains explicit. Only a complete repaired comparison enters `verified`.

The store receives injected `Clock`, `DigestService`, and `WebMcpPort` dependencies. Production uses browser implementations; tests use controlled deterministic adapters. No state persists to `localStorage` or `sessionStorage`; reload creates a new session and invalidates all authority.

Implements: `prd.md > Epic 1`, `Epic 2`, `Epic 6`, `Epic 7`, `Epic 8`, `Epic 9`.

### Semantic trace ledger

Each real route interaction emits ordered `TraceEvent` objects. An event contains at minimum:

```ts
type TraceEvent = {
  id: string;
  runId: string;
  sequence: number;
  route: "visual" | "assistive" | "agent";
  source: "pointer" | "keyboard" | "webmcp";
  checkpoint:
    | "disclosure.consequences"
    | "consent.exact"
    | "commit.delete"
    | "feedback.complete"
    | "reversibility.cancel_window"
    | "recovery.guidance"
    | "outcome.account_deleted";
  invariant:
    | "disclosure"
    | "consent"
    | "feedback"
    | "reversibility"
    | "recovery"
    | "outcome";
  scenarioId: string;
  scenarioVersion: string;
  seed: string;
  evidence: string;
};
```

IDs use deterministic run identity plus monotonic sequence, not wall-clock time or random UUIDs. Evidence text may include fixture content and is therefore treated as untrusted at the WebMCP boundary.

Pointer and keyboard evidence is derived from real DOM events. The visual runner accepts pointer-origin commitment; the assistive runner accepts keyboard-origin commitment. No request payload can declare itself human or assistive.

Implements: `prd.md > Story 1.2`, `Story 3.1`, `Story 3.2`, `Story 4.1`, `Epic 5`.

### Protection comparator

The comparator is a pure fail-closed function:

```ts
compareProtectionParity(input: ComparisonInput): ComparisonResult
```

Processing order:

1. Validate schema and required routes.
2. Verify scenario ID, version, seed, requested outcome, and initial state match.
3. Verify every route reached the requested final outcome.
4. Load the scenario's ordered `ProtectionRequirement` list.
5. Validate visual and assistive reference routes independently.
6. Align route evidence by semantic checkpoint.
7. Detect missing, reordered, conflicting, duplicated, or unsupported evidence.
8. Return the earliest divergence plus remaining findings.
9. Return `pass` only when outcome and all required protections have evidence on all routes.

Result states are `incomplete`, `fail`, or `pass`; there is no implicit truthy fallback. Invalid evidence produces `incomplete` or `fail`, never `pass`.

Implements: `prd.md > Epic 5`, `Epic 8`.

### Repair proposal and authority

The repair proposal is a bounded immutable value derived from the current first divergence:

```ts
type RepairProposal = {
  repairId: string;
  targetScenarioId: string;
  targetScenarioVersion: string;
  targetToolName: "equaltrace_run_agent_route";
  seed: string;
  addsCheckpoints: readonly string[];
  repairDigest: string;
  approvalEpoch: number;
  expiresAt: number;
};
```

The digest is SHA-256 over a canonical serialization excluding mutable display state. `expiresAt` is checked for authority but excluded from semantic repair identity when appropriate; the approval record binds both digest and exact expiry.

Only the visible React approval control can call `approveRepairFromHumanInteraction`. This command is not exported through the WebMCP tool map, URL parameters, fixture content, or generic action dispatch. The handler requires a trusted visible interaction path and rechecks that the displayed proposal still matches store state.

Implements: `prd.md > Epic 6`.

### Dynamic WebMCP capability lifetime

Stable tools register once after feature detection. The consequential tool `equaltrace_apply_approved_repair` does not register during initial load.

When exact approval becomes valid:

1. Abort any previous repair registration controller.
2. Create a fresh `AbortController`.
3. Register the constant-schema tool with `document.modelContext.registerTool(tool, { signal })`.
4. Bind its execute closure to the approved repair ID, digest, seed, epoch, nonce, and expiry.
5. Reflect successful registration in the visible workbench without treating UI state as proof of discoverability.

Execution revalidates every bound field and uses an atomic in-flight/used guard. Success applies the repaired agent policy through the store, then aborts the registration controller immediately. Reset, rejection, revocation, expiry, proposal edit, seed drift, scenario drift, intent drift, page unload, or registration failure also aborts it.

The schema and tool name remain constant across re-registration to avoid old-call/new-schema ambiguity. A stale closure can never authorize current state.

Implements: `prd.md > Epic 7`, `Story 8.1`.

### Native WebMCP adapter

The application checks only the current standard surface:

```ts
typeof document.modelContext?.registerTool === "function"
```

The adapter wraps native registration for lifecycle management and testability. It does not polyfill `document.modelContext`. Automated tests inject a separate `FakeWebMcpPort` into the store and label those results simulated. Native release evidence must come from ChatGPT's built-in browser or supported Chrome and is stored outside application verdict data.

Stable tools:

#### `equaltrace_get_status`

- Read-only.
- No input properties; `additionalProperties: false`.
- Returns current phase, scenario identity, completed routes, comparison status, and capability state.
- Uses `readOnlyHint: true` and `untrustedContentHint: true` because output may include fixture/evidence text.

#### `equaltrace_run_agent_route`

- Executes the current broken or repaired agent policy against a fresh comparable route context.
- Requires exact `scenarioId`, `scenarioVersion`, and `seed`; bounded string lengths and no extra properties.
- Rejects incompatible phase, duplicate run, cancellation, or stale scenario.
- Returns outcome and evidence identifiers, not arbitrary page content.

#### `equaltrace_run_audit`

- Runs the pure comparator over currently recorded routes; it does not synthesize human traces.
- No actor field and no ability to mark evidence native.
- Returns incomplete, fail, or pass with first divergence and evidence IDs.

#### `equaltrace_stage_repair`

- Creates the single allowed proposal from the current first divergence.
- Cannot approve, register, or execute the consequential repair.
- Rejects when there is no eligible current divergence.

#### `equaltrace_apply_approved_repair`

- Dynamically registered only for an exact active approval.
- Accepts the exact `repairId` and `repairDigest` with no extra properties.
- Revalidates closure-bound authority and applies once.

All tool names, descriptions, titles, and schemas are compile-time constants and contain no scenario/user text. Execute callbacks honor their cancellation signal before and during work. Tool inputs are runtime-validated even when the client claims schema compliance.

Implements: `prd.md > Epic 4`, `Epic 6`, `Epic 7`.

### Receipt generation

`buildParityReceipt` accepts only a complete passing repaired comparison. It creates a canonical object containing:

- receipt schema version;
- application release version;
- scenario ID/version/seed;
- requested and final outcome;
- route identities and semantic evidence references;
- all invariant assertions;
- repair ID and digest;
- comparison verdict;
- deterministic SHA-256 identity.

Canonicalization recursively sorts object keys and preserves array order. Volatile wall-clock time, browser strings, UI expansion state, and download time do not enter the hashed body. Native environment evidence is displayed and documented separately from the semantic receipt hash.

The UI exports UTF-8 JSON through an object URL and revokes it after download. Failed download leaves the verified receipt in memory and visible.

Implements: `prd.md > Story 8.2`.

### Judge-facing UI

The UI is one responsive workbench with progressive disclosure:

1. **VerdictHero** — plain-language problem, fictional label, preview/current/native provenance, and current verdict.
2. **ScenarioHeader** — scenario identity, seed, state, reset, and environment support.
3. **RouteRunner** — focused visual or assistive journey and agent-call status.
4. **RouteSummaryGrid** — three route outcomes and protection coverage.
5. **FirstDivergencePanel** — expected vs observed evidence and earliest mismatch.
6. **RepairCenter** — staged proposal, exact human approval, expiry, capability status, rejection/revocation.
7. **RerunPanel** — repaired capture progress and regression status.
8. **ReceiptPanel** — passing assertions, deterministic identity, and download.
9. **EvidenceDrawer** — optional detailed trace ledger after the plain-language result.
10. **LiveRegion** — concise announcements for route completion, failure, approval, capability removal, and verification.

The default visual language uses a dark neutral foundation, blue/cyan routes, amber divergence, red only for critical invalid state, and green only for evidence-backed parity. Every state also has text and iconography. Motion is limited to short state transitions and disabled under reduced-motion preference.

Implements: `prd.md > Epic 1`, `Epic 3`, `Epic 5`, `Epic 6`, `Epic 8`, `Epic 9`.

## File Structure

```text
.
├── .github/
│   └── workflows/
│       ├── ci.yml                         # clean install and one-command quality gate
│       └── deploy-pages.yml               # gated static GitHub Pages deployment
├── public/
│   └── favicon.svg                        # lightweight original EqualTrace mark
├── src/
│   ├── main.tsx                           # React entry point and production adapters
│   ├── App.tsx                            # judge workbench composition
│   ├── styles.css                         # tokens, layout, focus, responsive, reduced motion
│   ├── core/
│   │   ├── types.ts                       # stable domain/evidence/repair/receipt contracts
│   │   ├── validation.ts                  # bounded runtime input validation
│   │   ├── canonicalize.ts                # deterministic JSON serialization
│   │   ├── digest.ts                      # DigestService and browser SHA-256 adapter
│   │   ├── scenario.ts                    # deterministic scenario/run creation
│   │   ├── commands.ts                    # shared account-protection domain commands
│   │   ├── trace.ts                       # deterministic event creation and ledger rules
│   │   ├── compare.ts                     # fail-closed semantic parity comparator
│   │   ├── repair.ts                      # proposal, approval binding, authority validation
│   │   └── receipt.ts                     # canonical receipt builder and exporter data
│   ├── fixtures/
│   │   └── accountDeletion.ts             # one scenario, requirements, broken/repaired policy
│   ├── state/
│   │   ├── WorkbenchStore.ts              # state machine and all shared commands
│   │   ├── initialState.ts                 # honest preview/ready snapshot
│   │   └── useWorkbench.ts                # React subscription and selectors
│   ├── webmcp/
│   │   ├── model-context.d.ts              # minimal current browser API declarations
│   │   ├── port.ts                         # WebMcpPort interface
│   │   ├── nativeAdapter.ts                # feature detection and native registration
│   │   ├── toolSchemas.ts                  # constant JSON Schemas and runtime bounds
│   │   ├── stableTools.ts                  # status, agent route, audit, stage repair
│   │   └── repairCapability.ts             # approval-bound registration and teardown
│   ├── components/
│   │   ├── VerdictHero.tsx
│   │   ├── ScenarioHeader.tsx
│   │   ├── RouteRunner.tsx
│   │   ├── RouteSummaryGrid.tsx
│   │   ├── FirstDivergencePanel.tsx
│   │   ├── RepairCenter.tsx
│   │   ├── RerunPanel.tsx
│   │   ├── ReceiptPanel.tsx
│   │   ├── EvidenceDrawer.tsx
│   │   └── LiveRegion.tsx
│   └── test/
│       ├── setup.ts                        # DOM/axe test setup
│       ├── fakeClock.ts                    # deterministic authority timing
│       ├── fakeDigest.ts                   # deterministic unit adapter
│       └── fakeWebMcpPort.ts               # isolated simulated registry, never native evidence
├── tests/
│   ├── core/
│   │   ├── scenario.test.ts
│   │   ├── compare.test.ts
│   │   ├── repair.test.ts
│   │   └── receipt.test.ts
│   ├── state/
│   │   └── workbench.test.ts
│   ├── webmcp/
│   │   ├── stable-tools.test.ts
│   │   └── repair-capability.test.ts
│   └── ui/
│       ├── golden-path.test.tsx
│       ├── keyboard.test.tsx
│       └── provenance.test.tsx
├── e2e/
│   ├── golden-path.spec.ts                 # simulated adapter browser path, labelled honestly
│   ├── accessibility.spec.ts
│   ├── responsive.spec.ts
│   └── failure-states.spec.ts
├── evidence/
│   ├── README.md                           # native vs automated evidence rules
│   └── native/.gitkeep                     # manual native evidence added only after real run
├── scripts/
│   ├── verify-receipt.mjs                  # schema and deterministic hash verifier
│   └── verify-native-evidence.mjs           # completeness checks, not a native simulator
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── eslint.config.js
```

Every planned file has one responsibility. New files enter only when they remove real duplication or enable a named verification gate.

## Data Flow

### Baseline capture

1. `reset(seed)` loads the immutable fixture and creates three empty comparable run slots.
2. Visual pointer interactions call domain commands and append pointer-origin events.
3. Assistive keyboard interactions call the same commands and append keyboard-origin events.
4. Native `equaltrace_run_agent_route` validates scenario input, creates the agent run context, executes the broken policy, and appends WebMCP-origin events.
5. `equaltrace_run_audit` or the visible audit control calls the same comparator.
6. Comparator returns `fail` at `disclosure.consequences` while confirming equal requested outcome.
7. Store publishes an immutable snapshot; React renders the first divergence and live region announces it.

### Repair lifecycle

1. Native `equaltrace_stage_repair` asks the store to derive one proposal from the current divergence.
2. Core canonicalization and digest services generate the proposal identity.
3. React shows exact proposal details; no capability exists yet.
4. A visible human interaction calls the non-WebMCP approval command.
5. Store creates exact authority; `repairCapability` registers the dynamic tool with an abort signal.
6. Native execution revalidates bound authority, applies the repaired agent policy, marks the token used, and aborts registration.
7. Any invalidating state transition follows the same abort path before publishing the next snapshot.

### Repaired proof and receipt

1. Store resets route contexts while preserving the applied repaired policy and repair identity.
2. Each route is executed again from the same fixture and seed.
3. Comparator requires outcome plus all six invariant groups across all three routes.
4. Receipt builder canonicalizes the passing semantic evidence and hashes it.
5. React shows the receipt identity and offers JSON download.
6. Verification script recomputes the identity independently during `npm run check` against golden fixtures.

### Input-to-display lifecycle

```text
DOM event or native tool call
  -> boundary validation
  -> WorkbenchStore command
  -> pure domain transition
  -> deterministic TraceEvent append
  -> immutable store snapshot
  -> comparator/authority derivation
  -> React selector
  -> visible status + accessible announcement
```

No UI component, URL parameter, or WebMCP response can skip the boundary and mutate state directly.

## Components And Responsibilities

### Scenario and domain commands

Implements: `prd.md > Epic 2`, `Epic 3`, `Epic 4`.

Creates equivalent isolated runs, enforces command order, changes the fictional account, and emits semantic events. It cannot know whether a verdict passes.

### Trace ledger and comparator

Implements: `prd.md > Epic 5`, `Epic 8`.

Stores ordered evidence and produces the only authoritative parity result. UI badges and tool return text derive from this result.

### WorkbenchStore

Implements: `prd.md > all epics`.

Coordinates phases, route slots, proposal/approval state, invalidation, audit results, and receipt readiness. It is the only shared bridge between UI and WebMCP.

### NativeWebMcpAdapter

Implements: `prd.md > Epic 1`, `Epic 4`, `Epic 7`.

Feature-detects the native API, registers constant tools, records registration outcomes, and exposes abort-driven teardown. It never supplies a fallback registry to production.

### RepairCapability

Implements: `prd.md > Epic 6`, `Epic 7`.

Maps exact valid approval to one dynamic registration and tears it down on every authority-ending event.

### Judge workbench components

Implements: `prd.md > Epic 1`, `Epic 3`, `Epic 5`, `Epic 6`, `Epic 8`, `Epic 9`.

Render plain-language state first and detailed evidence second. Components dispatch commands but contain no domain or authorization decisions.

### Receipt builder

Implements: `prd.md > Epic 8`.

Produces canonical portable proof only from a complete passing comparison and supports independent hash verification.

## External APIs And Dependencies

### Runtime external APIs

- `document.modelContext.registerTool` — optional browser-provided WebMCP capability, required for native acceptance evidence.
- Web Crypto — required for SHA-256 digests.
- Blob/Object URL download — required for local receipt export.

There are no network APIs, secrets, remote databases, model endpoints, analytics SDKs, or external fonts at runtime.

### Dependency boundaries

- React owns rendering only.
- No state-management package; the store is small and domain-specific.
- No CSS framework; visual polish comes from project tokens and components.
- Test-only fake WebMCP port cannot be imported by production entry points.
- Tool output containing fixture/evidence text sets `untrustedContentHint`.
- Read-only tools set `readOnlyHint`; state-changing tools do not.

## AI Usage

- Codex assists with planning, implementation, tests, review, debugging, documentation, and submission preparation.
- The running product calls no model API and does not require API credits.
- The user's agent interacts through native WebMCP in ChatGPT's built-in browser or supported Chrome.
- Automated tests use deterministic adapters, not an LLM, so quality gates remain reproducible.
- Submission materials must accurately distinguish Codex-assisted development, simulated automated tests, and native agent evidence.

## Risks And Verification

### Risk 1 — Draft API movement

WebMCP is a Community Group draft and may change during the challenge.

Verification:

- Isolate all API declarations and calls under `src/webmcp/`.
- Use `document.modelContext`, not deprecated `navigator.modelContext`.
- Use registration `{ signal }` teardown from the current specification.
- Recheck the primary documentation before native evidence capture and release freeze.

### Risk 2 — Fake native evidence

Automated browsers may not expose WebMCP.

Verification:

- Never attach a polyfill to `document.modelContext` in production or acceptance tests.
- Label injected-port E2E results simulated.
- Require separate native evidence with client, version, origin, commit, discovery, invocation, visible state change, and teardown observations.

### Risk 3 — Route fabrication

A convenient orchestrator could silently hand-author human traces.

Verification:

- Human evidence originates only from pointer/keyboard DOM paths.
- Agent evidence originates only from the WebMCP handler.
- Tests reject source/route mismatches and direct evidence injection.

### Risk 4 — False green comparison

Equal outcomes, reordered protections, or missing evidence could be accepted.

Verification:

- Mutation-style unit cases cover missing, reordered, duplicated, conflicting, mismatched-seed, and fabricated events.
- Comparator has no default-pass branch.
- A known broken fixture must fail at the expected first checkpoint; a seeded regression must kill repaired green.

### Risk 5 — Approval replay or drift

Stale or edited approval could retain authority.

Verification:

- Bind repair ID, digest, seed, scenario version, epoch, nonce, and expiry.
- Abort on every invalidation path.
- Test use, replay, concurrency, expiry, reset, revocation, edit, changed intent, and reload.
- Require five consecutive native golden runs before release.

### Risk 6 — Receipt nondeterminism

Wall-clock or browser data could change the hash.

Verification:

- Canonicalize semantic fields only.
- Independently recompute hashes in Node.
- Compare repeated equivalent repaired fixtures byte-for-byte.

### Risk 7 — Judge overload

Dense evidence could hide the simple story.

Verification:

- Plain-language hero and first divergence precede the ledger.
- Evidence details default collapsed.
- Time the demo beats and run fresh-session comprehension review.
- Delete UI that does not advance the golden story.

### Risk 8 — Accessibility regression

Custom forensic visuals could become keyboard- or color-dependent.

Verification:

- Native HTML controls and landmarks first.
- Pointer-only and keyboard-only E2E paths.
- axe, visible-focus, live-region, reduced-motion, 200% zoom, long-text, and three-viewport checks.

### One-command quality gate

`npm run check` runs, in fail-fast order:

1. formatting verification;
2. ESLint;
3. TypeScript typecheck;
4. unit/integration/component tests with coverage thresholds on core authority code;
5. production build;
6. Playwright golden, failure, responsive, and accessibility tests;
7. receipt fixture verification;
8. native-evidence manifest completeness check when native evidence is declared present.

Clean-clone gate: `npm ci && npm run check`.

## Demo And Submission Flow

### Demo preparation

1. Deploy the exact release candidate to HTTPS.
2. Open it in ChatGPT's built-in browser with GPT-5.6 Sol or Terra and site tools enabled.
3. Confirm stable tool discovery and capture environment/commit evidence.
4. Prove the repair tool is absent before approval.
5. Run the baseline three-route sequence and show the first divergence.
6. Stage and visibly approve the exact repair.
7. Prove the dynamic tool appears, executes once, and disappears.
8. Rerun all routes and download/verify the receipt.
9. Repeat the full native flow five consecutive times from fresh reset.

### Video sequence

- 0:00–0:20 — outcome success versus protection failure.
- 0:20–0:55 — three real routes on the same scenario.
- 0:55–1:20 — first semantic divergence and evidence.
- 1:20–1:50 — bounded proposal and exact human approval.
- 1:50–2:20 — dynamic capability appears, applies, and disappears.
- 2:20–2:45 — repaired rerun and deterministic receipt.
- 2:45–2:58 — “Same action. Same protections. Provable.”

### Release identity

The public app, repository default branch, README claims, native evidence, receipt sample, YouTube demo, Devpost copy, and `challenge-v1.0.0` tag must all refer to the same commit. After the official deadline, the submitted repository and deployment remain unchanged until winners are announced.

## Implementation Order

### Gate A — Scaffold and native spine

Create the minimal app, lockfile, quality scripts, store shell, WebMCP types/adapter, one read tool, and `equaltrace_run_audit`. Deploy and prove native discovery plus visible state change before UI expansion.

### Gate B — Broken vertical slice

Implement the fixture, domain commands, visual route, agent route, ledger, comparator, and opening first divergence.

### Gate C — Real three-route evidence

Complete keyboard/assistive capture, source enforcement, comparable isolated runs, and incomplete/mismatch states.

### Gate D — Authority and repair

Implement proposal digest, human-only approval, dynamic registration, exact execution, and every teardown path.

### Gate E — Repaired proof

Implement repaired rerun, canonical receipt, independent verifier, and seeded regression.

### Gate F — Judge experience and release

Finish responsive visual system, accessibility, adversarial tests, five-run native evidence, clean clone, public deployment, video, and submission artifacts.

No later gate begins while an earlier exit condition is unreliable.
