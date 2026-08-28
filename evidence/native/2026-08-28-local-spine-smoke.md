# Native WebMCP spine smoke — 2026-08-28

## Classification

- Evidence class: **native local smoke**
- Not accepted as: public deployment proof, dynamic repair-capability proof, or release evidence
- Polyfill installed on `document.modelContext`: **no**
- Test registry used for this observation: **no**

## Environment

- Client: ChatGPT desktop, Codex in-app browser
- ChatGPT desktop version: `26.825.32147` (`CFBundleVersion` `7303`)
- Embedded browser framework: `151.0.7922.174`
- Operating system: macOS `13.7.8` (`22H730`)
- Origin: `http://127.0.0.1:5174`
- Page URL: `http://127.0.0.1:5174/`
- Tested implementation commit: `0062715887c5b6f86ee9903ab5e2717315c464df`
- Observed at: `2026-08-28 10:21:26 -04` (`America/La_Paz`)

## Discovery observation

After a fresh page reload, the client's native WebMCP capability discovered exactly these page-defined tools:

1. `equaltrace_get_status`
2. `equaltrace_run_agent_route`
3. `equaltrace_run_audit`
4. `equaltrace_stage_repair`

Every discovered schema had `additionalProperties: false`. The consequential future tool `equaltrace_apply_approved_repair` was absent.

## Invocation observation

The visible page was reset into `baseline_capture`. The client then invoked `equaltrace_run_agent_route` with the exact active identity:

```json
{
  "scenarioId": "fictional-cloud-account-deletion",
  "scenarioVersion": "1.0.0",
  "seed": "equaltrace-golden-01"
}
```

The native response was:

```json
{
  "status": "recorded",
  "evidenceProvenance": "native",
  "outcome": "deleted",
  "evidenceIds": [
    "fictional-cloud-account-deletion:1.0.0:equaltrace-golden-01:agent:current-baseline-agent:event:01",
    "fictional-cloud-account-deletion:1.0.0:equaltrace-golden-01:agent:current-baseline-agent:event:02",
    "fictional-cloud-account-deletion:1.0.0:equaltrace-golden-01:agent:current-baseline-agent:event:03"
  ]
}
```

Immediately afterward, the same page's Agent route card visibly read `native evidence recorded`. Visual and assistive route cards remained `Not recorded`, and the overall evidence state remained `Incomplete`; native invocation did not synthesize human evidence or create a false pass.

A native `equaltrace_get_status` call then reported `completedRoutes: ["agent"]`, `comparison: "not_run"`, `nativeSupport: "available"`, and `repairCapability: "absent"`.

## Defect found during native validation

The first attempt against commit `5f595773a65d0c80741d487a35054c52f5e31776` discovered the tools but failed invocation because this client omitted optional execution metadata. The handler incorrectly destructured an assumed second argument. Commit `0062715887c5b6f86ee9903ab5e2717315c464df` made the metadata optional while continuing to honor `AbortSignal` when supplied. The complete automated gate passed again before the successful native repetition above.

## Limits and next proof

- This smoke proves native discovery, native invocation, and shared visible state on localhost only.
- It does not prove the visual or assistive route, proposal digest, human approval boundary, dynamic registration lifetime, repaired rerun, receipt, HTTPS deployment, or five-run release repetition.
- Build item 5 is the next admissible work.
