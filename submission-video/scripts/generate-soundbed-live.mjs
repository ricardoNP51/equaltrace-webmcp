import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public", "generated", "soundbed-live.wav");
mkdirSync(dirname(output), { recursive: true });

const filter = [
  "aevalsrc=0.006*sin(2*PI*48*t)+0.0028*sin(2*PI*72*t)+0.0016*sin(2*PI*880*t)*pow(max(0\\,sin(PI*t/3))\\,34)+0.0011*sin(2*PI*1760*t)*pow(max(0\\,sin(PI*t/7))\\,42):s=48000:d=80",
  "highpass=f=34",
  "lowpass=f=2100",
  "acompressor=threshold=-26dB:ratio=2.2:attack=12:release=220",
  "afade=t=in:st=0:d=1.1",
  "afade=t=out:st=75:d=5",
].join(",");

const result = spawnSync(
  "ffmpeg",
  ["-y", "-f", "lavfi", "-i", filter, "-c:a", "pcm_s16le", output],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created ${output}`);
