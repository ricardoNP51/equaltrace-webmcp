# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A
- **Git:** Create a revert-point commit after each passed implementation gate once repository identity is configured; never hide a failing gate inside a commit.
- **Verification:** Straight run through automated checks. Pause only for native WebMCP validation, deployment/account actions, final visual judgment, video publication, and submission confirmation.
- **Check-in cadence:** Speed-run. Report completed gates and genuine blockers; do not stop for routine implementation choices.
- **Scope lock:** Complete the P0/P1 golden path before admitting any P2 feature. One fictional account-deletion scenario only.
- **Wow moment:** The repair capability is absent before approval, appears only after a person approves the exact digest, executes once, disappears, and is followed by a green three-route rerun with a deterministic receipt.

## Checklist

- [x] **1. Scaffold the reproducible application and quality spine**
  Spec ref: `spec.md > Stack` and `spec.md > Implementation Order > Gate A — Scaffold and native spine`
  What to build: Create the strict React/TypeScript/Vite application, plain-CSS entry shell, pinned npm lockfile, ESLint/Vitest/Playwright configuration, test adapters, CI workflow, Pages workflow skeleton, and fail-fast `npm run check` command. Keep the app static, subpath-safe, and free of backend or secret dependencies.
  Acceptance: PRD Story 2.2 and Story 9.1 — a clean install starts one clearly fictional scenario without accounts or hidden prerequisites; every visible control is either functional or explains its blocker.
  Verify: Run `npm ci`, `npm run typecheck`, `npm test -- --run`, and `npm run build`; confirm the production output uses relative/subpath-safe assets.

- [x] **2. Implement the deterministic domain, trace ledger, and fail-closed comparator**
  Spec ref: `spec.md > Architecture > Domain engine`, `Semantic trace ledger`, and `Protection comparator`
  What to build: Define immutable scenario/run contracts, account-deletion fixture, shared domain commands, deterministic event IDs, source enforcement, runtime validation, and comparison across outcome, disclosure, consent, feedback, reversibility, and recovery. Include the intentionally broken agent policy and repaired policy.
  Acceptance: PRD Story 2.1, Story 5.1, and Story 5.2 — equivalent seeds produce stable evidence; equal final outcome with a missing or reordered protection fails at the earliest checkpoint; incomplete or mismatched evidence never passes.
  Verify: Run focused Vitest suites covering repeated seeds, route/source mismatch, missing/reordered/duplicated/conflicting evidence, mismatched seed/version, expected baseline divergence, repaired pass, and seeded regression.

- [x] **3. Build the shared state machine and honest minimal workbench shell**
  Spec ref: `spec.md > Architecture > Workbench state machine` and `spec.md > Data Flow > Input-to-display lifecycle`
  What to build: Implement `WorkbenchStore`, immutable subscriptions, injected clock/digest/WebMCP ports, reset/cancellation rules, isolated comparable route slots, explicit phases, provenance labels, and a minimal visible shell whose status is updated through the same store used by tool handlers.
  Acceptance: PRD Story 1.2, Story 2.1, and Story 9.1 — preview/recorded/native/unsupported/incomplete states are explicit; reset invalidates active work and authority; invalid transitions fail closed and surface the next action.
  Verify: Run store tests for every allowed transition plus reset, reload/new-session semantics, stale command rejection, incompatible route contexts, and immutable snapshot behavior; run the minimal shell component tests.

- [x] **4. Prove the native WebMCP spine before expanding the interface**
  Spec ref: `spec.md > Architecture > Native WebMCP adapter` and `spec.md > Implementation Order > Gate A — Scaffold and native spine`
  What to build: Add current `document.modelContext.registerTool` declarations, production feature detection, abort-driven registration, constant bounded schemas, `equaltrace_get_status`, `equaltrace_run_agent_route`, `equaltrace_run_audit`, and `equaltrace_stage_repair`. Inject a fake port only in tests and never polyfill the production global.
  Acceptance: PRD Story 4.1 and Story 4.2 — a supported client discovers stable tools and their calls update the same visible state; unsupported clients remain useful but incomplete; mock or preview evidence cannot satisfy native acceptance.
  Verify: Run schema/handler/cancellation tests and a Playwright simulated-port test labelled simulated. Then perform the first supported-client discovery and visible-state-change smoke test; record client, version, origin, and commit under `evidence/native/` before Gate B UI expansion.

- [x] **5. Complete real visual and keyboard/assistive baseline routes**
  Spec ref: `spec.md > Data Flow > Baseline capture` and `spec.md > Components And Responsibilities > Scenario and domain commands`
  What to build: Implement the pointer-origin visual journey and keyboard-origin assistive journey over the same domain commands, including consequence disclosure, exact consent, completion feedback, cancellation window, recovery guidance, focus management, and concise live announcements. Run the native broken agent route against an isolated context from the same seed.
  Acceptance: PRD Story 3.1, Story 3.2, and Story 4.1 — each human route is completed by its real input path and emits independent evidence; the native agent reaches the same deletion outcome while omitting the intended earliest protection.
  Verify: Run component and Playwright pointer-only/keyboard-only journeys; assert source provenance, focus order, announcements, shared scenario identity, equal outcome, and the exact broken checkpoint.

- [x] **6. Deliver the judge-first baseline verdict and evidence experience**
  Spec ref: `spec.md > Architecture > Judge-facing UI`
  What to build: Implement the forensic-premium hero, scenario header, three-route summary, first-divergence comparison, progressive evidence drawer, blocking guidance, responsive tokens, visible focus, and honest native provenance. Lead with the plain-language failure before dense evidence.
  Acceptance: PRD Epic 1, Story 5.2, and Story 9.2 — a fresh visitor understands in twenty seconds that outcome success hid a protection failure; expected and observed evidence are linked; target viewports remain legible with no color-only status or horizontal page scroll.
  Verify: Run UI tests and Playwright checks at 390×844, 1440×900, and 1920×1080; manually time fresh load to first comprehensible verdict and confirm the known fixture is labelled preview until current evidence exists.

