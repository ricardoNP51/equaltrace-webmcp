# Product Requirements Document

## Product Summary

EqualTrace is a judge-ready verification workbench for one consequential WebMCP scenario. It reveals a failure that outcome-only testing misses: an agent can reach the same correct final state as a person while skipping disclosures, consent, feedback, reversibility, or recovery that constrain the human journey.

The product records three real routes — visual, keyboard/assistive, and native WebMCP — against the same deterministic account-deletion scenario. It identifies the earliest semantic protection divergence, lets the agent prepare a bounded repair without approving it, gives a person sole authority to approve the exact change, and proves the result by rerunning every route and issuing an evidence-backed parity receipt.

### Product promise

> Same action. Same protections. Provable.

### Experience principles

1. **Lead with the failure:** a first-time judge understands the bypass in twenty seconds or less.
2. **Outcome is not parity:** equal final state never hides a missing protection.
3. **Evidence before confidence:** every verdict links to the interaction that supports it.
4. **Human authority stays visible:** the agent may propose, but it cannot approve its own consequential repair.
5. **Green means proven:** green is reserved for a complete, comparable, evidence-backed rerun.
6. **No misleading simulation:** fixture preview, current-session interaction, and native evidence are visibly distinguished.
7. **One excellent story:** no secondary scenario or decorative feature competes with the golden path.

## Target User

### Primary user

A product, frontend, or platform engineer preparing to expose a consequential action through WebMCP. They need to know whether the agent-facing route preserves the protections present in equivalent human and assistive routes before release.

### Challenge-facing user

A judge with less than three minutes who needs to understand the risk, see genuine WebMCP leverage, and verify that the repair changes the real capability surface rather than a decorative status card.

### Secondary users

- Security and quality reviewers evaluating agent authorization boundaries.
- Accessibility specialists checking whether protections survive outside the visual route.
- WebMCP implementers exploring repeatable protection-parity evaluation.

## Core User Journey

1. The judge opens EqualTrace and immediately sees the thesis, the fictional deletion scenario, and a clearly labelled preview of the known bypass.
2. They reset to a named deterministic seed and begin a current-session baseline run.
3. A person completes the visual deletion journey after seeing consequences, providing exact consent, receiving completion feedback, and seeing cancellation/recovery information.
4. A person completes the equivalent journey using only the keyboard and perceivable assistive announcements.
5. A supported agent discovers and calls the native WebMCP action; its state changes are reflected in the same visible workbench.
6. EqualTrace compares the three ordered protection histories and fails the baseline even though all routes reached the same deletion outcome.
7. The interface highlights the earliest mismatch, explains it in plain language, and links both expected and observed evidence.
8. The agent prepares a repair proposal limited to the missing protection sequence.
9. A person reviews the exact affected action, change, consequences, expiry, and repair identity, then explicitly approves or rejects it in the visible interface.
10. Only after approval does the exact single-use repair action become available to the agent.
11. The agent applies the repair; the capability immediately disappears.
12. EqualTrace resets and reruns the three routes from the same seed.
13. The repaired run passes every required invariant and produces a downloadable deterministic parity receipt.

## Epics And User Stories

### Epic 1: Immediate judge comprehension

#### Story 1.1 — Understand the problem on arrival

- As a judge, I want to understand the protection bypass immediately so that I can evaluate the product without a long explanation.

Acceptance criteria:

- The opening view states that the agent reached the deletion outcome while skipping protections applied to people.
- The fictional nature of the scenario is visible without opening documentation.
- The known broken preview is labelled as a preview or fixture and cannot be mistaken for current-session native evidence.
- The primary next action is visually obvious and starts or resets the baseline evidence run.
- A plain-language verdict appears before dense trace details.
- The value proposition remains understandable at 390×844, 1440×900, and 1920×1080.

#### Story 1.2 — Distinguish evidence states honestly

- As a reviewer, I want to know whether evidence is previewed, recorded in this session, or native so that I do not trust unsupported claims.

Acceptance criteria:

