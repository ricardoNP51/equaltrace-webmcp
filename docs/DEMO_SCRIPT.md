# EqualTrace demo script

Target: **2:45–2:55**, 1080p, public YouTube, clear English narration, no music required. Show the working app in the first 10 seconds. Record only release `challenge-v1.0.0` at commit `20ccacc499fcb8f7fed126f10af38e820c95b335`.

## Recording setup

- Open the public URL in the Codex/ChatGPT in-app browser with Site tools available.
- Use a fresh reset and hide notifications, private tabs, credentials, and unrelated desktop UI.
- Keep browser zoom at 100% and use a 16:9 recording area at 1920×1080 or 1440×900.
- Make pointer clicks deliberate. Use the keyboard for the assistive route.
- Do not cut around tool discovery: the absent → appeared → used → absent sequence is the central proof.

## Timed storyboard and narration

### 0:00–0:15 — Show the product working

**Screen:** Opening hero and known-bypass verdict.

**Narration:** “This agent got the right result—and still failed. EqualTrace proves when a WebMCP agent reaches the same consequential outcome as a person while skipping protections that constrained the human journey.”

### 0:15–0:38 — One action, three real routes

**Screen:** Reset. Rapidly complete the visual route with the pointer and the assistive route with the keyboard. Invoke the native agent route.

**Narration:** “One fictional account deletion starts from one deterministic seed. I perform it through the visual route, repeat it keyboard-only, and call the native WebMCP agent tool. All three routes use the same domain engine and reach deleted.”

### 0:38–1:02 — Reveal the hidden failure

**Screen:** Invoke the audit and show the three route cards plus first-divergence panel.

**Narration:** “Outcome-only testing would show green. EqualTrace compares ordered semantic protections: disclosure, exact consent, feedback, reversibility, recovery, and outcome. It fails at the earliest mismatch: the agent deleted before consequences were disclosed.”

### 1:02–1:29 — Agent proposes; human authority remains visible

**Screen:** Show that the apply tool is absent. Invoke stage repair. Show the proposal, exact digest, expiry, and `Repair capability: absent`.

**Narration:** “The agent may stage one bounded repair, but it cannot approve or apply it. Before approval, the consequential repair tool does not exist. The page shows the exact action, checkpoint, seed, digest, and expiry.”

### 1:29–1:58 — Dynamic WebMCP capability lifetime

**Screen:** Click **Approve this exact repair**. Refresh tools, show the new apply tool, invoke it once, refresh again and show it gone.

**Narration:** “Only this visible human action grants authority. Native discovery now reveals one exact temporary capability. I invoke it once. The repair applies to the shared policy and the capability immediately removes itself, preventing replay.”

### 1:58–2:32 — Prove the repair, do not trust a status flag

**Screen:** Begin fresh repaired rerun. Recreate visual and keyboard routes, invoke the repaired native agent route, then audit.

**Narration:** “EqualTrace does not trust an applied-policy badge. It clears the old traces and requires three fresh routes. The repaired agent now preserves the same six protections. Outcome parity and every assertion pass across visual, assistive, and native WebMCP evidence.”

### 2:32–2:52 — Portable proof and closing claim

**Screen:** Receipt panel, deterministic hash, then briefly show repository/evidence link.

**Narration:** “The result is a deterministic SHA-256 parity receipt whose assertions link to recorded evidence. We reproduced the full public native lifecycle five consecutive times with the same receipt. EqualTrace: same action, same protections, provable.”

## Tool-call cue sheet

1. `equaltrace_run_agent_route` with scenario ID, version, and seed shown by the page.
2. `equaltrace_run_audit`.
3. Confirm `equaltrace_apply_approved_repair` is absent.
4. `equaltrace_stage_repair`.
5. Visible human approval.
6. Refresh discovery; invoke `equaltrace_apply_approved_repair` with staged ID and digest.
7. Refresh discovery; confirm absence.
8. After fresh human reruns, invoke `equaltrace_run_agent_route` and `equaltrace_run_audit` again.

## Final video gate

- [ ] Duration is less than 3:00.
- [ ] Public YouTube visibility opens in a signed-out window.
- [ ] Narration is clearly audible; a silent/music-only video is not acceptable.
- [ ] Working product appears within the first 10–15 seconds.
- [ ] Native tool calls and shared visible state are both shown.
- [ ] Human approval and absent → appeared → used → absent lifecycle are visible.
- [ ] Receipt and release footer match `challenge-v1.0.0` / `20ccacc499fc`.
- [ ] No secrets, notifications, personal data, copyrighted music, or unrelated marks appear.
