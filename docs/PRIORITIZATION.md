# EqualTrace product prioritization

## Supreme priority

EqualTrace must make one failure impossible to miss:

> An agent reaches the correct final state while bypassing protections that constrained the equivalent human action.

The competition product is the verifier that discovers, explains, repairs, and proves the removal of that bypass.

This is the organizing decision for scope, architecture, interface, testing, and the submission story. Human approval, capability lifetime, accessibility, trace export, and visual polish matter because they strengthen this proof. None of them replaces it as the headline.

## The complete winning chain

The product is only differentiated when the following chain remains intact:

1. One deterministic consequential action starts from one seed and domain engine.
2. A person completes it through the visual route.
3. A person completes it through the keyboard/assistive route.
4. An agent completes it through native WebMCP.
5. EqualTrace compares ordered semantic protections, not only final state.
6. The interface identifies the first protection divergence and links it to runtime evidence.
7. The agent prepares a bounded repair but cannot approve or apply it.
8. A person approves the exact repair in the visible interface.
9. A one-use, expiring WebMCP repair capability appears, applies the bound repair, and disappears.
10. EqualTrace reruns all three routes and exports a deterministic parity receipt.

Removing any link moves EqualTrace into a category that already has stronger competitors: tool inspector, contract evaluator, consent demo, accessibility scanner, or agent benchmark.

## Priority classes

### P0 — winner-critical

P0 work blocks every other feature. A release with any incomplete P0 item is not submission-ready.

| Capability | Required proof |
| --- | --- |
| Native WebMCP critical path | Real discovery and invocation in ChatGPT's in-app browser or supported Chrome; no polyfill claim |
| One deterministic truth | Visual, assistive, and agent routes call the same domain commands from the same seed |
| Three real routes | Traces are emitted by actual interactions, never by hand-authored route labels |
| Protection comparator | Outcome, disclosure, consent, feedback, reversibility, and recovery are aligned by semantic checkpoint |
| First divergence | The earliest mismatch is visible, specific, and linked to trace event evidence |
| Human authority | No agent-accessible path can approve its own repair |
| Dynamic repair lifetime | The exact commit tool is absent before approval and removed after use, expiry, reset, revocation, or drift |
| Proof after repair | All routes rerun green and produce a schema-valid, deterministic receipt |
| Reliable public release | Fresh-session live URL, clean-clone setup, license, and one-command quality gate work |
| Submission evidence | Honest English description and a public narrated demo under three minutes |

### P1 — winner-amplifying

P1 is required before calling the project winner-ready, but only after the P0 vertical slice works end to end.

- The bypass is understandable in the first 10–20 seconds without narration-dependent context.
- The three routes and first divergence are visually scannable at judge resolutions.
- Pointer, keyboard, focus, announcements, reduced motion, and responsive layouts are verified.
- A judge mode resets the same golden seed and exposes no dead controls or hidden prerequisites.
- Native, simulated, fixture, and recorded evidence are labelled so they cannot be confused.
- Threat boundaries, tool annotations, schema validation, hostile text, replay, expiry, and drift are tested.
- The README, live app, video, and receipt use the same claims and terminology.
- Failure states remain useful: unsupported browser, registration failure, cancelled execution, expired approval, and invalid input.

### P2 — valuable only after winner readiness

- A second consequential scenario.
- Reusable fixture authoring helpers.
- Rich receipt browsing, comparison, or additional export formats.
- CI integration against third-party deployments.
- Broader invariant packs or organizational reporting.

P2 work must not begin while any P0 item is incomplete or any P1 defect can damage the judge path.

### Out of challenge scope

- Generic site crawling or general WCAG scanning.
- Automatic modification of third-party websites.
- Real account deletion, payment, healthcare, or production credentials.
- External model APIs, chat wrappers, authentication, multi-tenancy, or databases.
- Multi-agent orchestration.
- A marketplace, plugin ecosystem, or generalized enterprise platform.
- Claims of legal certification, WCAG conformance, or universal WebMCP safety.

## Feature admission test

A proposed feature enters the challenge build only when every answer is yes:

1. Does it strengthen the complete winning chain?
2. Can a judge see its value during the sub-three-minute demo or verify it directly?
3. Does it preserve one domain engine and deterministic reset?
4. Can its claim be proven by a named automated or native check?
5. Does it avoid a new external service, secret, account, or unreliable dependency?
6. Is it more valuable than fixing the highest-severity open P0/P1 defect?

If any answer is no, defer it. A written exception must identify the official judging criterion improved and the evidence it will create.

## Competitive defense

The headline is not “human approval” or “temporary tools”; other WebMCP projects already demonstrate those patterns. It is not “testing WebMCP”; contract and tool evaluators already exist.

EqualTrace must own this narrower question:

> Did the agent bypass a protection that constrained the equivalent human or assistive action, where did the bypass begin, and is the repair proven across every route?

The visual route proves the normal product contract. The assistive route proves that protections are semantic rather than merely visual. The WebMCP route exposes the new bypass class. First-divergence evidence makes the diagnosis concrete. Human-approved repair preserves authority. The rerun receipt turns the change into proof.

## Stop conditions

“Cannot be improved” is not a testable engineering state. EqualTrace is complete for the challenge when:

- every P0 and P1 item has passed its required evidence gate;
- no known critical or high-severity defect remains on the golden path;
- the full native flow succeeds five consecutive times after a fresh reset;
- the public deployment succeeds in fresh sessions at the three target viewport sizes;
- keyboard-only completion and live announcements pass without assistance;
- `npm ci && npm run check` passes from a clean clone;
- recorded video behavior matches the submitted release exactly;
- an adversarial review cannot make the agent self-approve, replay authority, use a stale tool, or produce a false green receipt;
- all public claims are supported by inspectable artifacts.

Further work after these conditions is ranked by defect severity and judging impact, not by novelty or implementation interest.