- Preview, recorded, native, unsupported, incomplete, and repaired states have explicit text labels, not color alone.
- No native badge appears before a native tool has actually been discovered and invoked in the current evidence context.
- Reset removes current-session claims and returns the interface to an honest ready state.
- Unsupported browsers show human-route functionality without implying agent-route validation.

### Epic 2: Deterministic scenario control

#### Story 2.1 — Begin every route from the same truth

- As a product reviewer, I want all routes to use the same scenario and starting state so that the comparison is meaningful.

Acceptance criteria:

- The active scenario name, version, seed, requested action, and initial account state are visible.
- Visual, assistive, and agent runs cannot be compared when scenario version, seed, requested outcome, or starting state differs.
- Reset restores the same known starting state and stable scenario identity.
- Reset cancels any active run, pending approval, or previously exposed repair capability.
- Repeating the same complete baseline produces the same semantic sequence and verdict.

#### Story 2.2 — Keep the action safely fictional

- As a participant or judge, I want to explore a consequential failure without risking a real account.

Acceptance criteria:

- The scenario identifies the account and deletion as simulated.
- No external account, credential, network mutation, payment, or production system is required.
- Completion changes the shared fictional account state in a way visible to every route.
- The fictional framing does not weaken the consequential meaning of deletion, cancellation window, and recovery guidance.

### Epic 3: Real human and assistive routes

#### Story 3.1 — Complete the visual route

- As a person using a pointer, I want the deletion journey to present meaningful protections before commitment.

Acceptance criteria:

- The route presents consequences before the final deletion commitment.
- Consent is explicit and bound to the exact fictional account and deletion action.
- Completion feedback identifies what happened and the current account state.
- Cancellation or reversibility information is available for the defined window.
- Recovery guidance explains what to do if the deletion was unintended or fails.
- Trace evidence is emitted only by actual route interactions.

#### Story 3.2 — Complete the assistive route without a pointer

- As a keyboard or assistive-technology user, I want equivalent protections and feedback so that safety does not depend on visual interaction.

Acceptance criteria:

- The complete journey works with keyboard input only.
- Focus order follows the decision sequence and focus is always visible.
- Consequences, consent request, errors, completion, cancellation information, and recovery guidance are perceivable through appropriate announcements.
- The route produces its own interaction evidence rather than copying the visual trace.
- The assistive route is compared by semantic protection sequence, not by identical visual layout.

### Epic 4: Native WebMCP route

#### Story 4.1 — Discover and run the real agent action

- As a judge using a supported agent client, I want to discover and invoke EqualTrace through native WebMCP so that WebMCP is central to the experience.

Acceptance criteria:

- A supported client can discover the stable EqualTrace tools from the deployed page.
- Invoking the native audit or agent action updates the same scenario state and visible workbench.
- The agent route begins from the same scenario identity and requested outcome as the other routes.
- Native invocation emits its own ordered route evidence.
- The baseline agent route reaches the correct deletion outcome while intentionally omitting the defined earliest protection.
- A mock, polyfill, preview, or manually labelled trace never satisfies native acceptance.

#### Story 4.2 — Fail honestly when native WebMCP is unavailable

- As a visitor using an unsupported browser, I want useful guidance without a false success claim.

Acceptance criteria:

- The product identifies that native agent verification is unavailable in the current environment.
- Human and assistive routes remain usable.
- The comparison remains incomplete rather than green.
- The interface gives concise supported-client guidance and a retry path.
- Environment failure does not create or expose the repair capability.

### Epic 5: Protection comparison and first divergence

#### Story 5.1 — Compare semantic protections, not surface behavior

- As a WebMCP implementer, I want equivalent actions aligned by meaning and sequence so that different interfaces can still be compared fairly.

Acceptance criteria:

- The comparison covers outcome, disclosure, consent, feedback, reversibility, and recovery.
- Each protection assertion identifies the route, semantic checkpoint, order, evidence, and result.
- Equal final outcome with any required missing protection produces a failure.
- Missing or incomparable evidence produces incomplete, not pass.
- Presentation differences alone do not create a protection failure when semantic requirements are equivalent.

#### Story 5.2 — Show the earliest meaningful mismatch

- As a judge, I want one precise first divergence so that the problem is memorable and actionable.

Acceptance criteria:

