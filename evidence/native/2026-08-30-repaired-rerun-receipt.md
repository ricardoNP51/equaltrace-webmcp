# Native repaired rerun and parity receipt

Date: 2026-08-30 (America/La_Paz)

## Environment

- Client: Codex desktop in-app browser (browser-control package `26.825.41651`).
- Origin: `http://127.0.0.1:5173/`.
- Branch: `codex/phase6-continuation`.
- Exact implementation content: commit `25c4276f730b981355d7e70c220dbff22abc3c59`.
- Native surface: browser-provided `document.modelContext`; no polyfill or injected registry.

## Observed native sequence

1. Fresh load discovered the four stable EqualTrace tools.
2. Pointer and keyboard routes each recorded 7 protected events from seed `equaltrace-golden-01`.
3. Native `equaltrace_run_agent_route` recorded the broken three-event agent trace and `equaltrace_run_audit` returned `fail`, `outcomeParity: true`, first divergence `agent / disclosure.consequences`, and `receiptId: null`.
4. Native staging produced `repair-1.0.0-disclosure.consequences` with digest `5cd22df014d91689792f353f02db08bcc05fd83de24c8f2d6ef5327de785a18a`.
5. Visible human approval caused a fresh agent-side tool fetch to show exactly five tools, including only `equaltrace_apply_approved_repair` as the consequential capability.
6. One native apply returned `policy: repaired-agent` and `capability: removed_after_use`; the next advertised surface returned to the four stable tools.
7. `Begin fresh repaired rerun` cleared every baseline route, preserved the applied repair identity, and recreated pointer and keyboard evidence from the original fixture and seed.
8. Native `equaltrace_run_agent_route` then recorded 7 fresh repaired agent events, including disclosure and exact consent before commitment.
9. Native `equaltrace_run_audit` returned `pass`, `outcomeParity: true`, `firstDivergence: null`, and receipt ID `80d69ae946fc941d2f4192f5cfbda980eefa9612124f68c45e11c6a54de6650b`.
10. The visible receipt showed PASS, 6/6 semantic assertions, outcome parity, and 18 links covering every assertion across all three fresh routes. Native status independently reported phase `verified`, all routes complete, comparison `pass`, capability absent after use, and the same receipt ID.
11. A second equivalent repaired rerun cleared and recreated all three routes again. Its native audit returned the identical receipt ID `80d69ae946fc941d2f4192f5cfbda980eefa9612124f68c45e11c6a54de6650b`.

## Automated corroboration

- `npm run check` passed 66 Vitest tests across 14 files, production build, 9 Playwright journeys, and the independent Node receipt verifier.
- Receipt tests compare equivalent canonical bytes and hashes, mutate scenario, repair, route, evidence, assertion, outcome, and verdict classes, and reject incomplete, failed, or independently regressed evidence.
- The browser journey proves old evidence is cleared, the repaired WebMCP trace is fresh, and the audit tool returns the issued receipt identity.
- Download-failure coverage forces object-URL creation to fail and confirms the verified receipt remains visible and retryable.
- `node scripts/verify-receipt.mjs` independently verified committed fixture identity `30196aeec258f531340ba675f3545536394d7088bc870e56afb01de373451f42`.

## Limits

- This is local native evidence, not public HTTPS release evidence.
- Two equivalent native repaired reruns were completed here; the required five consecutive public release runs remain item 11.
- The clean-clone `npm ci && npm run check` gate remains item 10.
