# Hackathon Build Notes

## 2026-08-30 — Build item 12: Devpost handoff bundle

### Official requirements and submission story

- Fetched the complete live Devpost submission requirements, four judging criteria, current dates, and latest organizer announcement on 2026-08-30 rather than relying on memory or web search.
- Confirmed the required live URL, explanatory description, public repository with open-source license, and public narrated YouTube demo under three minutes; captured all twelve current custom submission fields and their IDs in the handoff draft.
- Drafted `devpost-submission.md` with the English project story, tagline, technology list, exact judge instructions, AI-usage disclosure, learning answers, judging map, claim boundaries, release identity, and personal-field confirmations for `$prepare-submission`.

### Media and demo proof

- Captured four 1440×900 screenshots from the exact public release: opening thesis, current native first divergence, human approval boundary with capability absent, and final deterministic receipt.
- Indexed the images under `evidence/submission/README.md` with honest fixture/current/native labels and added a concise judge preview to the public README.
- Created `docs/DEMO_SCRIPT.md`, a recording-ready 2:52 target storyboard that shows the product in the first 10–15 seconds and covers native shared state, first divergence, visible approval, dynamic absent → appeared → used → absent lifetime, repaired rerun, and receipt.
- Replayed that exact video path against the public release through native WebMCP. The apply response reported `removed_after_use`, fresh discovery excluded the temporary tool, the repaired agent evidence reported native provenance, and the final audit reproduced receipt `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`.

### Gate result

- Checklist item 12 passed as a submission-preparation handoff. The required video plan and assets are ready; recording, public YouTube upload, final personal-field confirmation, and actual Devpost submission remain explicit external gates.
- The guided build checklist is complete. The next command is `$prepare-submission`; it must not submit without the participant's separate explicit confirmation.

## 2026-08-30 — Build item 11: exact public release and five native golden runs

### Release freeze

- Prepared application version `1.0.0` and release name `challenge-v1.0.0`; the production footer reports the exact build SHA supplied by the release workflow.
- Exact application commit: `20ccacc499fcb8f7fed126f10af38e820c95b335`.
- `npm run check` passed in the working tree and in a detached clean clone with that exact SHA injected into the production build.
- Fast-forwarded both `codex/phase6-continuation` and `main` without force-push, created annotated tag `challenge-v1.0.0`, enabled workflow-based GitHub Pages with enforced HTTPS, and verified successful Actions runs `33294006121`, `33294006735`, and `33294006674`.
- A separate clone from the public GitHub tag resolved to the exact release commit; `npm ci` reported zero vulnerabilities and its full `npm run check` passed.

### Public native proof

- Public origin: `https://ricardonp51.github.io/equaltrace-webmcp/`.
- Supported client: Codex In-app Browser, plugin version `26.825.41651`.
- Five consecutive fresh-reset runs used the browser-provided WebMCP tools, not the test port or a polyfill.
- Every baseline reproduced equal deletion outcome with the first agent divergence at `disclosure.consequences` and native evidence provenance.
- In every run, `equaltrace_apply_approved_repair` was absent before the visible human approval, appeared after approval of the exact digest, applied once, reported `removed_after_use`, and was absent again on fresh discovery.
- Every repaired rerun recreated pointer, keyboard, and native WebMCP evidence, passed all six protection groups plus outcome parity, left the capability absent with reason `used`, and produced receipt `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`.
- Detailed evidence: `evidence/native/2026-08-30-public-release-five-run.md`; `evidence/native/manifest.json` now requires and verifies the exact five-run record.

### Gate result

- Checklist item 11 passed. The app, repository tag, deployed SHA, evidence record, lifecycle observations, and repeated native receipt are bound to release `challenge-v1.0.0`.
- Item 12 is now the earliest admissible work: prepare the Devpost handoff materials without performing the final submission.

## 2026-08-30 — Build item 10: accessibility, adversarial, and clean-clone release gate

### Implemented

