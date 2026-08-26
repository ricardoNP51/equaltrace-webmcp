# Roadmap to a winner-ready release

Official deadline: 2026-09-03 13:00 PDT (16:00 Bolivia). Internal submission freeze: 2026-09-02 18:00 Bolivia.

The phases below are dependency gates, not permission to defer known blockers until a calendar date. Work always begins with the earliest incomplete phase. The deadline remains binding even though quality, not elapsed time, controls phase completion.

## Phase 0 — Product boundary and priority

- Fix the judge-facing failure, non-goals, competitive distinction, and feature admission test.
- Define architecture, threat boundaries, trace contracts, receipt schema, and the deterministic account-deletion scenario.
- Preserve a clean public history beginning inside the challenge period.

Exit gate: another developer can state what must be built, what must not be built, and how every later claim will be proven.

## Phase 1 — Native WebMCP spine

- Scaffold the smallest TypeScript application and commit the lockfile.
- Create `npm run check` for typecheck, tests, lint, and production build.
- Register one stable read tool and `equaltrace_run_audit` through the current native API.
- Deploy the smallest secure build.
- Discover and invoke both tools in ChatGPT's in-app browser and supported Chrome.
- Record exact app, browser, version, origin, commit, and native evidence.

Exit gate: a native tool invocation changes the same visible page; no mock, shim, or polyfill is presented as acceptance evidence.

Kill rule: no UI expansion while native registration, invocation, and teardown are unreliable.

## Phase 2 — Golden broken vertical slice

- Implement one seeded fictional cloud-account deletion domain engine.
- Give the human route disclosure, exact consent, completion feedback, cancellation window, and recovery guidance.
- Make the intentionally broken agent route reach the same deletion outcome while skipping the earliest protection.
- Show the bypass immediately in the opening judge state.
- Implement deterministic reset and stable event identifiers.

Exit gate: one repeatable run produces the same correct outcome on both routes and a visibly different protection history.

## Phase 3 — Three real route recorders

- Capture the visual route from pointer interactions.
- Capture the complete keyboard/assistive route with logical focus and live announcements.
- Capture the agent route only from native WebMCP invocation.
- Route every action through the same commands, state machine, seed, and recorder.
- Reject fixture-only or hand-authored traces as runtime evidence.

Exit gate: each trace can be replayed to the interactions that emitted it, and equivalent checkpoints use shared semantic identifiers.

## Phase 4 — Protection parity engine

- Normalize outcome, disclosure, consent, feedback, reversibility, and recovery checkpoints.
- Align by semantic sequence instead of DOM position, prose similarity, or elapsed time.
- Identify the earliest mismatch with expected and observed assertions, route, event IDs, severity, and evidence.
- Validate the known broken fixture fails at the intended first divergence.
- Export a canonical, schema-valid, deterministic receipt draft.

Exit gate: tests kill false-green, wrong-first-divergence, missing-evidence, reordering, and route-fabrication defects.

## Phase 5 — Human-authorized repair lifecycle

- Let the agent prepare only a bounded repair proposal.
- Show the exact change, consequences, digest, expiry, and affected capability before approval.
- Keep `equaltrace_apply_approved_repair` absent until a visible human action approves that exact digest.
- Revalidate approval, digest, nonce, expiry, epoch, and single-use status at execution.
- Abort registration after success, expiry, reset, revocation, changed repair content, or changed intent.
- Ensure no tool, URL parameter, stored fixture, or agent-provided actor field can approve the repair.

Exit gate: automated lifecycle tests and native evidence prove absence, appearance, exact execution, and removal across every invalidation path.

## Phase 6 — Proof after repair

- Apply the repair to the real shared capability/domain surface, not display-only text.
- Reset and rerun visual, assistive, and agent routes from the same seed.
- Require all six protection invariants and the outcome to pass.
- Produce the final parity receipt with scenario version, route evidence, repair digest, verdict, and deterministic hash.
- Make every green assertion traceable to recorded evidence.

Exit gate: the repaired flow passes repeatedly, a seeded regression fails, and no mocked registry is needed for the release claim.

## Phase 7 — Judge experience and accessibility

- Make the bypass legible in 10–20 seconds and the first divergence scannable in under 10 seconds.
- Present the three routes, approval boundary, disappearing capability, rerun, and receipt without hidden setup.
- Verify 390×844, 1440×900, and 1920×1080 layouts.
- Complete the judge path with pointer and keyboard only.
- Verify visible focus, landmarks, names, announcements, contrast, reduced motion, zoom, and overflow.
- Remove dead controls, decorative complexity, avoidable copy, and narration-dependent meaning.

Exit gate: no critical or serious automated accessibility finding, no console error, and no judge-path defect at target viewports.

## Phase 8 — Adversarial reliability

- Test malformed inputs, hostile fixture text, prompt injection, cancellation, races, duplicate calls, replay, stale tools, and approval drift.
- Run unit, integration, browser E2E, native probes, clean-clone verification, and deployment health checks.
- Run the full native flow five consecutive times from fresh reset.
- Verify receipt determinism and that unsupported evidence is labelled rather than inferred.
- Update threat model and known limitations from observed behavior.

Exit gate: no critical or high-severity defect remains; every public technical claim has a regenerable artifact.

## Phase 9 — Independent challenge review

- Review the release as a skeptical judge against all four official criteria.
- Compare the live build against direct audit, approval, and human-agent experience competitors.
- Ask whether any feature distracts from the protection-bypass thesis.
- Perform a signed-out/fresh-profile test of live URL, repository, setup, reset, and evidence.
- Freeze features and fix only defects or claim/evidence mismatches.

Exit gate: the product is coherent without verbal rescue and the complete winning chain survives adversarial review.

## Phase 10 — Submission and immutable release

- Record and edit a 2:45–2:58 English demo with the risk visible in the opening beat.
- Complete Devpost copy using only verified release behavior.
- Publish the YouTube video and validate every public link.
- Confirm repository license detection, clean setup, and public release evidence.
- Tag the exact submitted commit as `challenge-v1.0.0`.
- Stop modifying the submitted repository and deployment during judging; continue only in a separate post-submission branch or fork.

Exit gate: Devpost submission is complete before the internal freeze and the live app, repository, video, tag, and submitted claims all point to the same release.

## Post-challenge productization

Only after the immutable competition release:

- Add fixture authoring and industry invariant packs.
- Evaluate deployed third-party WebMCP sites with explicit cooperation.
- Add CI reports, evidence retention, and additional receipt consumers.
- Investigate production authentication, tenancy, and server-enforced authorization.

These items do not retroactively broaden the challenge build.
