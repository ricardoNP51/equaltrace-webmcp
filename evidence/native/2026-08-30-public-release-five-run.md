# Public native release proof — five consecutive runs

## Release identity

- Release: `challenge-v1.0.0`
- Exact deployed commit: `20ccacc499fcb8f7fed126f10af38e820c95b335`
- Public HTTPS origin: `https://ricardonp51.github.io/equaltrace-webmcp/`
- Repository: `https://github.com/ricardoNP51/equaltrace-webmcp`
- Tag: `challenge-v1.0.0`
- Client: Codex In-app Browser
- Client/plugin version: `26.825.41651`
- Date: 2026-08-30 (America/La_Paz)
- Native receipt identity, repeated in every run: `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`

The deployed footer visibly reported `Release challenge-v1.0.0 · commit 20ccacc499fc`. GitHub Pages deployed the artifact built and gated from the same exact commit. The five runs below used the browser-provided WebMCP surface; no polyfill, fake registry, injected Playwright port, or local development server was used.

## Required sequence

Every run began with **Reset baseline** and completed the same bounded sequence:

1. Complete the visual route with pointer activation and the assistive route with keyboard activation.
2. Discover and invoke native `equaltrace_run_agent_route`; its response reports `evidenceProvenance: native`.
3. Invoke native `equaltrace_run_audit`; the baseline fails with equal outcome at `agent / disclosure.consequences`.
4. Invoke native `equaltrace_stage_repair`; before visible approval, discovery excludes `equaltrace_apply_approved_repair` and the page reports `Repair capability: absent`.
5. Click the visible **Approve this exact repair** control. Fresh native discovery then includes exactly the temporary apply tool.
6. Invoke that exact tool once with repair ID `repair-1.0.0-disclosure.consequences` and digest `5cd22df014d91689792f353f02db08bcc05fd83de24c8f2d6ef5327de785a18a`. The response reports `status: applied` and `capability: removed_after_use`.
7. Discover again and confirm that the temporary apply tool is absent.
8. Begin a fresh repaired rerun, recreate the visual and assistive routes, invoke the native repaired agent route, then invoke the native audit.
9. Confirm a pass with outcome parity, 6/6 protections on all three routes, the temporary capability still absent with reason `used`, and the deterministic receipt below.

## Consecutive observations

| Run | Baseline                          | Native agent | Capability lifecycle              | Repaired audit       | Receipt                                                            |
| --- | --------------------------------- | ------------ | --------------------------------- | -------------------- | ------------------------------------------------------------------ |
| 1   | fail at `disclosure.consequences` | native       | absent → appeared → used → absent | pass, outcome parity | `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` |
| 2   | fail at `disclosure.consequences` | native       | absent → appeared → used → absent | pass, outcome parity | `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` |
| 3   | fail at `disclosure.consequences` | native       | absent → appeared → used → absent | pass, outcome parity | `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` |
| 4   | fail at `disclosure.consequences` | native       | absent → appeared → used → absent | pass, outcome parity | `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` |
| 5   | fail at `disclosure.consequences` | native       | absent → appeared → used → absent | pass, outcome parity | `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728` |

## Independent release checks

- GitHub Actions quality-gate runs `33294006121` and `33294006735` passed for commit `20ccacc499fcb8f7fed126f10af38e820c95b335`.
- GitHub Pages workflow run `33294006674` gated and deployed that same commit successfully.
- A new clone from the public tag `challenge-v1.0.0` resolved to `20ccacc499fcb8f7fed126f10af38e820c95b335`; `npm ci` reported zero vulnerabilities and `npm run check` passed with 66 Vitest tests, 12 browser journeys, receipt verification, and the pre-freeze native manifest gate.
- The final manifest is machine-checked by `npm run verify:native-evidence` and requires exactly five passing runs with one receipt identity and the exact lifecycle string.

## Claim boundary

This record proves the public release behavior in the named Codex In-app Browser version and origin. It does not claim compatibility with every WebMCP client, does not turn automated or local evidence into public native evidence, and does not treat the page's registration status as discovery proof. Discovery was checked from the client before approval, after approval, and after use in every run.