- Added `@axe-core/playwright` checks for the fresh and active workbench, deterministic skip-link focus, reduced-motion validation, 200% text resize, and a synthetic hostile long-evidence layout case.
- Fixed the real mobile overflow found by the new hostile-content check with workbench-wide defensive wrapping; page-derived text remains inert and no script sink was introduced.
- Added targeted V8 coverage thresholds over the comparator, repair derivation, shared authority state machine, and dynamic repair lifecycle.
- Added `evidence/native/manifest.json` and an independent verifier that checks local evidence identity and enforces the future five-run HTTPS release contract when release status becomes complete.
- Added exact-revision GitHub Actions workflows for CI and GitHub Pages; CI uses locked dependencies and Playwright Chromium.

### Verification evidence

- Working-tree `npm run check` passed: 66 Vitest tests across 14 files; targeted coverage 84.55% statements, 77.41% branches, 97.36% functions, and 86.98% lines; production build; 12 Playwright journeys; receipt verifier; native-evidence verifier.
- Axe reported zero serious or critical violations in the fresh and active workbench states.
- The new long hostile token initially expanded the 390px layout to 446px; after the CSS hardening it remained at or below the viewport width and rendered as inert text.
- A detached clean clone of implementation commit `97ee5b7` passed `npm ci && npm run check` with the same results.

### Gate decision

- Checklist item 10 passed. The clean-clone, accessibility, adversarial layout, coverage, receipt, native-manifest, CI, and Pages foundations are complete.
- Public HTTPS behavior and five native release runs do not inherit this pass; item 11 remains the next mandatory gate.

## 2026-08-26 — Guided build onboarding

### Decisions

- Keep the established winning thesis: EqualTrace detects when an agent reaches the correct final state while bypassing protections applied to the equivalent human action.
- Target WebMCP implementation teams as the primary user.
- Use one deterministic, simulated account-deletion scenario for the competition build.
- Compare real visual, assistive, and native WebMCP routes through semantic trace events.
- Preserve human authority over the exact bounded repair; the agent cannot approve its own change.
- Complete the proof with a three-route rerun and deterministic parity receipt.
- Choose a forensic-premium visual system optimized for judge comprehension in the first twenty seconds.

### Participant calibration

- Public and local repository review indicates an intermediate-to-advanced AI-assisted builder with broad web, scientific, game, mobile, and content-platform experience.
- The main execution risk is scope expansion and prolonged planning, not lack of technical breadth or ambition.
- Downstream interviews should focus on explicit tradeoffs, measurable gates, and rapid convergence on the golden vertical slice.

### Interview record

- Round 1 confirmed the previously agreed project idea.
- The technical profile was inferred from repository evidence at the participant's request and confirmed through their direction to optimize for winning.
- Round 2 defaults were accepted: primary user, bounded scenario, three-route experience, and human-authorized repair.
- Round 3 visual choices were delegated with: "elige tu".

### Active shaping moments

- The participant directed: "lo que sea para que el proyecto gane". This authorizes tactical optimization within the already agreed project scope, not expansion beyond the rules or winner gates.
- The participant delegated visual direction, so design choices must be justified by judge comprehension, accessibility, and evidence clarity.

## 2026-08-26 — Scope

### Decisions

- Confirmed EqualTrace as the existing project name; no renaming work enters the sprint.
- Fixed WebMCP implementation teams as the primary user and judges acting as product/security reviewers as the challenge-facing user.
- Preserved one deterministic fictional account-deletion scenario and the complete twelve-step proof chain.
- Made native WebMCP, real three-route capture, first divergence, human authority, dynamic capability lifetime, rerun, and receipt the indivisible competition scope.
- Reserved the last two days before the internal freeze for native repetition, adversarial checks, accessibility, clean-clone verification, video, and submission materials.
- Named every major exclusion and prohibited its return until all P0/P1 gates pass.

### Scope cuts

- Cut second scenarios, external scanning, automatic third-party patching, real destructive actions, backend/accounts, external model APIs, multi-agent orchestration, generalized certification, plugin/fixture platforms, and decorative analytics.
- Rationale: each adds variability or implementation surface without improving the clarity or reliability of the winning chain.

### Interview record

