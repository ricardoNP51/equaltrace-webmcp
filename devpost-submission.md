# EqualTrace — Devpost handoff draft

Status: **ready for `$prepare-submission`; not submitted**

Official requirements snapshot: The WebMCP Challenge submission requirements, judging criteria, dates, and latest announcement fetched from Devpost on 2026-08-30. Submissions close 2026-09-03 at 20:00 UTC / 16:00 America/La_Paz.

## Project identity

- **Name:** EqualTrace
- **Tagline:** The agent succeeded. The safety contract failed.
- **Live app:** https://ricardonp51.github.io/equaltrace-webmcp/
- **Public repository:** https://github.com/ricardoNP51/equaltrace-webmcp
- **License:** MIT
- **Release:** `challenge-v1.0.0`
- **Deployed application commit:** `20ccacc499fcb8f7fed126f10af38e820c95b335`
- **Native release receipt:** `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`
- **Demo video URL:** TODO — upload the final narrated cut publicly to YouTube before submission.
- **Built with:** TypeScript, React, Vite, WebMCP, Web Crypto, Playwright, Vitest, axe-core, GitHub Actions, GitHub Pages, OpenAI Codex

## Project description

### The problem

WebMCP lets an agent call structured tools directly from a live website. That can be dramatically more reliable than guessing through a visual interface—but it introduces a new release risk. An agent can reach the correct final state while silently bypassing disclosures, exact consent, completion feedback, reversibility, or recovery protections that constrained a person performing the same consequential action.

Outcome-only testing calls that a success. EqualTrace calls it a protection failure.

### What EqualTrace does

EqualTrace is a runtime protection-parity workbench for agent-operable websites. It runs one deterministic fictional account-deletion action through three genuine routes:

1. a visual pointer journey;
2. a keyboard/assistive journey;
3. a native WebMCP agent invocation.

All three routes use the same scenario, seed, domain commands, requested outcome, and semantic trace model. EqualTrace compares outcome, disclosure, consent, feedback, reversibility, and recovery in their required order. The baseline intentionally reaches `deleted` on all three routes, but fails at the first missing agent checkpoint: `disclosure.consequences`.

The agent can then stage one bounded repair, but it cannot approve or apply it. A person must inspect and approve the exact action, checkpoint, digest, seed, and expiry through the visible interface. Only then does `equaltrace_apply_approved_repair` appear on the native WebMCP surface. It is bound to that authority, executes once, and disappears immediately after use or any invalidating transition.

EqualTrace clears the baseline traces, reruns all three routes, and issues a deterministic SHA-256 parity receipt only when the same outcome and all six protection groups pass on fresh evidence.

### Why WebMCP is fundamental

The central failure and the central proof exist on the real capability surface. EqualTrace does not merely display tool metadata. Native discovery and invocation update the same visible state used by people, while dynamic registration makes authority observable: four stable tools exist before approval, a fifth exact tool appears after human approval, and it disappears after one attempt.

Without WebMCP, EqualTrace could not demonstrate the difference between interface protections and agent-call protections, nor prove that authorization changes the agent's available capabilities rather than a decorative status label.

### Better human-agent collaboration

Before EqualTrace, a team could separately test a UI, accessibility, and an API call yet still miss that the agent path skipped a protection. EqualTrace lets the agent diagnose and prepare a narrow repair, keeps the consequential decision with a person, and lets the agent execute only the approved change. Both then share a portable receipt showing exactly what passed.

This pattern can extend to account management, privacy controls, commerce, healthcare, finance, and other consequential actions where a correct outcome is not enough evidence of a safe path.

### Implementation

EqualTrace is a static React and strict TypeScript application with no backend, database, account, secret, or model API. `document.modelContext.registerTool` exposes four constant, bounded stable tools. An AbortSignal-bound lifecycle manager dynamically registers the single-use repair tool only after exact visible approval.

Every route executes isolated run contexts from one immutable fixture and shared domain engine. Deterministic trace IDs feed a pure fail-closed comparator. Canonical JSON and Web Crypto produce the repair digest and receipt identity. Automated tests use a separate injected fake port and are always labelled simulated; native claims come only from a supported client's browser-provided WebMCP surface.

