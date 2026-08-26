# Winning standard

This document defines what “advanced enough to contend for a prize” means. It is deliberately stricter than “demo works on my machine.”

## Judge-facing thesis

EqualTrace proves a new invariant for the agentic web:

> A consequential action must preserve equivalent protections across visual, assistive, and WebMCP agent routes.

The demonstration must make the risk understandable in 20 seconds and the technical novelty undeniable in under three minutes.

## Target scorecard

| Official criterion | Target | Evidence required |
| --- | ---: | --- |
| WebMCP leverage | 9.7/10 | Native tools, live shared state, dynamic capability lifetime, visible agent actions |
| Execution | 9.1/10 | Coherent product, reliable reset, polished UI, no dead controls, clean public deployment |
| Potential impact | 9.2/10 | Concrete protection-bypass problem, credible users, transferable invariant model |
| Creativity and ambition | 9.2/10 | Three-route semantic parity, first divergence, human-approved repair, parity receipt |
| **Target** | **37.2/40** | No category below 9.0 |

These are internal planning targets, not predicted judge scores.

## Eight non-negotiable winner gates

1. **Native critical path** — the judge can discover and call real `document.modelContext` tools in a supported browser.
2. **One deterministic truth** — every route begins from the same seed and uses the same domain engine.
3. **Three actual routes** — visual, keyboard/assistive, and agent traces are produced by real interactions, not hand-authored labels.
4. **First divergence** — the UI identifies the earliest protection mismatch and links it to concrete evidence.
5. **Human authority** — the consequential repair capability is absent until a person approves the exact staged repair.
6. **Capability lifetime** — the approved tool disappears after use, expiry, reset, revocation, or changed repair content.
7. **Proof after repair** — EqualTrace reruns all routes and exports a deterministic parity receipt.
8. **Submission quality** — public URL, public source, license, clean setup, evidence, and a sub-three-minute narrated video.

If any of gates 1, 3, 5, or 7 fails, the project is not submission-ready. If two other gates fail, it is not winner-ready.

## Golden demo beats

| Time | Judge sees |
| ---: | --- |
| 0:00–0:20 | “The agent deleted instantly; the human received four protections.” |
| 0:20–0:55 | The same seeded action runs through three routes. |
| 0:55–1:20 | EqualTrace stops on the first divergence: missing disclosure/consent. |
| 1:20–1:50 | Agent stages a bounded repair; human approves the exact change. |
| 1:50–2:20 | A one-use commit capability appears, executes, and disappears. |
| 2:20–2:45 | All three routes rerun green and produce a parity receipt. |
| 2:45–2:58 | “Same action. Same protections. Provable.” |

## Things that would make the project look weak

- A dashboard that only displays prewritten pass/fail cards.
- A polyfill presented as native validation.
- An agent that only chats but cannot operate the page.
- A fake repair that changes display text but not the actual capability surface.
- Accessibility claims without keyboard and assistive evidence.
- An overbuilt multi-scenario product with an unreliable golden path.
- A long explanation before the judge sees the failure.