- Mandatory context was substantially available in the existing architecture, prioritization, winning-standard, roadmap, and learner-profile documents.
- When asked for additional brain-dump and time-budget detail, the participant redirected with: "dios tu ve que hacer pero ya de una vez".
- This was treated as an explicit request to choose the focused winning scope immediately rather than prolong the interview.
- Deepening rounds taken: 0. The participant explicitly requested document generation now.

### Assumptions to validate during execution

- Codex may progress autonomously on safe local implementation; participant involvement remains necessary for native browser checks and external publication/submission actions.
- The official deadline is not the working deadline; the internal freeze remains 2026-09-02 at 18:00 Bolivia.

## 2026-08-26 — PRD

### Decisions

- Converted the scope into nine product epics covering judge comprehension, deterministic control, three real routes, semantic comparison, human authority, temporary capability, rerun/receipt, and accessible resilience.
- Required honest provenance labels for fixture preview, current-session evidence, and native evidence.
- Defined green as a complete evidence-backed rerun across outcome plus all six protection groups; missing evidence is incomplete, never pass.
- Made page reload, reset, expiry, proposal drift, changed intent, duplicate calls, and unsupported browser observable fail-closed states.
- Kept acceptance criteria user-visible and testable; implementation structure remains deferred to the technical specification.

### Edge-case discoveries

- Consent after commitment is a sequence failure even when the consent event exists.
- Agent-provided identity cannot grant human authority.
- A page reload must never restore stale approval or unsupported native evidence.
- Receipt download failure must not erase the verified on-screen result.
- Preview evidence is useful for opening comprehension but must never satisfy native acceptance.

### Interview record

- The participant requested immediate continuation: "de una vez siguiente".
- Existing scope and project contracts contained enough product context to complete the mandatory beats without another question round.
- Deepening rounds taken: 0. The participant's repeated preference is autonomous forward progress.

## 2026-08-26 — Technical spec

### Decisions

- Selected a static React/TypeScript/Vite application with plain CSS, npm lockfile, no backend, and no runtime model API.
- Selected GitHub Pages as the primary HTTPS deployment target to minimize accounts, infrastructure, secrets, and subpath risk.
- Defined three isolated comparable run contexts produced by one immutable scenario and domain engine.
- Defined a pure fail-closed comparator, deterministic trace IDs, canonical SHA-256 receipt, and in-memory session state.
- Fixed the native surface on `document.modelContext.registerTool`; production will never polyfill it.
- Bound dynamic repair registration to the current specification's registration `AbortSignal` and kept the schema constant across registrations.
- Defined four stable tools plus one approval-bound consequential tool.
- Kept visible human approval outside every WebMCP-accessible command path.
- Specified a full file tree, data lifecycle, PRD-to-component mapping, quality gate, deployment path, and six implementation gates.

### Documentation validation

- Reviewed the current OpenAI Site tools guide, WebMCP Community Group draft dated 2026-08-26, Chrome implementation guidance, security guidance, and eval guidance.
- Confirmed that OpenAI's built-in browser can expose page tools from the shared live page and that normal confirmation policies continue to apply.
- Confirmed the current imperative API surface, tool annotations, execute cancellation signal, and registration lifetime signal.

### Architecture self-review

- Avoided sequential mutation of one account by deriving isolated route contexts from the same seed; otherwise later routes could not perform an equivalent deletion.
- Separated semantic receipt identity from volatile native environment metadata to preserve deterministic hashes.
- Prevented automated simulated registries from satisfying native acceptance by using an injected port rather than a global polyfill.
- Kept the repair tool name/schema constant to reduce unregister/re-register race ambiguity in the draft API.

### Interview record

- The participant asked how much remained and requested immediate building.
- Mandatory technical preferences were resolved from the learner profile, installed toolchain, public-deployment requirement, existing architecture, and explicit preference for autonomous decisions.
- Deepening rounds taken: 0. The fastest safe path is now checklist then implementation.

## 2026-08-26 — Build checklist

### Decisions

