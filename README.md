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

Phase 1 implementation is active. The repository now includes a static React/TypeScript/Vite application, pinned npm lockfile, deterministic domain, semantic trace ledger, fail-closed comparator, shared workbench store, native WebMCP spine, three real route captures, judge-first evidence UI, deterministic bounded repair, and a visible human-only approval boundary. The temporary single-use repair capability is the next implementation gate.

It includes:

- the exact competition thesis and non-goals;
- the winner-critical priority order and feature admission test;
- the winning scorecard and eight non-negotiable gates;
- architecture, trace contracts, capability lifetime, and threat model;
- a deterministic account-deletion golden scenario specification;
- a dated implementation roadmap through submission;
- competitive positioning and Devpost checklist;
- a JSON Schema for the future parity receipt;
- exact cross-PC continuation instructions.

Local native WebMCP discovery, invocation, and same-page three-route evidence are recorded under `evidence/native/`. Public release and dynamic capability-lifetime claims remain incomplete.

## Local verification

```bash
npm ci
npm run check
npm run dev
```

The current build is intentionally incomplete: it proves the broken three-route baseline and exact human authority boundary, but does not yet register or execute the consequential repair capability.

## Native WebMCP validation

The future implementation must be opened in ChatGPT's built-in browser or a supported Chrome build with WebMCP enabled. Its planned stable tools are:

- `equaltrace_get_status`
- `equaltrace_run_agent_route`
- `equaltrace_run_audit`
- `equaltrace_stage_repair`

The consequential `equaltrace_apply_approved_repair` tool must not exist until the human approves the exact repair in the visible UI. Its registration is owned by an `AbortController` and must disappear after use, expiry, reset, or changed intent.

## Primary references

- [OpenAI site tools documentation](https://learn.chatgpt.com/docs/webmcp)
- [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/)
- [WebMCP Challenge](https://webmcp.devpost.com/)
- [Official challenge rules](https://webmcp.devpost.com/rules)

## License

MIT