- The interface names the earliest missing or conflicting protection in plain language.
- Expected human/assistive evidence and observed agent evidence are shown together.
- Route and evidence identifiers are available for verification without dominating the default view.
- Later divergences remain inspectable but do not obscure the first one.
- Reordered, missing, duplicated, or fabricated evidence cannot produce a false green.

### Epic 6: Bounded repair proposal and human authority

#### Story 6.1 — Let the agent prepare, but not authorize, a repair

- As a product engineer, I want the agent to propose a focused correction so that diagnosis can lead to action without surrendering human authority.

Acceptance criteria:

- The proposal identifies the exact consequential action and missing protection sequence it would change.
- The proposal shows a stable repair identity, bounded effect, consequences, and expiry.
- The proposal cannot expand to unrelated scenarios, tools, or policies.
- Preparing a proposal does not change the scenario or expose the commit action.
- No agent-accessible control, URL value, stored field, or claimed actor identity can approve the proposal.

#### Story 6.2 — Approve the exact repair visibly

- As the responsible person, I want to inspect and explicitly approve or reject the exact change so that authority remains accountable.

Acceptance criteria:

- Approval is available only through a visible human interaction.
- The approval view displays the affected action, exact change, consequences, repair identity, and expiry before confirmation.
- Rejecting or closing the approval leaves the repair action unavailable.
- Editing the proposal after approval invalidates that approval.
- Approval of one repair never authorizes a different repair, action, scenario, or seed.

### Epic 7: Temporary consequential capability

#### Story 7.1 — Expose only the approved action

- As a security reviewer, I want the repair action absent until exact approval so that an agent cannot manufacture authority.

Acceptance criteria:

- The repair action is not discoverable before visible approval.
- After approval, only the exact approved repair becomes discoverable.
- The interface makes the capability's availability, scope, and remaining validity visible.
- Attempts made before approval or against different repair details fail closed.

#### Story 7.2 — Remove authority when it is no longer valid

- As a security reviewer, I want the capability to disappear after its authority ends so that stale or replayed actions cannot execute.

Acceptance criteria:

- Successful use removes the capability immediately.
- Expiry, reset, revocation, changed repair content, changed scenario intent, or changed seed removes it.
- Reusing the same approved action fails.
- Duplicate or concurrent attempts produce at most one successful repair.
- Failure or cancellation leaves an accurate visible state and a safe recovery path.

### Epic 8: Repaired rerun and parity receipt

#### Story 8.1 — Prove the repair across every route

- As a product team, I want the same audit repeated after repair so that a changed status label cannot masquerade as a fix.

Acceptance criteria:

- The repaired run starts from the same scenario version, seed, action, and initial state.
- Visual, assistive, and native agent routes are executed again and emit new evidence.
- The repaired agent route now preserves the required protection sequence.
- All six protection groups and the final outcome must pass before the verdict is green.
- A deliberately reintroduced regression returns the verdict to fail at the correct earliest divergence.

#### Story 8.2 — Export a trustworthy receipt

- As a reviewer, I want a portable parity receipt so that the verdict can be inspected after the demonstration.

Acceptance criteria:

- Receipt generation is unavailable while required routes or evidence are incomplete.
- The receipt includes scenario identity, route identities, evidence references, repair identity, verdict, and deterministic receipt identity.
- Every passing assertion links to recorded evidence.
- Repeating an equivalent repaired run produces the same canonical receipt identity.
- Changing meaningful evidence, scenario, repair, or verdict changes the receipt identity.
- The receipt can be downloaded without an account or external service.

### Epic 9: Accessible, resilient judge experience

#### Story 9.1 — Finish the golden path without hidden prerequisites

- As a judge, I want a guided but credible journey so that I can evaluate the product in minutes.

Acceptance criteria:

- The current phase, required next action, and blocking condition are always visible.
- Controls that cannot yet run explain why and what unlocks them.
- There are no dead controls, concealed setup steps, or required external accounts.
- Reset is always available and returns to a known safe state.
- Plain-language verdicts remain understandable without narration.

#### Story 9.2 — Use the workbench across access needs and viewports

- As a visitor, I want the workbench to remain operable and legible across input methods and screen sizes.