- Locked autonomous build mode with a speed-run cadence and no comprehension pauses.
- Reserved participant pauses only for native WebMCP validation, external publication/account actions, final visual judgment, video publication, and submission confirmation.
- Sequenced twelve tasks by dependency: reproducible scaffold, deterministic core, shared store, native spine, real routes, judge verdict, human authority, temporary capability, repaired receipt, hardening, native release proof, and Devpost handoff.
- Kept the native discovery smoke test before broad UI expansion and blocked P2 work until the complete P0/P1 chain passes.
- Defined the submission wow moment as the repair tool being absent, appearing only after exact visible approval, executing once, disappearing, and yielding a green three-route receipt.

### Interview record

- The participant repeatedly delegated planning and tactical choices with directions including "tu ve lo mejor", "elige tu", and "solo quiero que empecemos a hacer".
- These prior answers resolve the checklist branch as hand-off planning, autonomous execution, and a straight run to the MVP rather than additional preference interviews.
- The already confirmed winning idea resolves the wow-moment question: expose the hidden protection bypass, preserve human authority over repair, and prove parity after rerun.
- Deepening rounds taken: 0. The participant explicitly prioritized beginning implementation immediately.

### Gut check

- Twelve sequenced tasks are the smallest set that preserves every competition-critical dependency and gives each gate a concrete verification point.
- The checklist is locked for implementation; changes are allowed only when evidence reveals a blocker or a safer path to the same winning chain.

## 2026-08-28 — Build item 1: reproducible scaffold

### Implemented

- Created a strict React 19 and TypeScript 6 application built by Vite 8 with relative production assets for static subpath hosting.
- Created an honest initial workbench shell that labels the account deletion fictional, distinguishes fixture preview from recorded evidence, and makes no native WebMCP claim.
- Added deterministic test adapters for clock, digest, and a simulated-only WebMCP registry without attaching anything to `document.modelContext`.
- Added Vitest/Testing Library, Playwright against installed Chrome, ESLint, Prettier, strict TypeScript projects, CI, and a gated GitHub Pages workflow skeleton.
- Created and pinned `package-lock.json`; the running application has no backend, secret, external model, account, or runtime network API.

### Verification evidence

- `npm ci` — passed; 243 packages audited, zero reported vulnerabilities.
- `npm run typecheck` — passed.
- `npm test -- --run` — passed, 1 test file and 1 test.
- `npm run build` — passed; generated `dist/index.html` with `./assets/...` script and stylesheet paths.
- `npm run check` — passed format, lint, typecheck, Vitest, production build, and one Playwright Chrome journey.
- `npm audit --omit=dev` — zero reported vulnerabilities.

### Gate decision

- Checklist item 1 passed and item 2 is now the earliest admissible work.
- Native WebMCP remains unimplemented and unvalidated; no native claim was added.

## 2026-08-28 — Build items 2–3: deterministic core and shared store

### Implemented

- Defined stable route, source, checkpoint, invariant, scenario, run, event, divergence, and comparison contracts.
- Implemented one deterministic fictional account-deletion scenario with protected, broken-agent, and repaired-agent policies over shared domain commands.
- Bound visual, assistive, and agent evidence to pointer, keyboard, and WebMCP sources respectively; deterministic IDs derive from run identity and sequence.
- Implemented a fail-closed comparator that refuses missing routes and identity drift, validates event identity/source/order, checks equal outcomes, and evaluates the six semantic protection requirements.
- Implemented an immutable `WorkbenchStore` with preview/baseline phases, epoch invalidation, route-provenance rules, native-support gating, subscriptions, reset, and audit commands.
- Replaced component-local state with the shared store used by the visible workbench; simulated agent evidence remains explicitly labelled and never sets native invocation.

### Verification evidence

- 20 unit/component tests pass across four files.
- Comparator cases cover deterministic repetition, missing routes, seed drift, fabricated source, late consent, duplicate evidence, the expected broken disclosure divergence, repaired pass, and seeded regression.
- Store cases cover immutable preview, subscription, reset, stale epoch, incompatible run, invalid provenance, unavailable native environment, simulated failure, and reset invalidation.
- Full `npm run check` passes format, lint, strict typecheck, all 20 tests, production build, and Playwright Chrome journey.
- The first Playwright run exposed an ambiguous text locator; the selector was narrowed to exact text and the complete gate then passed.

### Gate decision

- Checklist items 2 and 3 passed. Item 4 is the next and riskier gate.
- Native WebMCP is still neither implemented nor validated. UI expansion remains blocked until stable native discovery and visible shared-state change are proven.

