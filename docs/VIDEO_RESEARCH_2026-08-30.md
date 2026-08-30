# Submission video research — 2026-08-30

## Decision

Build a presenter-free, English-narrated product launch video with three layers:

1. verified EqualTrace release screenshots and a small amount of real product capture;
2. a custom Remotion composition for typography, camera movement, lifecycle graphics, captions, sound design, and final MP4;
3. local Kokoro narration so the participant does not appear or record their voice.

Pagecast is useful for repeatable pointer/browser capture, but it cannot establish native WebMCP provenance. Scenar renders isolated React components rather than the live app. Both can help create secondary motion assets; neither replaces the frozen native screenshots and evidence record.

## What the official launch videos do

Recent short OpenAI and Anthropic releases converge on a compact grammar:

- show the product or result immediately rather than spending ten seconds on a logo;
- use one sentence per beat and let the interface carry the explanation;
- alternate full product frames with short, large typographic claims;
- use restrained zoom, crop, and cursor motion rather than constant transitions;
- keep captions readable without relying on audio;
- end on a single memorable product promise and URL.

Useful official references:

- OpenAI, [Introducing ChatGPT Pulse](https://www.youtube.com/watch?v=nk6IjAnCCqw), 1:07.
- OpenAI, [Apps in ChatGPT](https://www.youtube.com/watch?v=2C4Cs6503gw).
- Anthropic, [Introducing Cowork](https://www.youtube.com/watch?v=UAmKyyZ-b9E).
- Anthropic, [Claude Opus 4.5 solves a puzzle game](https://www.youtube.com/watch?v=2MJDdzSXL74), 1:34.

EqualTrace cannot copy their music or branded assets. The transferable lesson is pacing and visual hierarchy, not imitation.

## Tool comparison

| Candidate | Strength | Limitation | Decision |
| --- | --- | --- | --- |
| [Remotion](https://www.remotion.dev/) | Frame-accurate React composition, audio, captions, local MP4, full control | Source-available proprietary license; free for individuals and teams up to three | Selected composition engine |
| [Pagecast](https://github.com/mcpware/pagecast) | AI-controlled Playwright recording with cursor, click ripple, zoom, and MP4 | Ordinary automated Chromium does not prove native WebMCP | Optional secondary capture only |
| [remotion-cinematic](https://github.com/codeverbojan/remotion-cinematic) | Strong camera/cursor primitives and SaaS demo structure | General-purpose template would need heavy simplification | Design reference, not direct dependency |
| [Scenar](https://github.com/stigmer/scenar) | Same React scenario can become an embed and MP4 | Isolated components/mock providers are weaker evidence than the deployed product | Rejected for primary demo |
| [product-launch-video](https://github.com/8legged/product-launch-video) | Sensible storyboard and audit workflow | Minimal template and very small adoption footprint | Workflow reference only |

## Narration decision

[Kokoro-82M](https://github.com/hexgrad/kokoro) is the best fit: Apache-2.0 model weights, fixed voices rather than voice cloning, fast local generation, and no API key. The [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) runtime is MIT-licensed and supports Windows. Voice cloning is intentionally unnecessary; the video should sound like a clean product narrator, not imitate a real person.

The soundtrack is generated from simple synthesized tones. No participant audio, cloned voice, commercial music, or ambiguous stock license enters the deliverable.

## Winning edit rules

- Show `6/6 · 6/6 · 2/6` by 0:30.
- Name the first divergence before 1:00.
- Make absent → approved → invoked once → removed the central motion graphic.
- Show the verified receipt, release tag, and public URL.
- Never call a fixture, Playwright registry, or animation native proof.
- Keep the final duration below 3:00 and target roughly 2:20–2:30.
