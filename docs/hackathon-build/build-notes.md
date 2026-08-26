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
