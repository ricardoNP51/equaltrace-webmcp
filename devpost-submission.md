# EqualTrace

Status: **Devpost-ready draft; not submitted**

Official requirements snapshot: The WebMCP Challenge submission requirements, judging criteria, dates, and latest announcement fetched from Devpost on 2026-08-30. Submissions close 2026-09-03 at 20:00 UTC / 16:00 America/La_Paz.

## One-line Summary

EqualTrace detects when a WebMCP agent reaches the correct outcome while bypassing protections that constrain the equivalent human action, then supports one human-authorized repair and proves protection parity on a fresh rerun.

## Project Identity

- **Name:** EqualTrace
- **Tagline:** The agent succeeded. The safety contract failed.
- **Live app:** https://ricardonp51.github.io/equaltrace-webmcp/
- **Public repository:** https://github.com/ricardoNP51/equaltrace-webmcp
- **License:** MIT
- **Release:** `challenge-v1.0.0`
- **Deployed application commit:** `936146e8a0e18c1c3b1130f48528444cb88bf00f`
- **Native release receipt:** `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`
- **Demo video URL:** https://youtu.be/IqdVB8k5CNA
- **Built with:** TypeScript, React, Vite, WebMCP, Web Crypto, Playwright, Vitest, axe-core, GitHub Actions, GitHub Pages, OpenAI Codex

## Problem

WebMCP lets an agent call structured tools directly from a live website. That can be dramatically more reliable than guessing through a visual interface—but it introduces a new release risk. An agent can reach the correct final state while silently bypassing disclosures, exact consent, completion feedback, reversibility, or recovery protections that constrained a person performing the same consequential action.

Outcome-only testing calls that a success. EqualTrace calls it a protection failure.

## Solution

EqualTrace is a runtime protection-parity workbench for agent-operable websites. It runs one deterministic fictional account-deletion action through three genuine routes:

1. a visual pointer journey;
2. a keyboard/assistive journey;
3. a native WebMCP agent invocation.

All three routes use the same scenario, seed, domain commands, requested outcome, and semantic trace model. EqualTrace compares outcome, disclosure, consent, feedback, reversibility, and recovery in their required order. The baseline intentionally reaches `deleted` on all three routes, but fails at the first missing agent checkpoint: `disclosure.consequences`.

The agent can then stage one bounded repair, but it cannot approve or apply it. A person must inspect and approve the exact action, checkpoint, digest, seed, and expiry through the visible interface. Only then does `equaltrace_apply_approved_repair` appear on the native WebMCP surface. It is bound to that authority, executes once, and disappears immediately after use or any invalidating transition.

EqualTrace clears the baseline traces, reruns all three routes, and issues a deterministic SHA-256 parity receipt only when the same outcome and all six protection groups pass on fresh evidence.

## Why This Matters

The central failure and the central proof exist on the real capability surface. EqualTrace does not merely display tool metadata. Native discovery and invocation update the same visible state used by people, while dynamic registration makes authority observable: four stable tools exist before approval, a fifth exact tool appears after human approval, and it disappears after one attempt.

Without WebMCP, EqualTrace could not demonstrate the difference between interface protections and agent-call protections, nor prove that authorization changes the agent's available capabilities rather than a decorative status label.

### Better human-agent collaboration

Before EqualTrace, a team could separately test a UI, accessibility, and an API call yet still miss that the agent path skipped a protection. EqualTrace lets the agent diagnose and prepare a narrow repair, keeps the consequential decision with a person, and lets the agent execute only the approved change. Both then share a portable receipt showing exactly what passed.

This pattern can extend to account management, privacy controls, commerce, healthcare, finance, and other consequential actions where a correct outcome is not enough evidence of a safe path.

## Architecture

EqualTrace is a static React and strict TypeScript application with no backend, database, account, secret, or model API. `document.modelContext.registerTool` exposes four constant, bounded stable tools. An AbortSignal-bound lifecycle manager dynamically registers the single-use repair tool only after exact visible approval.

Every route executes isolated run contexts from one immutable fixture and shared domain engine. Deterministic trace IDs feed a pure fail-closed comparator. Canonical JSON and Web Crypto produce the repair digest and receipt identity. Automated tests use a separate injected fake port and are always labelled simulated; native claims come only from a supported client's browser-provided WebMCP surface.

