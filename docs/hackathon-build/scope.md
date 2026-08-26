# Project Scope

## Project Name Candidates

- **EqualTrace** — confirmed existing project name. Do not spend challenge time renaming it.

## One-Line Summary

EqualTrace proves when a WebMCP agent reaches the correct consequential outcome while bypassing protections that constrained the equivalent human action, then supports a human-authorized repair and proves parity on rerun.

## Target User

### Primary

Product, frontend, and platform teams adding consequential WebMCP tools who need release evidence that agent routes preserve the protections of equivalent human and assistive routes.

### Secondary

- Application-security and quality reviewers assessing agent-facing capability boundaries.
- Accessibility specialists verifying that protections are semantic rather than merely visual.
- WebMCP implementers and standards contributors looking for a concrete protection-parity evaluation pattern.

The challenge experience optimizes for a judge acting as a product or security reviewer. It is not a general-purpose end-user product.

## Problem

Outcome-only tests can report success even when an agent bypasses disclosures, consent, completion feedback, reversibility, or recovery that constrain a human performing the same consequential action. That creates a false green: the resulting state is correct, but the path is less safe and less accountable.

Existing tool inspectors, schema evaluators, approval demos, and accessibility scanners can validate adjacent concerns. EqualTrace owns the narrower missing question:

> Did the agent bypass a protection that constrained the equivalent human or assistive action, where did the bypass begin, and is the repair proven across every route?

## Core Workflow

1. Reset one fictional cloud-account deletion scenario to a deterministic seed.
2. Complete deletion through the visual human route.
3. Complete deletion through the keyboard/assistive route.
4. Complete the equivalent deletion through a native WebMCP tool.
5. Record ordered semantic events from all three real interactions through one domain engine.
6. Compare outcome, disclosure, consent, feedback, reversibility, and recovery by semantic checkpoint.
7. Stop on and explain the earliest protection divergence with exact trace evidence.
8. Let the agent stage a bounded repair without authority to approve or apply it.
9. Require visible human approval of the exact repair digest and expiry.
10. Register a narrow, single-use WebMCP commit capability only after approval; remove it after use, expiry, reset, revocation, or drift.
11. Rerun all three routes from the same seed.
12. Export a deterministic receipt in which every green assertion points to recorded evidence.

## What We Are Building

- A local-first React and TypeScript workbench with a committed lockfile and one-command quality gate.
- A deterministic fictional account-deletion domain engine shared by all routes.
- Native `document.modelContext.registerTool(...)` registration for the critical agent path.
- Stable read/audit tools and an intentionally broken agent action that demonstrates the bypass safely.
- A pointer-driven visual route and a complete keyboard/assistive route with visible focus and live announcements.
- A semantic trace ledger with stable event identifiers and explicit evidence text.
- A protection-parity comparator that reports the first divergence, not only the final verdict.
- A bounded repair proposal and a human-only approval boundary.
- A dynamic, exact, expiring, single-use repair capability with fail-closed invalidation.
- A real repaired rerun and canonical parity receipt with deterministic hash.
- A forensic-premium judge mode that makes the failure understandable in the opening twenty seconds.
- Automated unit, lifecycle, integration, browser, accessibility, determinism, adversarial, and clean-clone checks.
- A public deployment, public MIT repository, English testing instructions, and a narrated public YouTube demo under three minutes.

## What We Are Not Building

- **A second consequential scenario:** it weakens reliability and judge clarity before the golden path is complete.
- **External website scanning or crawling:** it introduces permission, variability, CORS, authentication, and evidence-integrity problems.
- **Automatic patching of third-party applications:** the challenge build repairs its own deterministic capability surface only.
- **Real deletion, payment, healthcare, or production credentials:** no real destructive action is required to prove the failure class.
- **Backend, accounts, database, tenancy, or billing:** none strengthen the winning chain.
- **External model APIs or a generic chatbot:** WebMCP interaction, not a prompt wrapper, is the product.
- **Multi-agent orchestration:** it adds spectacle without strengthening protection parity.
- **General WCAG, security, or legal certification:** EqualTrace proves named invariants for the demonstrated workflow only.
- **Fixture marketplace, plugin system, generalized policy language, or CI platform:** these are post-challenge productization.
- **Rich analytics beyond first divergence and receipt evidence:** additional dashboards are deferred unless every P0/P1 gate already passes.

No cut feature returns merely because implementation finishes early. It must pass the feature-admission test and be more valuable than the highest-severity remaining P0/P1 defect.

## Inspiration And References

- Evaluation labs: borrow reproducible evidence, explicit contracts, and test rigor.
- Consent and capability demos: borrow narrow, visible, short-lived authority boundaries.
- Dramatic human-agent experiences: borrow immediate conflict and a memorable before/after arc.
- Accessibility semantics: treat protection equivalence as meaning and sequence, not DOM position or visual similarity.
- Forensic tools: use dense evidence only after an immediate, plain-language verdict.

EqualTrace does not copy an existing evaluator or authorization demo. Its differentiated unit is the complete chain from three real routes through first divergence, human-authorized repair, rerun, and receipt.

## Time Budget And Scope Ruler

- Build window: 2026-08-26 through the internal freeze on 2026-09-02 at 18:00 Bolivia.
- Official deadline: 2026-09-03 at 16:00 Bolivia; the gap is contingency only.
- Working assumption: Codex progresses autonomously on safe implementation work; participant attention is reserved for native browser validation, deployment/account actions, final visual judgment, video publication, and submission confirmation.
- Calendar rule: protect the final two days for native repetition, accessibility, adversarial review, clean-clone validation, video, and submission materials.
- Dependency rule: always work on the earliest incomplete phase; later polish cannot compensate for a missing native or authority gate.
- Kill rule: if native registration or teardown is unreliable, stop UI expansion and repair the native spine.

## Demo Path

| Time | Judge sees |
| ---: | --- |
| 0:00–0:20 | The agent deleted instantly while the human received four visible protections. |
| 0:20–0:55 | The same seeded action runs through visual, assistive, and native WebMCP routes. |
| 0:55–1:20 | EqualTrace identifies the earliest missing disclosure/consent checkpoint and links it to trace evidence. |
| 1:20–1:50 | The agent stages a bounded repair; a person approves the exact digest and expiry. |
| 1:50–2:20 | A one-use repair capability appears, executes against the shared surface, and disappears. |
| 2:20–2:45 | All three routes rerun green and produce a deterministic parity receipt. |
| 2:45–2:58 | Closing claim: “Same action. Same protections. Provable.” |

## Submission Story

WebMCP lets agents act directly instead of guessing through an interface, but direct action can silently remove protections that were built into the human journey. EqualTrace demonstrates that a correct outcome is not sufficient evidence of an equivalent or safe path. It captures three real routes, identifies the first semantic protection bypass, preserves human authority over repair, and proves the correction through a native rerun and deterministic receipt.

The build targets all four official judging criteria through one coherent artifact:

- **WebMCP Leverage:** native discovery, invocation, shared live state, and dynamic capability lifetime are central rather than decorative.
- **Execution:** one polished, deterministic, accessible, publicly runnable golden path.
- **Potential Impact:** a concrete release risk for teams exposing consequential agent tools.
- **Creativity & Ambition:** protection parity across human, assistive, and agent routes with evidence-backed repair.