Acceptance criteria:

- The golden path works with pointer and keyboard only.
- Names, roles, landmarks, focus, contrast, status announcements, zoom, text resize, and overflow remain usable.
- Color is never the only carrier of pass, fail, incomplete, or evidence provenance.
- Motion respects reduced-motion preference and no essential meaning depends on animation.
- The three target viewports show the verdict, route state, and next action without horizontal page scrolling.

## Edge Cases

1. **Compare before all routes finish:** show incomplete and identify the missing route; never infer a pass.
2. **Different seed or scenario version:** refuse comparison and offer a deterministic reset.
3. **Same outcome, missing disclosure:** fail at disclosure even though account state matches.
4. **Consent occurs after commitment:** fail because the semantic order is wrong.
5. **Agent claims to be human:** ignore claimed identity; approval authority depends on the visible human interaction.
6. **Agent requests repair before proposal or approval:** no consequential capability is discoverable.
7. **Proposal changes after approval:** revoke authority and require a new review.
8. **Approval expires while the tool is visible:** remove the capability and explain expiry.
9. **Reset during execution:** cancel or invalidate pending authority and restore the known scenario state.
10. **Duplicate or concurrent repair calls:** allow at most one successful application and report subsequent calls as invalid.
11. **Native registration or invocation fails:** preserve human evidence, mark native evidence unavailable, and provide retry guidance.
12. **Page reload:** begin a new honest session; do not restore stale approval or native claims.
13. **Hostile fixture text:** display it as untrusted scenario content and prevent it from changing instructions, tool identity, or verdict rules.
14. **Receipt requested after a failed rerun:** allow inspection of failure evidence but do not issue a passing receipt.
15. **Long evidence text or 200% zoom:** preserve controls, reading order, and evidence access without clipping.
16. **Reduced motion enabled:** state changes remain clear without transition effects.
17. **Download blocked:** keep the receipt visible and offer a retry without losing the verified run.

## What We Are Building

- One deterministic, fictional account-deletion journey.
- Three real interaction routes over one shared truth.
- Six named protection groups and outcome parity.
- Earliest-divergence evidence with plain-language explanation.
- Agent-prepared, human-approved bounded repair.
- Exact, temporary, single-use consequential capability.
- Full repaired rerun and deterministic downloadable receipt.
- Honest native/preview/recorded provenance states.
- Responsive, keyboard-operable, reduced-motion judge mode.
- Clear unsupported, incomplete, expired, cancelled, and invalid states.

## What We Would Add With More Time

Only after every competition gate passes:

- Additional consequential scenarios and invariant packs.
- Cooperative evaluation of external WebMCP deployments.
- Fixture authoring and reusable organization policies.
- CI integrations and longitudinal receipt comparison.
- Authenticated evidence retention and team workflows.
- Richer analytics for many audits.

These are explicitly excluded from the challenge release because they add surface area without strengthening the single demonstrable proof.

## Submission Proof Points

### WebMCP Leverage

- Stable native tools are discoverable in supported clients.
- Native invocation changes the same visible scenario and emits real agent-route evidence.
- A consequential repair capability is absent, appears only after exact human approval, and disappears after use or invalidation.

### Execution

- The public app completes the coherent broken-to-repaired story from a fresh session.
- Pointer, keyboard, responsive, unsupported-browser, reset, and error states work without verbal rescue.
- A clean clone passes the one-command quality gate and reproduces deterministic artifacts.

### Potential Impact

- The product demonstrates a specific release risk: outcome success can hide protection failure.
- The six-invariant model and receipt show how WebMCP teams could make parity auditable.

### Creativity & Ambition

- EqualTrace compares three real interaction routes by semantic protections rather than screen similarity.
- Diagnosis, bounded repair, human authority, capability lifetime, rerun, and receipt form one end-to-end proof that adjacent evaluators do not provide.

### Demo and claim integrity

- The bypass is visible in the first twenty seconds.
- The narrated public video remains below three minutes and matches the submitted release.
- Fixture preview, current-session evidence, and native evidence are never conflated.
- Every public claim names a reproducible artifact or visible behavior.
