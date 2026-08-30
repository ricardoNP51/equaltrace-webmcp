from __future__ import annotations

import json
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro


ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "models" / "kokoro-v1.0.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
OUTPUT = ROOT / "public" / "generated"


def main() -> None:
    if not MODEL.exists() or not VOICES.exists():
        raise SystemExit(
            "Missing Kokoro files. Download kokoro-v1.0.onnx and "
            "voices-v1.0.bin into submission-video/models first."
        )

    scenes = json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(str(MODEL), str(VOICES))

    for scene in scenes:
        samples, sample_rate = kokoro.create(
            scene["text"],
            voice="af_heart",
            speed=1.04,
            lang="en-us",
        )
        target = OUTPUT / f"{scene['id']}.wav"
        sf.write(target, samples, sample_rate, subtype="PCM_16")
        seconds = len(samples) / sample_rate
        print(f"{target.name}: {seconds:.2f}s")


if __name__ == "__main__":
    main()
