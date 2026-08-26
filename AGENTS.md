# EqualTrace agent instructions

EqualTrace is a competition build, not a generic accessibility dashboard.

Before changing code:

1. Read `docs/STATUS.md`, `docs/PRIORITIZATION.md`, `docs/WINNING_STANDARD.md`, and `docs/ARCHITECTURE.md`.
2. Inspect `git status --short --branch` and preserve unrelated user changes.
3. Keep the golden scenario deterministic and runnable without external APIs.
4. Never claim native WebMCP validation from a polyfill, simulator, unit test, or mocked registry.
5. A consequential WebMCP capability must be absent before visible human approval and removed after use, expiry, reset, or changed intent.
6. Keep human, assistive, and agent routes on the same domain engine and seed.
7. Update `docs/STATUS.md` and `docs/HANDOFF.md` whenever a gate changes.
8. During documentation-only Phase 0, do not scaffold or implement the application unless the user explicitly starts Phase 1 on the continuation PC.
9. After implementation begins, define and run a one-command quality gate before each commit. Run native browser validation separately when the environment supports it.
10. Apply the feature admission test in `docs/PRIORITIZATION.md`; P2 work cannot begin while P0 or judge-path P1 work is incomplete.

The product thesis is fixed unless evidence forces a documented ADR:

> The same consequential action must preserve the same protections for a human, an assistive route, and a WebMCP agent.