## 2026-08-28 — Build item 4: native WebMCP spine

### Implemented

- Added minimal current `document.modelContext.registerTool` declarations, a production-only native adapter, abort-bound registration, and a separate simulated test port that never patches the browser global.
- Registered exactly four stable tools with constant bounded schemas: status, broken agent route, audit, and bounded repair staging.
- Routed the native agent handler through the same deterministic scenario commands and shared `WorkbenchStore` used by React.
- Kept `equaltrace_apply_approved_repair` absent; staging cannot approve, register, or apply a repair.
- Added explicit unsupported and registration-failed states to the visible environment status.

### Verification evidence

- Full `npm run check` passed with 29 unit/component/integration tests, a production build, and two Playwright journeys.
- The Playwright tool journey imports a simulated port directly from `src/test`; it is labelled simulated and confirms that no native provenance is created.
- ChatGPT desktop `26.825.32147` with the Codex in-app browser discovered exactly the four stable tools at `http://127.0.0.1:5174/`.
- A native `equaltrace_run_agent_route` call on implementation commit `0062715887c5b6f86ee9903ab5e2717315c464df` returned `evidenceProvenance: native` and changed the same visible Agent card to `native evidence recorded`.
- The first native invocation exposed an optional-callback-metadata compatibility defect; it was fixed, covered by regression test, fully regated, and successfully repeated.
- Exact environment, discovery, invocation, response, visible state, and limitations are recorded in `evidence/native/2026-08-28-local-spine-smoke.md`.

### Gate decision

- Checklist item 4 passed. Native discovery and same-page state change are no longer blockers for Gate B.
- This is local spine evidence only; public HTTPS, dynamic capability lifetime, and five-run release proof remain incomplete and cannot inherit this pass.
- Item 5 is now the earliest admissible work: real visual and keyboard/assistive baseline routes.

## 2026-08-28 — Build item 5: real three-route baseline

### Implemented

- Added isolated visual and assistive route sessions that call the same deterministic domain commands used by the agent policy.
- Bound visual progression to primary pointer events and assistive progression to `Enter` or space key events; neither route accepts a claimed actor or generic source payload.
- Required ordered consequence disclosure, exact account-bound consent, commitment, completion feedback, cancellation window, recovery guidance, and observed outcome.
- Added visible consequence/consent/completion states, deterministic focus movement, concise live announcements, and reset-by-epoch behavior.
- Added a minimal baseline audit control that remains disabled with explicit guidance until all three isolated routes exist.

### Verification evidence

- 34 Vitest tests pass across eight files, including source binding, identical semantic sequence, route isolation, invalid order, wrong-input rejection, focus, and announcements.
- Five Playwright journeys pass: honest scaffold, isolated simulated tool, pointer-only route, keyboard-only route with focus assertions, and three-route comparison.
- The automated comparison proves all routes share scenario/version/seed, all reach `deleted`, and the broken agent fails first at `disclosure.consequences` with `outcomeParity: true`.
- ChatGPT's in-app browser completed both real human routes, invoked the native agent tool, and invoked the native audit on implementation commit `347db59c3c90588299881fb67059241f2864663c`.
- The same visible page showed current-session human evidence, native agent evidence, and the exact first divergence. Full details are recorded in `evidence/native/2026-08-28-three-route-baseline.md`.

### Gate decision

- Checklist item 5 passed. The three-actual-routes winner gate now has local native evidence.
- The verdict presentation is intentionally minimal; item 6 must make the failure scannable and memorable without changing its evidence semantics.
- Item 6 is now the earliest admissible work.

## 2026-08-28 — Build item 6: judge-first verdict and evidence experience

### Implemented