The one-command gate runs formatting, lint, strict type checking, 66 unit/integration/component tests with authority coverage thresholds, production build, 12 Playwright journeys, axe checks, receipt verification, and native-evidence manifest verification. The exact public release also completed five consecutive native golden runs from fresh resets with the same receipt.

### What we learned

The hardest part was not registering a tool; it was defining what equivalent protection means across fundamentally different interaction modes. The implementation needed semantic checkpoints rather than screen similarity, fail-closed evidence rules rather than optimistic status flags, and authority bound to exact state rather than a claimed actor identity.

We also learned to keep semantic receipt identity separate from volatile browser and time metadata, while preserving native environment evidence in a separate auditable manifest.

### Limitations and next steps

The challenge release deliberately proves one fictional account-deletion scenario. It is not a universal safety certification, general WCAG scanner, or external-site crawler. Public native release evidence covers the named Codex In-app Browser version; other WebMCP clients require their own validation.

After the challenge, the same model could support additional invariant packs, fixture authoring, CI regression runs against deployed WebMCP sites, and team evidence retention.

## Exact judge testing instructions

No credentials are required. Use ChatGPT's desktop in-app browser or Chrome 149+ with WebMCP testing enabled.

1. Open https://ricardonp51.github.io/equaltrace-webmcp/ and confirm the footer shows `challenge-v1.0.0 · commit 20ccacc499fc`.
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

## Required submission-field answers

| Devpost field           | Draft answer                                                                                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Submitter Type          | Individual                                                                                                                                                                                                                                                   |
| Country of residence    | Bolivia                                                                                                                                                                                                                                                      |
| Organization            | Not applicable                                                                                                                                                                                                                                               |
| App Status              | New                                                                                                                                                                                                                                                          |
| Existing-project update | Not applicable. First repository commit was 2026-08-26, after submissions opened on 2026-08-25.                                                                                                                                                              |
| Live URL                | https://ricardonp51.github.io/equaltrace-webmcp/                                                                                                                                                                                                             |
| Testing instructions    | Use the exact judge instructions above; no credentials required.                                                                                                                                                                                             |
| Public code repository  | https://github.com/ricardoNP51/equaltrace-webmcp                                                                                                                                                                                                             |
| Tested agents/clients   | Codex In-app Browser / ChatGPT desktop WebMCP client, plugin version `26.825.41651`. Five consecutive public native runs were recorded. Automated Playwright runs use an isolated simulated port and are not claimed as native evidence.                     |
| AI tools leveraged      | OpenAI Codex assisted with product planning, implementation, testing, adversarial review, debugging, native browser validation, documentation, and submission preparation. The running product calls no model API and all automated gates are deterministic. |
| Learning derived        | Significant                                                                                                                                                                                                                                                  |
| AI career value         | Yes                                                                                                                                                                                                                                                          |

Confirm the personal field answers during `$prepare-submission`; do not silently change them during submission.

## Judging-criteria map

| Official criterion    | Strongest visible proof                                                                                | Reproducible artifact                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| WebMCP Leverage       | Native shared state plus an approval-bound tool that is absent, appears, executes once, and disappears | `src/webmcp/`, public five-run evidence, demo beats 0:35–1:55              |
| Execution             | Coherent public broken-to-repaired journey, keyboard path, responsive UI, CI and clean clone           | live URL, `npm run check`, release tag, screenshots                        |
| Potential Impact      | Concrete protection-bypass risk for consequential agent actions                                        | first-divergence panel, six semantic invariant groups, project description |
| Creativity & Ambition | Three-route semantic parity, human-authorized repair, fresh rerun, deterministic receipt               | trace ledger, repair center, receipt, evidence manifest                    |

## Evidence and media

- Screenshot index: `evidence/submission/README.md`
- Native public release proof: `evidence/native/2026-08-30-public-release-five-run.md`
- Machine-readable native manifest: `evidence/native/manifest.json`
- Verified sample receipt: `tests/fixtures/parity-receipt.json` (automated deterministic fixture, not the public native run)
- Public native receipt identity: `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`
- Recording-ready script: `docs/DEMO_SCRIPT.md`

## Remaining external gate

Record the script against the exact public release, verify a duration below 3:00 and clear narration, upload it publicly to YouTube, then replace the TODO video URL. No project has been created, updated, or submitted on Devpost by this document.
