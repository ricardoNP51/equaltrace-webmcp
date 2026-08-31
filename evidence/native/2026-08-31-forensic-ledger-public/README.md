# Forensic Ledger public native proof

Captured on 2026-08-30 in America/La_Paz (`2026-08-31T00:15:46.393Z`) from the public GitHub Pages application.

## Exact public revision

- URL: `https://ricardonp51.github.io/equaltrace-webmcp/?release=936146e8a0e18c1c3b1130f48528444cb88bf00f`
- Git commit: `936146e8a0e18c1c3b1130f48528444cb88bf00f`
- Application footer: `challenge-v1.0.0` · commit `936146e8a0e1`
- Origin reported by every discovered tool: `https://ricardonp51.github.io`
- Quality workflow: GitHub Actions run `33343667007` — success
- Pages workflow: GitHub Actions run `33343667031` — success

## Supported-client observation

Codex In-app Browser exposed the page's WebMCP capability without a polyfill, simulator, unit-test registry, or mocked tool surface.

1. Before approval, a fresh `fetchTools()` returned four stable tools: `equaltrace_get_status`, `equaltrace_run_agent_route`, `equaltrace_run_audit`, and `equaltrace_stage_repair`.
2. The baseline produced visual `6/6`, assistive `6/6`, and native agent `2/6`. The first divergence was `disclosure.consequences` even though all three routes completed the same fictional deletion.
3. Native staging exposed the exact bounded repair, digest `5cd22df014d91689792f353f02db08bcc05fd83de24c8f2d6ef5327de785a18a`, and visible human approval control.
4. Only after that visible approval did a fresh `fetchTools()` return five tools, adding `equaltrace_apply_approved_repair`.
5. One exact application succeeded. A fresh `fetchTools()` immediately returned to the original four-tool surface; the apply capability reported `removed_after_use`.
6. EqualTrace cleared the old traces and required fresh pointer, keyboard, and native WebMCP runs. All three then passed `6/6`.
7. The final native status was `verified`, the repair capability remained absent with reason `used`, and the canonical receipt was `3edf6503b77b0391a2fff20f31d664286a5db9c72d253ea6b0342db0aec44728`.
8. The supported-client console contained no warnings or errors.

The structured observation is frozen in `public-native-session.json`. The six JPEG files are current public-page captures used as the source material for the final Forensic Ledger video. Editorial cursor, zoom, labels, cuts, and subtitles in the rendered video are not represented as native browser evidence.

## Scope

This record proves one complete native lifecycle on the redesigned public commit. The earlier five-run public release record remains the repetition/determinism evidence; this record specifically closes visual-release parity between the deployed product and the final video source.
