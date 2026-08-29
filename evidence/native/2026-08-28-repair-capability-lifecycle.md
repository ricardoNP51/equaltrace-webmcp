# Native repair-capability lifecycle — 2026-08-28

## Classification

- Evidence class: **native local dynamic-capability proof**
- Polyfill installed on `document.modelContext`: **no**
- Simulated registry used for the observations below: **no**
- Automated simulated lifecycle evidence: separate Vitest and Playwright suites

## Environment

- Client: Codex desktop, Codex in-app browser
- Browser-control integration version: `26.825.32147`
- Host operating system: Microsoft Windows NT `10.0.26200.0`
- Origin: `http://127.0.0.1:5173`
- Page URL: `http://127.0.0.1:5173/`
- Tested implementation commit: `7fc5e8c99161d10f1fdc664dcf56ca1272cfd086`
- Observed at: `2026-08-28 21:56:40 -04:00` (`America/La_Paz`)

The native flow was exercised on the fully gated implementation working tree and committed without implementation changes as the hash above.

## Absence before authority

On a fresh deterministic reset, the client discovered exactly four stable page-defined tools:

1. `equaltrace_get_status`
2. `equaltrace_run_agent_route`
3. `equaltrace_run_audit`
4. `equaltrace_stage_repair`

`equaltrace_apply_approved_repair` was absent. The two human routes were then completed through primary pointer and keyboard-only interactions. Native `equaltrace_run_agent_route` returned `evidenceProvenance: "native"`, and native `equaltrace_run_audit` failed at `agent / disclosure.consequences` while confirming equal outcome.

Native `equaltrace_stage_repair` produced the exact proposal:

```json
{
  "repairId": "repair-1.0.0-disclosure.consequences",
  "repairDigest": "5cd22df014d91689792f353f02db08bcc05fd83de24c8f2d6ef5327de785a18a",
  "targetScenarioId": "fictional-cloud-account-deletion",
  "targetScenarioVersion": "1.0.0",
  "seed": "equaltrace-golden-01",
  "addsCheckpoints": ["disclosure.consequences"],
  "approvalEpoch": 1,
  "expiresAt": 1787968633732
}
```

The visible Repair Center still reported the consequential capability as absent.

## Appearance after exact visible approval

The visible `Approve this exact repair` control was activated. The page reported only that the native adapter accepted the registration and explicitly warned that UI state alone was not discovery proof.

The client then refreshed its native tool list and discovered exactly five tools. The only new tool was `equaltrace_apply_approved_repair`, with required `repairId` and `repairDigest`, bounded strings, and `additionalProperties: false`.

## Single use and removal

The client invoked the temporary tool with the exact visible identity and digest. Its material response was:

```json
{
  "status": "applied",
  "repairId": "repair-1.0.0-disclosure.consequences",
  "repairDigest": "5cd22df014d91689792f353f02db08bcc05fd83de24c8f2d6ef5327de785a18a",
  "policy": "repaired-agent",
  "capability": "removed_after_use"
}
```

Immediately afterward:

- the visible page entered `repair_applied` and stated that the repair was applied exactly once;
- the capability status returned to `absent` with removal-after-use guidance;
- a fresh native tool fetch returned only the original four stable tools;
- a replay through the pre-use tool handle failed because the WebMCP registration was stale.

## Automated companion proof

- `npm run check` passed on the implementation tree.
- Vitest passed 58 tests across 12 files.
- The dedicated lifecycle suite passed 14 cases covering pre-approval absence, exact registration, wrong digest, stale closure, one-use success, replay/concurrency, cancellation, expiry, reset, revocation, proposal edit, seed/scenario/intent drift, registration failure, and invalidation during pending registration.
- Playwright passed 9 journeys, including a simulated dynamic appearance/use/removal flow. That injected adapter is explicitly not the source of the native observations above.

## Limits and next proof

- This is one local native lifecycle run, not the five-run public release proof required by item 11.
- Automated tests prove reset, expiry, cancellation, registration failure, and drift teardown; this local native run directly proves the required absence, appearance, use, disappearance, and stale-handle rejection sequence.
- The repaired three-route rerun and deterministic receipt remain item 9 and cannot inherit a green verdict from policy application alone.
