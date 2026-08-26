# Threat model

## Assets

- Human intent and approval.
- Exact repair content and digest.
- Route trace integrity.
- Parity verdict and receipt.
- Dynamic capability lifetime.

## Primary threats

| Threat | Failure | Required mitigation |
| --- | --- | --- |
| Self-approval | Agent authorizes its own consequential action | Approval exists only in visible human UI state; no approval tool |
| Approval drift | Approved content changes before commit | Bind approval to a deterministic repair digest and reject mismatch |
| Replay | Old authorization is reused | One-use nonce, expiry, consumed flag, and registration abort |
| Stale capability | Tool remains after reset/revoke | One controller owns registration; every invalidation path aborts it |
| Route fabrication | UI displays a trace that was never executed | Runtime recorder emits events; fixture mode is labelled and excluded from native evidence |
| Outcome-only success | Agent reaches final state while skipping protections | Compare disclosure, consent, feedback, reversibility, and recovery in addition to outcome |
| Prompt injection | Tool output steers the agent | Minimal structured outputs and `untrustedContentHint` where fixture/user text can appear |
| Schema bypass | Malformed input reaches domain commands | Closed schemas plus runtime checks at executor boundary |
| Evidence overclaim | Mock/polyfill is represented as native | Separate evidence labels and explicit native release gate |

## Out of scope for the challenge build

- Real destructive account operations.
- Production authentication or multi-tenant isolation.
- Legal certification or a claim of WCAG conformance.
- Automatic modification of third-party websites.
- General-purpose security scanning.