- Rebuilt the opening experience around the plain-language conflict: the agent reaches the correct deletion outcome while skipping protections required on both human routes.
- Added an explicit `Fixture preview · not current evidence` label, a known-bypass verdict card, visible fictional scenario identity, and a reset action above the fold.
- Added three route summaries with source, provenance, outcome, and semantic protection coverage; the preview shows 6/6 visual, 6/6 assistive, and 2/6 agent coverage without claiming current evidence.
- Added a first-divergence comparison that puts expected human evidence beside the missing agent disclosure and links every reference to the progressive semantic trace ledger.
- Added phase-aware blocking guidance, a collapsed evidence drawer, SVG status iconography, semantic color plus text, skip navigation, visible focus, 44-pixel-or-larger controls, reduced-motion handling, and mobile-first wrapping.
- Preserved the existing pointer, keyboard, shared-store, comparator, and native WebMCP semantics. Phase 6 added no approval path or consequential capability.

### Verification evidence

- `npm run check` passed format, ESLint, strict TypeScript, 36 Vitest tests across nine files, production build, and eight Playwright journeys.
- New UI coverage verifies preview honesty, immediate plain-language comprehension, progressive evidence disclosure, current simulated provenance, and expected/observed event links.
- Playwright passed at 390×844, 1440×900, and 1920×1080 with the ledger both collapsed and expanded; page scroll width never exceeded viewport width.
- Manual inspection in the Codex in-app browser confirmed the verdict and preview label are visible on fresh load, native availability is reported from the real environment, and the 390×844 view remains legible with zero horizontal overflow.
- The complete Phase 6 implementation and documentation gate is committed at `d8f85295d21ff9e603995a168495c5c6dc1bfa24`.
- Exact Phase 6 evidence and limitations are recorded in `evidence/ui/2026-08-28-judge-first-experience.md`.

### Design decision

- Applied a restrained forensic-premium system: near-black neutral surfaces, cyan route semantics, amber divergence semantics, and no green verdict until a complete evidence-backed repaired rerun exists.
- Dense IDs and trace prose stay behind progressive disclosure so a judge can understand the bypass before inspecting implementation evidence.

### Gate decision

- Checklist item 6 passed. The baseline failure is now scannable and evidence-linked without conflating fixture, simulated, recorded, or native provenance.
- Item 7 is now the earliest admissible work: bounded repair staging and the human-only approval boundary.

## 2026-08-28 — Build item 7: bounded repair and human-only approval

### Implemented

- Added canonical JSON serialization, a production Web Crypto SHA-256 service, injected clock/digest dependencies, and a deterministic repair derivation module.
- Bound the single proposal to the current missing agent checkpoint, scenario, version, seed, requested outcome, evidence IDs, approval epoch, two-minute expiry, stable repair ID, and digest.
- Added `repair_staged` and `repair_approved` states with immutable authority records; reset, rejection, close, revocation, mismatch, cancellation, baseline drift, expiry, and new-session paths fail closed.
- Added a responsive Repair Center that shows the exact fictional action, tool, checkpoint change, consequence, scenario/seed, expiry, identity, and digest before visible approval.
- Kept `equaltrace_apply_approved_repair` absent before and after item 7 approval. Stable tools may report or stage the proposal but expose no approval command, actor override, URL route, or generic dispatch.

### Verification evidence

- Implementation commit: `b2112b07ae66ca2df72d466e5d8d4c2a74e5c8f0`.
- `npm run check` passed Prettier, ESLint, strict TypeScript, 43 Vitest tests across 11 files, production build, and 9 Playwright journeys.
- Repair tests cover stable digest/scope, hostile evidence text, exact-match approval, claimed-actor tool input, rejection, close, revocation, pre- and post-approval expiry, reset/seed drift, cancellation-safe staging, and new-session invalidation.
- The new Playwright journey proves URL approval parameters do nothing, staging occurs through the isolated simulated WebMCP port, visible approval records exact authority, and the consequential apply tool remains absent. This is automated simulated evidence, not native acceptance.
- A headed Playwright CLI inspection found no application console error; the only console entry was React's development-tools informational message.

### Security decision

- Item 7 deliberately stops after recording exact human authority. Dynamic registration, execution, concurrency, and teardown belong to item 8 so automated/UI state cannot be misrepresented as native discoverability.

### Gate decision

- Checklist item 7 passed. The human-authority winner gate has deterministic automated proof, while native capability appearance/removal remains unclaimed.
- Item 8 is now the earliest admissible work: exact temporary single-use repair capability registration and teardown.

