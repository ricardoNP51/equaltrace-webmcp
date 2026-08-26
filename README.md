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

This is the documentation and planning repository for continuing the build on another PC. It intentionally contains no application implementation yet.

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

Implementation starts with Phase 1 in `docs/ROADMAP.md`. No native WebMCP claim has been made.

## Native WebMCP validation

The future implementation must be opened in ChatGPT's built-in browser or a supported Chrome build with WebMCP enabled. Its planned stable tools are:

- `equaltrace_get_scenario`
- `equaltrace_run_audit`
- `equaltrace_inspect_run`
- `equaltrace_prepare_repair`

The consequential `equaltrace_apply_approved_repair` tool must not exist until the human approves the exact repair in the visible UI. Its registration is owned by an `AbortController` and must disappear after use, expiry, reset, or changed intent.

## Primary references

- [OpenAI site tools documentation](https://learn.chatgpt.com/docs/webmcp)
- [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/)
- [WebMCP Challenge](https://webmcp.devpost.com/)
- [Official challenge rules](https://webmcp.devpost.com/rules)

## License

MIT