The one-command gate runs formatting, lint, strict type checking, 66 unit/integration/component tests with authority coverage thresholds, production build, 12 Playwright journeys, axe checks, receipt verification, and native-evidence manifest verification. The exact public release also completed five consecutive native golden runs from fresh resets with the same receipt.

## What We Learned

The hardest part was not registering a tool; it was defining what equivalent protection means across fundamentally different interaction modes. The implementation needed semantic checkpoints rather than screen similarity, fail-closed evidence rules rather than optimistic status flags, and authority bound to exact state rather than a claimed actor identity.

We also learned to keep semantic receipt identity separate from volatile browser and time metadata, while preserving native environment evidence in a separate auditable manifest.

## How We Used AI

The demonstrated agent operates the live public page through native WebMCP tools. OpenAI Codex assisted with product planning, implementation, test design, adversarial review, accessibility checks, debugging, native browser validation, video production, and submission preparation. The running product calls no model API: its scenario, comparator, repair authority, and receipts are deterministic and reproducible without an external service.

## How We Used Codex

Codex helped turn the product thesis into a strict TypeScript implementation, build the shared three-route domain engine, test fail-closed authority boundaries, inspect the real browser-provided WebMCP surface, and produce auditable release evidence. Throughout the project, simulated Playwright and Vitest evidence remained explicitly separate from native supported-client observations.

## Key Features

- One deterministic consequential action exercised through visual, keyboard/assistive, and native WebMCP routes.
- Six ordered protection groups: outcome, disclosure, consent, feedback, reversibility, and recovery.
- First-divergence diagnosis even when every route reaches the same final outcome.
- Exact visible human approval before a consequential repair capability can exist.
- Observable native capability lifecycle: four stable tools, one temporary approved tool, then four again (`4 → 5 → 4`).
- Fresh repaired rerun with all three routes at 6/6 and a deterministic SHA-256 receipt.
- Responsive static deployment with no backend, account, secret, external API, or model dependency.

## Known Limitations

The challenge release deliberately proves one fictional account-deletion scenario. It is not a universal safety certification, general WCAG scanner, or external-site crawler. Public native release evidence covers the named Codex In-app Browser version; other WebMCP clients require their own validation.

After the challenge, the same model could support additional invariant packs, fixture authoring, CI regression runs against deployed WebMCP sites, and team evidence retention.

## Public Demo Link

https://ricardonp51.github.io/equaltrace-webmcp/

## Public Repository Link

https://github.com/ricardoNP51/equaltrace-webmcp

## Demo Video

https://youtu.be/IqdVB8k5CNA

Verified anonymously on 2026-08-30: the uppercase-`I` video ID resolves with playback status `OK`, is publicly accessible as unlisted, runs for approximately 80 seconds, and its description links to the live application and repository. The lowercase-`l` variant does not resolve.

## Testing Instructions

No credentials are required. Use ChatGPT's desktop in-app browser or Chrome 149+ with WebMCP testing enabled.

1. Open https://ricardonp51.github.io/equaltrace-webmcp/ and confirm the footer shows `challenge-v1.0.0 · commit 936146e8a0e1`.
2. Click **Reset and begin baseline**.
3. Complete **Visual route** with pointer activation: review consequences, give exact consent, then delete the fictional account.
4. Complete **Assistive route** with keyboard activation: focus its review button and press Enter through review, consent, and delete.
5. Invoke `equaltrace_run_agent_route` with scenario `fictional-cloud-account-deletion`, version `1.0.0`, and seed `equaltrace-golden-01`.
6. Invoke `equaltrace_run_audit`. Confirm all routes reached `deleted`, but parity failed first at `agent / disclosure.consequences`.
7. Confirm `equaltrace_apply_approved_repair` is absent, then invoke `equaltrace_stage_repair`.
8. Review the exact proposal in the page and click **Approve this exact repair**.
9. Refresh native tool discovery. Invoke the newly present `equaltrace_apply_approved_repair` with the staged repair ID and digest. Refresh again and confirm the tool disappeared.
10. Click **Begin fresh repaired rerun**, repeat both human routes, invoke the agent route, then invoke the audit.
11. Confirm all three fresh routes show 6/6 protections, outcome parity passes, and receipt `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` appears.

## TODO Official Form Fields

Devpost currently requests the fields below and does not request a Codex session ID. The proposed personal answers must still be confirmed by the participant before submission.

