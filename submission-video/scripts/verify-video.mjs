import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const target = resolve(process.argv[2] ?? "out/equaltrace-demo-final.mp4");
if (!existsSync(target)) throw new Error(`Missing video: ${target}`);

const probe = JSON.parse(
  execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,codec_name,width,height",
      "-of",
      "json",
      target,
    ],
    { encoding: "utf8" },
  ),
);

const video = probe.streams.find((stream) => stream.codec_type === "video");
const audio = probe.streams.find((stream) => stream.codec_type === "audio");
const duration = Number(probe.format.duration);

if (!video || video.codec_name !== "h264")
  throw new Error("Expected H.264 video.");
if (video.width !== 1920 || video.height !== 1080) {
  throw new Error(
    `Expected 1920x1080, received ${video.width}x${video.height}.`,
  );
}
if (!audio || audio.codec_name !== "aac")
  throw new Error("Expected AAC narration audio.");
if (!(duration > 0 && duration < 180))
  throw new Error(`Invalid duration: ${duration}s.`);

console.log(
  JSON.stringify(
    {
      target,
      durationSeconds: duration,
      videoCodec: video.codec_name,
      audioCodec: audio.codec_name,
      dimensions: `${video.width}x${video.height}`,
      sizeBytes: statSync(target).size,
      underThreeMinutes: true,
    },
    null,
    2,
  ),
);