## 2026-08-28 — Build item 8: temporary single-use repair capability

### Implemented

- Added a dedicated dynamic WebMCP lifecycle manager that registers only `equaltrace_apply_approved_repair` after exact current human authority exists and binds registration lifetime to an `AbortController`.
- Added a session-unique approval nonce and closure binding across repair ID, digest, scenario, version, seed, epoch, nonce, and expiry; the store independently revalidates the same authority before policy mutation.
- Added a synchronous single-use/in-flight guard. Success changes the shared agent policy to `repaired-agent`, records the applied identity, and aborts registration immediately; replay and concurrent attempts yield at most one success.
- Made reset, expiry, revocation, proposal edit, seed/scenario/intent drift, cancellation, execution failure, registration failure, pending-registration invalidation, and page teardown fail closed.
- Replaced the hard-coded capability label with honest `absent`, `registering`, `registration reported`, and `registration failed` states. The visible copy explicitly says adapter acceptance is not agent discovery proof.
- Updated the stable status tool and agent route to report lifecycle state and use the shared repaired policy only after the consequential capability succeeds.

### Verification evidence

- Implementation commit: `7fc5e8c99161d10f1fdc664dcf56ca1272cfd086`.
- `npm run check` passed formatting, ESLint, strict TypeScript, 58 Vitest tests across 12 files, production build, and 9 Playwright journeys.
- The dedicated lifecycle suite passed 14 cases covering exact registration, stale closures, wrong digest, use, replay/concurrency, cancellation, expiry, reset, revocation, proposal/seed/scenario/intent drift, registration failure, and invalidation while registration was pending.
- Native Codex in-app-browser validation at `http://127.0.0.1:5173/` discovered four stable tools before approval, exactly five after visible approval, returned `policy: repaired-agent` from the one exact apply call, returned immediately to four tools, and rejected replay through the stale handle.
- Exact native environment, proposal identity, response, discovered surfaces, and limitations are recorded in `evidence/native/2026-08-28-repair-capability-lifecycle.md`.

### Security decision

- Registration success in the page state is deliberately called `registration reported`; only the supported client's fresh tool fetch satisfies native discovery.
- Any first execution attempt ends the authority, including invalid input or cancellation. Recovery requires a fresh visible approval rather than keeping a possibly probed capability alive.
- A store subscription aborts the registration signal synchronously on invalidation, including while the browser's registration promise is still pending.

### Gate decision

- Checklist item 8 passed with both automated adversarial coverage and the required native absence/appearance/use/disappearance sequence.
- Item 9 is now the earliest admissible work: recreate all three isolated routes under the applied policy and issue the deterministic evidence-backed parity receipt.

## 2026-08-30 — Build item 9: repaired rerun and deterministic receipt

### Implemented

- Added `repaired_capture` and `verified` phases. Starting the repaired proof advances the epoch, removes every baseline trace and staged/approved record, and preserves only the applied repair identity and repaired agent policy.
- Reused the real pointer and keyboard journeys with stable repaired run identities; the native agent tool selects the shared repaired policy and emits its own fresh seven-event trace.
- Added a receipt builder that independently reruns the comparator, requires outcome parity plus all six semantic assertions, canonicalizes recursively sorted JSON, and hashes the stable body with SHA-256.
- Bound the receipt to application/scenario identity, original state, requested/final outcome, exact applied repair, three route identities, every evidence ID, all assertion links, and pass verdict while excluding expiry, approval nonce, wall clock, browser, UI, and download state.
- Added a green judge state, repaired progress/regression guidance, 18 visible evidence links, canonical JSON download, safe retry after download failure, a committed receipt fixture, and an independent Node verifier.

### Verification evidence