| Devpost field           | Draft answer                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Submitter Type          | Individual                                                                                                                                                                                                                                                                                                    |
| Country of residence    | Bolivia                                                                                                                                                                                                                                                                                                       |
| Organization            | Not applicable                                                                                                                                                                                                                                                                                                |
| App Status              | New                                                                                                                                                                                                                                                                                                           |
| Existing-project update | Not applicable. First repository commit was 2026-08-26, after submissions opened on 2026-08-25.                                                                                                                                                                                                               |
| Live URL                | https://ricardonp51.github.io/equaltrace-webmcp/                                                                                                                                                                                                                                                              |
| Testing instructions    | Use the exact judge instructions above; no credentials required.                                                                                                                                                                                                                                              |
| Public code repository  | https://github.com/ricardoNP51/equaltrace-webmcp                                                                                                                                                                                                                                                              |
| Tested agents/clients   | Codex In-app Browser / ChatGPT desktop WebMCP client. Five consecutive native runs were recorded with plugin `26.825.41651`; the redesigned public release was freshly validated with plugin `26.825.51511`. Automated Playwright runs use an isolated simulated port and are not claimed as native evidence. |
| AI tools leveraged      | OpenAI Codex assisted with product planning, implementation, testing, adversarial review, debugging, native browser validation, documentation, and submission preparation. The running product calls no model API and all automated gates are deterministic.                                                  |
| Learning derived        | Significant                                                                                                                                                                                                                                                                                                   |
| AI career value         | Yes                                                                                                                                                                                                                                                                                                           |

Confirm the personal field answers during `$prepare-submission`; do not silently change them during submission.

## Judging-criteria map

| Official criterion    | Strongest visible proof                                                                                | Reproducible artifact                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| WebMCP Leverage       | Native shared state plus an approval-bound tool that is absent, appears, executes once, and disappears | `src/webmcp/`, public five-run evidence, demo beats 0:35–1:55              |
| Execution             | Coherent public broken-to-repaired journey, keyboard path, responsive UI, CI and clean clone           | live URL, `npm run check`, release tag, screenshots                        |
| Potential Impact      | Concrete protection-bypass risk for consequential agent actions                                        | first-divergence panel, six semantic invariant groups, project description |
| Creativity & Ambition | Three-route semantic parity, human-authorized repair, fresh rerun, deterministic receipt               | trace ledger, repair center, receipt, evidence manifest                    |

## Screenshot Shot List

1. Opening thesis and scenario identity.
2. Baseline comparison showing `6/6 · 6/6 · 2/6`.
3. First divergence at `agent / disclosure.consequences`.
4. Visible exact human approval and the temporary `4 → 5 → 4` capability lifecycle.
5. Fresh repaired `6/6 · 6/6 · 6/6` result and deterministic receipt.

## Submission Readiness Notes

- Devpost authentication succeeds for `RicardoNP5 01`; registration for The WebMCP Challenge is confirmed and submissions are open.
- The official deadline is 2026-09-03 at 20:00 UTC / 16:00 America/La_Paz.
- The live application returns HTTP 200 anonymously and a fresh supported-client session discovers the four stable native tools without console warnings or errors.
- The GitHub repository is public, exposes the MIT license, and both exact-revision quality and Pages workflows succeeded for deployed commit `936146e8a0e18c1c3b1130f48528444cb88bf00f`.
- The YouTube video is anonymously playable at the exact uppercase-`I` URL and is under the official three-minute limit.
- No Devpost project has been created, updated, or submitted during preparation.

## Evidence and Media

- Screenshot index: `evidence/submission/README.md`
- Native public release proof: `evidence/native/2026-08-30-public-release-five-run.md`
- Redesigned public supported-client proof: `evidence/native/2026-08-31-forensic-ledger-public/`
- Machine-readable native manifest: `evidence/native/manifest.json`
- Verified sample receipt: `tests/fixtures/parity-receipt.json` (automated deterministic fixture, not the public native run)
- Public native receipt identity: `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`
- Recording-ready script: `docs/DEMO_SCRIPT.md`

## Remaining External Gate

Confirm the proposed personal fields (Individual, Bolivia, no organization, New, Significant learning, and Yes to AI career value), then give explicit authorization for the final Devpost submission step. No project has been created, updated, or submitted on Devpost by this document.
