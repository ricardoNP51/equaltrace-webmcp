# Hackathon Build Notes

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
