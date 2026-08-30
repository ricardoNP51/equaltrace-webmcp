# EqualTrace

**Runtime protection parity for the agentic web.**

EqualTrace proves whether the same consequential action preserves the same disclosures, consent, feedback, reversibility, and recovery when performed through a visual UI, an assistive route, or a WebMCP agent.

> Same action. Same protections. Provable.

## Why this exists

WebMCP lets a live webpage expose structured tools to an agent in the same page and signed-in session a person uses. That creates a new failure class: an agent may reach the correct final state while silently bypassing protections present in the human interface.

EqualTrace records all three routes against one deterministic scenario, normalizes their semantic events, identifies the first protection divergence, stages a bounded repair for human approval, reruns the scenario, and exports a parity receipt.

The golden demonstration uses a fictional cloud-storage account deletion flow. No real account, data, payment, or external system is touched.

## Competition thesis

EqualTrace is not:

- a generic WCAG scanner;
- a WebMCP schema inspector;
- an agent benchmark that trusts the final answer;
- a static checklist;
- a chat wrapper.

It is a runtime verifier for a specific invariant:

> An agent must not be able to bypass a protection that constrains the equivalent human action.

See [product prioritization](docs/PRIORITIZATION.md), [winning standard](docs/WINNING_STANDARD.md), [architecture](docs/ARCHITECTURE.md), [roadmap](docs/ROADMAP.md), and [cross-PC handoff](docs/HANDOFF.md).

## Current repository scope

The complete challenge implementation is present on the release branch. It includes a static React/TypeScript/Vite application, pinned npm lockfile, deterministic domain, semantic trace ledger, fail-closed comparator, shared workbench store, native WebMCP spine, three real route captures, judge-first evidence UI, deterministic bounded repair, visible human-only approval, a temporary single-use repair capability, a fresh three-route repaired rerun, and a deterministic parity receipt.

It includes:

- the exact competition thesis and non-goals;
- the winner-critical priority order and feature admission test;
- the winning scorecard and eight non-negotiable gates;
- architecture, trace contracts, capability lifetime, and threat model;
- a deterministic account-deletion golden scenario specification;
- a dated implementation roadmap through submission;
- competitive positioning and Devpost checklist;
- a JSON Schema and independently verified fixture for the parity receipt;
- exact cross-PC continuation instructions.

Automated, local-native, and public-release evidence remain deliberately separate. Local native discovery, invocation, capability lifetime, repaired rerun, and receipt observations are recorded under `evidence/native/`; `evidence/native/manifest.json` is checked by the one-command gate.

## Live challenge build

- Public app: https://ricardonp51.github.io/equaltrace-webmcp/
- Release name: `challenge-v1.0.0`
- Exact deployed commit: shown in the application footer and release evidence.

The public URL is useful in ordinary browsers for the visual and keyboard routes. Native agent acceptance requires ChatGPT's in-app browser or a supported Chrome build with WebMCP enabled.

## Local verification

```bash
npm ci
npm run check
npm run dev
```

`npm run check` includes formatting, lint, strict type checking, targeted authority coverage thresholds, production build, Playwright pointer/keyboard/responsive/accessibility/adversarial journeys, independent receipt verification, and native-evidence manifest verification.

## Native WebMCP judge path

Open the public app in ChatGPT's built-in browser or a supported Chrome build with WebMCP enabled. Four stable tools are present:

- `equaltrace_get_status`
- `equaltrace_run_agent_route`
- `equaltrace_run_audit`
- `equaltrace_stage_repair`

The consequential `equaltrace_apply_approved_repair` tool is intentionally absent. Complete both human routes, invoke the native broken agent route and audit, then stage the bounded repair. Only the visible `Approve this exact repair` control can grant authority. After that exact approval, refresh the agent's tool surface: the fifth tool appears, applies once, and disappears. Begin the fresh repaired rerun, complete both human routes again, invoke the repaired agent route and audit, and inspect the six-assertion receipt.

No fixture, injected port, Playwright test, or UI status is presented as native discovery evidence. The native-evidence policy and limitations are documented in [`evidence/README.md`](evidence/README.md).

## Primary references

- [OpenAI site tools documentation](https://learn.chatgpt.com/docs/webmcp)
- [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/)
- [WebMCP Challenge](https://webmcp.devpost.com/)
- [Official challenge rules](https://webmcp.devpost.com/rules)

## License

MIT
