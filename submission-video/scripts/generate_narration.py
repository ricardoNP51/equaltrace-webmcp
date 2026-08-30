from __future__ import annotations

import argparse
import json
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro


ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "models" / "kokoro-v1.0.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
OUTPUT = ROOT / "public" / "generated"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="narration.json")
    parser.add_argument("--voice", default="af_heart")
    parser.add_argument("--speed", type=float, default=1.04)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not MODEL.exists() or not VOICES.exists():
        raise SystemExit(
            "Missing Kokoro files. Download kokoro-v1.0.onnx and "
            "voices-v1.0.bin into submission-video/models first."
        )

    scenes = json.loads((ROOT / args.input).read_text(encoding="utf-8"))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(str(MODEL), str(VOICES))

    for scene in scenes:
        samples, sample_rate = kokoro.create(
            scene["text"],
            voice=args.voice,
            speed=args.speed,
            lang="en-us",
        )
        target = OUTPUT / f"{scene['id']}.wav"
        sf.write(target, samples, sample_rate, subtype="PCM_16")
        seconds = len(samples) / sample_rate
        print(f"{target.name}: {seconds:.2f}s")


if __name__ == "__main__":
    main()