- Implementation commit: `25c4276f730b981355d7e70c220dbff22abc3c59`.
- `npm run check` passed formatting, ESLint, strict TypeScript, 66 Vitest tests across 14 files, production build, 9 Playwright journeys, and independent receipt verification.
- Receipt coverage compares equivalent canonical bytes/hashes; mutates scenario, repair, route, evidence, assertion, outcome, and verdict classes; rejects incomplete/failed evidence; and rechecks apparently passing input against the comparator.
- A seeded broken agent policy during repaired capture returned `fail` at `agent / disclosure.consequences` and left both receipt fields null.
- The Playwright winner path now continues through fresh repaired visual/assistive evidence, repaired agent invocation, pass, receipt issuance, and all 18 evidence links. A component test forces download creation failure and proves the receipt remains visible.
- `node scripts/verify-receipt.mjs` verified committed fixture identity `30196aeec258f531340ba675f3545536394d7088bc870e56afb01de373451f42` independently of application TypeScript.
- Two equivalent native reruns in the Codex in-app browser returned the identical receipt ID `80d69ae946fc941d2f4192f5cfbda980eefa9612124f68c45e11c6a54de6650b`. Exact environment, native responses, visible result, and limits are recorded in `evidence/native/2026-08-30-repaired-rerun-receipt.md`.

### Receipt decision

- Native environment metadata stays outside the semantic hash so the same protected action and evidence can reproduce the same receipt across supported clients.
- `receiptId` is SHA-256 over the canonical body excluding the identity field itself; the independent verifier removes `receiptId`, canonicalizes the remaining body, and recomputes the digest.
- A passing status value is never sufficient: the builder independently validates route integrity and every required checkpoint before signing the body.

### Gate decision

- Checklist item 9 passed. The complete local winner chain now ends in a fresh, evidence-linked deterministic receipt rather than a policy flag.
- Item 10 is now the earliest admissible work: accessibility/adversarial hardening, remaining release scripts and coverage thresholds, and the working-tree plus clean-clone gate.

## 2026-08-30 — B3 final-video sprint planned

- Participant explicitly delegated the plan and straight-through execution of a final B3 candidate.
- The requested active shaping is to raise emotional impact while preserving EqualTrace's evidence-first credibility.
- The wow moment is now front-loaded: concrete deletion stakes followed by `6/6 · 6/6 · 2/6` inside the first ten seconds.
- Eight bounded checklist items (13–20) cover script, composition, sound, render, judge audit, quality gate, and handoff.
- No new product feature, native claim, external dependency, generated person, or public submission action is admitted.

## 2026-08-30 — B3 final-video sprint complete

### Implemented

- Added a dedicated `EqualTraceB3` Remotion composition while preserving the V2 and V1 compositions and outputs.
- Replaced the abstract opening with a concrete protection-loss contrast: a person receives consequences, exact consent, a cancellation window, and recovery; the agent reaches the same deleted outcome without four protections.
- Made the complete `Visual 6/6 · Assistive 6/6 · Agent 2/6` comparison fully visible by 0:10.
- Preserved the first runtime divergence, exact visible human review, native `4 → 5 → 4` capability lifetime, fresh three-route rerun, five native runs, and deterministic receipt.
- Added a 150-word English B3 narration, synchronized captions, a 97-second original soundbed, B3 render/verify commands, a final 3×3 contact sheet, and a first-time-judge audit.
- Changed the Devpost tagline to `The agent succeeded. The safety contract failed.` and updated status, handoff, and video reproduction instructions.

### Verification evidence

- `npx tsc --noEmit` passed in `submission-video/`.
- `npm run verify:b3` passed: 1920×1080 H.264/AAC, 97.1 seconds, 13,831,203 bytes.
- FFmpeg measured -16.2 LUFS integrated loudness and -1.5 dBTP true peak.
- Final MP4 SHA-256: `4723e63798a1a61b201e06f91ab4bf4b3962bf66f9deab4c579c3ea1ec2fb751`.
- Contact-sheet review covers human loss, 6/6–6/6–2/6, first divergence, visible approval, absent/available-once/removed capability, receipt, and close.
- Root `npm run check` passed with 66 Vitest tests, 12 Playwright journeys, production build, receipt verification, and native-evidence verification.

### Gate decision

- Checklist items 13–20 pass. B3 is the strongest local video candidate and the B3 sprint is complete.
- The remaining audiovisual watch/listen, YouTube upload, personal Devpost fields, and final submission confirmation remain external human gates.
- No new native acceptance claim was created, and the frozen `challenge-v1.0.0` deployment remains unchanged.
