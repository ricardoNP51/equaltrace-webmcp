# Architecture

## Product boundary

The competition build is a deterministic, local-first web application. It does not require an external model API, backend, database, user account, or real destructive action.

WebMCP is the agent-facing control surface. React is the human-facing control surface. Both call the same domain commands.

## System shape

```text
Human UI ───────────────┐
Keyboard/assistive UI ──┼──> Domain commands ──> Scenario state
WebMCP tools ───────────┘          │
                                  ├──> Semantic trace ledger
                                  ├──> Parity comparator
                                  └──> Receipt exporter
```

## Core modules

| Module | Responsibility |
| --- | --- |
| `src/core/types.ts` | Stable domain and evidence contracts |
| `src/core/compare.ts` | Normalization and first-divergence verdict |
| `src/core/receipt.ts` | Canonical, hashable parity receipt |
| `src/fixtures/accountDeletion.ts` | Broken/repaired deterministic golden traces |
| `src/state/workbench.ts` | Approval and run lifecycle |
| `src/webmcp/register.ts` | Stable tools and dynamic commit capability |
| `src/App.tsx` | Shared judge-facing workbench |

## Protection invariants

1. **Outcome** — equivalent requested outcome and resulting state.
2. **Disclosure** — consequences are provided before commitment.
3. **Consent** — explicit approval binds to the exact consequential action.
4. **Feedback** — completion and current state are perceivable.
5. **Reversibility** — equivalent undo, delay, or cancellation is available.
6. **Recovery** — errors expose an actionable path back to a safe state.

An invariant is not a generic boolean. Every assertion must include route, sequence, source, semantic event, and evidence text.

## Dynamic capability contract

`equaltrace_apply_approved_repair` is a consequential tool.

- It is not registered during initial load.
- Visible human approval binds `repairId`, `repairDigest`, and expiry.
- Registration receives an `AbortSignal`.
- Execution revalidates approval, digest, expiry, and single-use status.
- Execution aborts registration immediately after a successful commit.
- Reset, revocation, expiry, or modified repair content also abort registration.

This follows the current WebMCP draft registration lifetime mechanism. There is no invented `requestUserInteraction` API.

## Evidence model

Every route produces ordered `TraceEvent` records. The comparator aligns them by semantic checkpoint, not by DOM selector, cursor coordinate, prose similarity, or elapsed time.

The first mismatch becomes a `Divergence` containing:

- expected and observed assertions;
- exact route;
- trace event IDs;
- severity and invariant;
- human-readable explanation;
- bounded recommended repair.

## Security boundaries

- Inputs are schema-validated and runtime-validated.
- Tool names and descriptions contain no untrusted scenario content.
- Read-only tools declare `readOnlyHint`.
- Outputs that could contain fixture/user text declare `untrustedContentHint`.
- Consequential tools are narrow, exact, expiring, and single-use.
- No tool can approve its own action.

See `docs/THREAT_MODEL.md`.
