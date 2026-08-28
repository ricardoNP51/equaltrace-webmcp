# Native three-route baseline — 2026-08-28

## Classification

- Evidence class: **native local three-route baseline**
- Polyfill installed on `document.modelContext`: **no**
- Simulated registry used for the native route or audit: **no**
- Consequential repair tool present: **no**

## Environment

- Client: ChatGPT desktop `26.825.32147`, Codex in-app browser
- Embedded browser framework: `151.0.7922.174`
- Origin: `http://127.0.0.1:5174`
- Tested implementation commit: `347db59c3c90588299881fb67059241f2864663c`
- Observed at: `2026-08-28 11:34:54 -04` (`America/La_Paz`)

## Route execution

After a fresh reload and deterministic reset:

1. The visual journey was completed through primary pointer actions. It recorded seven events with route `visual` and source `pointer`.
2. The assistive journey was completed through `Enter` key activation only. It recorded seven independent events with route `assistive` and source `keyboard`. Focus advanced from consequences to exact consent, final commitment, and the completion heading; its live status announced disclosure, consent, result, the 30-minute cancellation window, and recovery guidance.
3. The client invoked native `equaltrace_run_agent_route`. It returned `evidenceProvenance: "native"`, outcome `deleted`, and three WebMCP-origin evidence IDs.

All routes used scenario `fictional-cloud-account-deletion`, version `1.0.0`, seed `equaltrace-golden-01`, initial account `ACCT-DEMO-017`, and final state `deleted`. Each route used an isolated run context.

## Native audit result

The client invoked native `equaltrace_run_audit`. Its material response was:

```json
{
  "status": "fail",
  "outcomeParity": true,
  "firstDivergence": {
    "kind": "missing_checkpoint",
    "route": "agent",
    "invariant": "disclosure",
    "checkpoint": "disclosure.consequences",
    "observedEvidenceIds": []
  }
}
```

Expected evidence IDs referenced the independently captured visual and assistive disclosure events. Immediately afterward, the same visible workbench showed:

- `Recorded — protection failure`
- both human route cards as current-session evidence;
- the agent route card as native evidence;
- `Baseline audit failed first at disclosure.consequences`.

## Automated companion proof

- Vitest: 34 tests passed across eight files.
- Playwright: five journeys passed, including pointer-only, keyboard-only, and three-route simulated-agent comparison.
- The Playwright adapter is explicitly simulated and is not the source of the native observations above.

## Limits and next proof

This record proves the real three-route baseline and intended first divergence on localhost. Build item 6 must turn the minimal result into the judge-first verdict and evidence experience. Repair authority, capability lifetime, repaired rerun, receipt, public HTTPS release, and five-run repetition remain incomplete.