- [x] **7. Implement bounded repair staging and the human-only approval boundary**
  Spec ref: `spec.md > Architecture > Repair proposal and authority`
  What to build: Derive one immutable proposal from the current first divergence; canonicalize and digest it; show exact action, change, consequences, identity, and expiry; expose visible approve/reject/revoke controls whose approval command is unreachable from tools, URL parameters, fixture text, generic dispatch, or claimed actor identity.
  Acceptance: PRD Story 6.1 and Story 6.2 — staging changes neither policy nor capability; only visible exact human approval grants authority; rejection, close, edit, seed drift, scenario drift, and expiry require new approval.
  Verify: Run repair/store/component tests for stable digest, bounded scope, agent self-approval attempts, proposal drift, rejection, close, expiry, changed intent, hostile fixture text, and new-session invalidation.

- [x] **8. Enforce the temporary single-use repair capability lifecycle**
  Spec ref: `spec.md > Architecture > Dynamic WebMCP capability lifetime`
  What to build: Register `equaltrace_apply_approved_repair` only for exact current authority, bind its closure to repair/digest/seed/version/epoch/nonce/expiry, atomically guard concurrent execution, apply the repaired policy once, and abort registration on success or every invalidating transition. Show capability scope and validity without claiming discoverability from UI state alone.
  Acceptance: PRD Story 7.1 and Story 7.2 — the tool is absent before approval, only the exact tool appears after approval, and it disappears after use, expiry, reset, revocation, edit, drift, cancellation, or failure; replay and concurrency yield at most one success.
  Verify: Run lifecycle tests for pre-approval absence, exact registration, stale closure, wrong digest, use, replay, concurrent calls, cancellation, expiry, reset, revocation, proposal/seed/scenario/intent drift, and registration failure; repeat absence/appearance/use/disappearance in a supported native client.

- [x] **9. Prove the repaired rerun and deterministic parity receipt**
  Spec ref: `spec.md > Architecture > Receipt generation` and `spec.md > Data Flow > Repaired proof and receipt`
  What to build: Preserve only the applied repair identity, recreate all three isolated routes from the original fixture, capture fresh evidence, require all six groups plus outcome to pass, canonicalize the receipt, hash it with SHA-256, display every evidence link, export JSON, and add the independent Node verifier.
  Acceptance: PRD Story 8.1 and Story 8.2 — a status change alone cannot pass; repeated equivalent runs produce the same receipt identity; meaningful mutation changes it; a reintroduced bypass fails at the correct divergence; no passing receipt exists for incomplete/failed evidence.
  Verify: Run repaired golden-path and regression tests, compare equivalent receipt bytes/hashes, mutate every meaningful receipt class, run `node scripts/verify-receipt.mjs`, and exercise download failure without losing the visible receipt.

- [x] **10. Harden accessibility, adversarial states, and the one-command release gate**
  Spec ref: `spec.md > Risks And Verification` and `spec.md > One-command quality gate`
  What to build: Finish responsive/reduced-motion styling, names/roles/landmarks, focus and live regions, long-text and 200% zoom behavior, unsupported-native guidance, cancellation/recovery states, adversarial authority/evidence cases, receipt/native-evidence verification scripts, CI, and coverage thresholds around comparator and authority code.
  Acceptance: PRD Epic 9 and all listed edge cases — the golden path works by pointer and keyboard; missing evidence remains incomplete; no hostile input, stale approval, fabricated trace, or duplicate call creates a false green; clean reset always recovers safely.
  Verify: Run `npm run check` from the working tree, then `npm ci && npm run check` from a clean clone; inspect axe output, keyboard flow, reduced motion, 200% zoom, long evidence, all three viewports, and the seeded mutation suite.

- [x] **11. Freeze, deploy, and capture repeatable native release evidence**
  Spec ref: `spec.md > Demo And Submission Flow > Demo preparation` and `spec.md > Demo And Submission Flow > Release identity`
  What to build: Deploy the exact gated commit to GitHub Pages over HTTPS, document native-vs-simulated evidence rules, capture discovery/invocation/visible-change/capability-lifetime observations, complete five fresh native golden runs, verify the public clean-clone instructions, and freeze one release identity across app, repo, evidence, and sample receipt.
  Acceptance: PRD Submission Proof Points — the public build completes the entire broken-to-repaired story without verbal rescue; native evidence identifies the supported client and exact commit; the repair tool lifecycle and deterministic receipt are reproducible five times.
  Verify: Run the public URL in the supported agent client five consecutive times from fresh resets, verify the evidence manifest, run `npm run check` on the tagged candidate, and confirm app/repository/evidence/receipt all name the same commit.

- [ ] **12. Prepare the Devpost handoff**
  Spec ref: `prd.md > Submission Proof Points` and `spec.md > Demo And Submission Flow`
  What to build: Gather the final project story, public live URL, public MIT repository, exact testing instructions, screenshots, native evidence summary, receipt sample, under-three-minute narrated demo plan/video, AI-usage disclosure, judging-criteria mapping, and release identity needed for submission preparation. Do not submit without the participant's explicit final confirmation.
  Acceptance: The participant has enough verified material to run `$prepare-submission`; every public claim maps to a visible behavior or reproducible artifact, and fixture/simulated/native evidence are never conflated.
  Verify: Review the handoff bundle against official submission requirements, replay the video path against the release candidate, check the video duration/audio/public visibility, and confirm the next command is `$prepare-submission`.
