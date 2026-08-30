import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FPS = 30;
const W = 1920;
const H = 1080;

const C = {
  ink: "#06111b",
  white: "#f4f8fb",
  cyan: "#5ad8f5",
  green: "#54dda1",
  amber: "#f3bd5b",
  red: "#ff6f61",
  muted: "#9fb3c3",
};

const sans: CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
};

const mono: CSSProperties = {
  fontFamily: 'Consolas, "Courier New", monospace',
};

type Cue = { from: number; to: number; text: string };

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const fadeFor = (frame: number, duration: number) =>
  interpolate(frame, [0, 8, duration - 8, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Scene: React.FC<{ duration: number; children: ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: C.ink,
        opacity: fadeFor(frame, duration),
        overflow: "hidden",
      }}
    >
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: 0.12,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.11) 0, rgba(255,255,255,.11) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

const LiveShot: React.FC<{
  src: string;
  frame: number;
  duration: number;
  zoom?: number;
  drift?: number;
  panX?: number;
  panY?: number;
  dim?: number;
}> = ({
  src,
  frame,
  duration,
  zoom = 1,
  drift = 0.025,
  panX = 0,
  panY = 0,
  dim = 0,
}) => {
  const scale = zoom + (frame / Math.max(duration, 1)) * drift;
  return (
    <AbsoluteFill style={{ background: "#02070d" }}>
      <Img
        src={staticFile(`live-final/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
      {dim > 0 && (
        <AbsoluteFill style={{ background: `rgba(2,7,13,${dim})` }} />
      )}
    </AbsoluteFill>
  );
};

const Shot: React.FC<{
  from: number;
  to: number;
  src: string;
  zoom?: number;
  drift?: number;
  panX?: number;
  panY?: number;
  dim?: number;
}> = ({ from, to, ...props }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const local = frame - from;
  const opacity = interpolate(
    local,
    [0, 5, Math.max(6, to - from - 5), to - from],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      <LiveShot frame={local} duration={to - from} {...props} />
    </AbsoluteFill>
  );
};

const CaptureStamp: React.FC<{
  plate: string;
  status: string;
  tone?: keyof Pick<typeof C, "cyan" | "green" | "amber" | "red">;
}> = ({ plate, status, tone = "cyan" }) => (
  <div
    style={{
      ...mono,
      position: "absolute",
      left: 38,
      right: 38,
      top: 28,
      zIndex: 30,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: C.white,
      fontSize: 18,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      textShadow: "0 2px 8px #000",
    }}
  >
    <span>{plate}</span>
    <span style={{ color: C[tone], fontWeight: 900 }}>{status}</span>
  </div>
);

const SourceLine: React.FC<{ text?: string }> = ({
  text = "PUBLIC BUILD · NATIVE BROWSER SESSION · 2026-08-30",
}) => (
  <div
    style={{
      ...mono,
      position: "absolute",
      right: 38,
      bottom: 24,
      zIndex: 25,
      color: C.muted,
      fontSize: 14,
      letterSpacing: 1.1,
      textTransform: "uppercase",
      textShadow: "0 1px 5px #000",
    }}
  >
    {text}
  </div>
);

const Subtitles: React.FC<{ frame: number; cues: Cue[] }> = ({
  frame,
  cues,
}) => {
  const cue = cues.find(({ from, to }) => frame >= from && frame < to);
  if (!cue) return null;
  const local = frame - cue.from;
  const opacity = interpolate(
    local,
    [0, 4, Math.max(5, cue.to - cue.from - 4), cue.to - cue.from],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        ...sans,
        position: "absolute",
        left: 210,
        right: 210,
        bottom: 54,
        zIndex: 40,
        padding: "14px 24px 16px",
        color: C.white,
        background: "rgba(2,7,13,.88)",
        borderTop: `3px solid ${C.cyan}`,
        fontSize: 30,
        lineHeight: 1.25,
        fontWeight: 700,
        textAlign: "center",
        opacity,
      }}
    >
      {cue.text}
    </div>
  );
};

type CursorPoint = { frame: number; x: number; y: number };

const EditorialCursor: React.FC<{
  frame: number;
  points: CursorPoint[];
  clickAt?: number;
  label?: string;
}> = ({ frame, points, clickAt, label }) => {
  if (
    !points.length ||
    frame < points[0].frame ||
    frame > points.at(-1)!.frame + 18
  )
    return null;
  const frames = points.map((point) => point.frame);
  const x = interpolate(
    frame,
    frames,
    points.map((point) => point.x),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const y = interpolate(
    frame,
    frames,
    points.map((point) => point.y),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const pulse =
    clickAt === undefined ? 0 : clamp(1 - Math.abs(frame - clickAt) / 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 48,
        height: 58,
        zIndex: 45,
        filter: "drop-shadow(0 3px 4px rgba(0,0,0,.8))",
      }}
    >
      {pulse > 0 && (
        <div
          style={{
            position: "absolute",
            left: -23,
            top: -23,
            width: 62,
            height: 62,
            borderRadius: 99,
            border: `4px solid ${C.amber}`,
            opacity: pulse,
            transform: `scale(${0.6 + (1 - pulse) * 0.8})`,
          }}
        />
      )}
      <svg width="48" height="58" viewBox="0 0 48 58">
        <path
          d="M4 2 L4 44 L15 34 L24 54 L34 49 L24 30 L40 29 Z"
          fill="#ffffff"
          stroke="#071019"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      {label && (
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 38,
            top: 38,
            whiteSpace: "nowrap",
            color: C.white,
            background: "rgba(2,7,13,.92)",
            padding: "7px 10px",
            fontSize: 14,
            borderLeft: `3px solid ${C.amber}`,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const ScoreBand: React.FC<{ frame: number; repaired?: boolean }> = ({
  frame,
  repaired = false,
}) => {
  const reveal = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const values = repaired ? ["6/6", "6/6", "6/6"] : ["6/6", "6/6", "2/6"];
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 136,
        zIndex: 28,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        background: "rgba(2,7,13,.93)",
        borderTop: `4px solid ${repaired ? C.green : C.red}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 18}px)`,
      }}
    >
      {["VISUAL", "ASSISTIVE", "NATIVE WEBMCP"].map((label, index) => (
        <div
          key={label}
          style={{
            padding: "16px 22px",
            borderRight: index < 2 ? "1px solid #304252" : undefined,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span style={{ ...mono, color: C.muted, fontSize: 17 }}>{label}</span>
          <span
            style={{
              ...sans,
              color: index === 2 && !repaired ? C.red : C.green,
              fontSize: 46,
              fontWeight: 900,
            }}
          >
            {values[index]}
          </span>
        </div>
      ))}
    </div>
  );
};

const HookScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={240}>
      <Shot from={0} to={74} src="01-hero.png" zoom={1.02} dim={0.08} />
      <Shot from={74} to={142} src="02-reset-in-view.png" zoom={1.01} />
      <Shot from={142} to={240} src="04-baseline-started.png" zoom={1.01} />
      <CaptureStamp
        plate="EQUALTRACE / LIVE EVIDENCE CUT"
        status="fictional deletion · public release"
        tone="cyan"
      />
      <EditorialCursor
        frame={frame}
        points={[
          { frame: 76, x: 1150, y: 250 },
          { frame: 118, x: 294, y: 708 },
          { frame: 132, x: 294, y: 708 },
        ]}
        clickAt={120}
      />
      {frame > 145 && <ScoreBand frame={frame - 145} />}
      <SourceLine />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 106,
            text: "This deletion succeeded. That is the problem.",
          },
          {
            from: 106,
            to: 232,
            text: "A person received four protections the agent silently skipped.",
          },
        ]}
      />
    </Scene>
  );
};

const BaselineScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={420}>
      <Shot from={0} to={92} src="05-three-routes-ready.png" zoom={1.01} />
      <Shot
        from={92}
        to={185}
        src="08-visual-consequences-open.png"
        zoom={1.01}
      />
      <Shot
        from={185}
        to={265}
        src="09-visual-consent-recorded.png"
        zoom={1.01}
      />
      <Shot
        from={265}
        to={420}
        src="13-human-routes-complete.png"
        zoom={1.01}
        dim={frame > 338 ? 0.22 : 0}
      />
      <CaptureStamp
        plate="01 / SAME ACTION"
        status="three independent routes"
      />
      <EditorialCursor
        frame={frame}
        points={[
          { frame: 30, x: 1450, y: 330 },
          { frame: 82, x: 364, y: 901 },
          { frame: 110, x: 364, y: 901 },
          { frame: 204, x: 406, y: 545 },
        ]}
        clickAt={90}
      />
      {frame >= 215 && frame < 304 && (
        <div
          style={{
            ...mono,
            position: "absolute",
            right: 88,
            top: 88,
            zIndex: 35,
            color: C.white,
            background: "#071019",
            border: `3px solid ${C.cyan}`,
            padding: "16px 22px",
            fontSize: 26,
            fontWeight: 900,
          }}
        >
          KEYBOARD ROUTE / ENTER
        </div>
      )}
      {frame > 330 && <ScoreBand frame={frame - 330} />}
      <SourceLine />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 150,
            text: "EqualTrace runs the same fictional action through pointer, keyboard, and native WebMCP.",
          },
          {
            from: 150,
            to: 278,
            text: "The outcome matches. The protection contract does not.",
          },
          {
            from: 278,
            to: 412,
            text: "Six of six. Six of six. Two of six.",
          },
        ]}
      />
    </Scene>
  );
};

const DivergenceScene = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [25, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Scene duration={270}>
      <LiveShot
        src="15-baseline-audit-failed.png"
        frame={frame}
        duration={270}
        zoom={1.06}
        drift={0.02}
        panY={18}
        dim={0.04}
      />
      <CaptureStamp
        plate="02 / FIRST DIVERGENCE"
        status="disclosure.consequences"
        tone="red"
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 270,
          width: 1100,
          height: 6,
          zIndex: 35,
          background: C.red,
          transformOrigin: "left center",
          transform: `scaleX(${line})`,
          boxShadow: `0 0 18px ${C.red}`,
        }}
      />
      <div
        style={{
          ...mono,
          position: "absolute",
          right: 74,
          top: 164,
          width: 430,
          zIndex: 36,
          padding: "20px 24px",
          color: C.white,
          background: "rgba(2,7,13,.95)",
          borderLeft: `6px solid ${C.red}`,
          fontSize: 22,
          lineHeight: 1.45,
        }}
      >
        expected / disclosure before commitment
        <br />
        observed / commitment came first
      </div>
      <SourceLine text="NATIVE AUDIT RESULT · STATUS FAIL · OUTCOME PARITY TRUE" />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 136,
            text: "EqualTrace stops at the first real break.",
          },
          {
            from: 136,
            to: 262,
            text: "The agent committed before consequences were disclosed.",
          },
        ]}
      />
    </Scene>
  );
};

const ApprovalScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={390}>
      <Shot
        from={0}
        to={166}
        src="17-approval-boundary-absent.png"
        zoom={1.01}
      />
      <Shot
        from={166}
        to={390}
        src="17b-approval-boundary-renewed.png"
        zoom={1}
        drift={0.015}
        panX={330}
        dim={frame > 300 ? 0.18 : 0}
      />
      <CaptureStamp
        plate="03 / HUMAN AUTHORITY"
        status={
          frame < 166 ? "capability absent" : "operator decision recorded"
        }
        tone={frame < 166 ? "amber" : "green"}
      />
      {frame < 166 && (
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 82,
            top: 92,
            zIndex: 35,
            padding: "12px 16px",
            color: C.amber,
            background: "rgba(2,7,13,.94)",
            borderLeft: `5px solid ${C.amber}`,
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          ATTEMPT 1 / EXPIRED BEFORE NATIVE DISCOVERY
        </div>
      )}
      <EditorialCursor
        frame={frame}
        points={[
          { frame: 45, x: 1240, y: 260 },
          { frame: 120, x: 281, y: 774 },
          { frame: 144, x: 281, y: 774 },
        ]}
        clickAt={124}
        label="EDITORIAL CURSOR / CONTROL LOCATION"
      />
      {frame > 178 && (
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 82,
            top: 128,
            zIndex: 35,
            padding: "14px 18px",
            color: C.green,
            background: "rgba(2,7,13,.94)",
            borderLeft: `5px solid ${C.green}`,
            fontSize: 20,
            fontWeight: 900,
          }}
        >
          RESTAGED / SAME REPAIR ID + DIGEST
          <br />
          EXACT DIGEST APPROVED / 5CD22DF0…851A8A
        </div>
      )}
      <SourceLine text="CURSOR INDICATOR ADDED IN EDIT · STATE TRANSITION IS NATIVE" />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 118,
            text: "An approval window expired, so the tool stayed absent.",
          },
          {
            from: 118,
            to: 238,
            text: "EqualTrace restaged the same repair ID and digest.",
          },
          {
            from: 238,
            to: 382,
            text: "A person reviewed the bound change, then approved it.",
          },
        ]}
      />
    </Scene>
  );
};

const coreTools = [
  "equaltrace_get_status",
  "equaltrace_run_agent_route",
  "equaltrace_run_audit",
  "equaltrace_stage_repair",
];

const NativeToolPanel: React.FC<{ phase: 0 | 1 | 2; frame: number }> = ({
  phase,
  frame,
}) => {
  const tools =
    phase === 1
      ? [...coreTools, "equaltrace_apply_approved_repair"]
      : coreTools;
  const tone = phase === 1 ? C.green : phase === 2 ? C.red : C.amber;
  const labels = ["BEFORE APPROVAL", "AFTER APPROVAL", "AFTER ONE USE"];
  const sourceFiles = [
    "native-tools-before.txt",
    "native-tools-five.txt",
    "native-tools-after-use.txt",
  ];
  return (
    <AbsoluteFill style={{ background: "#03080d", color: C.white }}>
      <div
        style={{
          ...mono,
          position: "absolute",
          left: 92,
          right: 92,
          top: 126,
          borderTop: `2px solid ${tone}`,
          paddingTop: 28,
        }}
      >
        <div style={{ color: tone, fontSize: 20, fontWeight: 900 }}>
          FRESH fetchTools() / {labels[phase]}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "210px 1fr",
            gap: 42,
            marginTop: 34,
          }}
        >
          <div
            style={{
              ...sans,
              fontSize: 148,
              lineHeight: 0.86,
              fontWeight: 900,
              color: tone,
            }}
          >
            0{tools.length}
            <div
              style={{
                ...mono,
                marginTop: 24,
                color: C.muted,
                fontSize: 16,
                letterSpacing: 1.2,
              }}
            >
              NATIVE TOOLS
            </div>
          </div>
          <div>
            {tools.map((tool, index) => {
              const p = interpolate(
                frame,
                [index * 8, index * 8 + 16],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              );
              const apply = tool === "equaltrace_apply_approved_repair";
              return (
                <div
                  key={tool}
                  style={{
                    height: 78,
                    display: "grid",
                    gridTemplateColumns: "70px 1fr auto",
                    alignItems: "center",
                    borderBottom: "1px solid #20313f",
                    opacity: p,
                    transform: `translateX(${(1 - p) * 14}px)`,
                    color: apply ? C.green : C.white,
                    fontSize: 25,
                  }}
                >
                  <span style={{ color: tone }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{tool}</span>
                  <span
                    style={{ fontSize: 16, color: apply ? C.green : C.muted }}
                  >
                    {apply ? "BOUND · ONE USE" : "STABLE"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {phase === 2 && (
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 360,
            right: 360,
            bottom: 178,
            padding: "20px 24px",
            border: `2px solid ${C.green}`,
            color: C.green,
            fontSize: 21,
            textAlign: "center",
          }}
        >
          status: applied · policy: repaired-agent
          <br />
          capability: removed_after_use
        </div>
      )}
      <SourceLine text={`CAPTURE SOURCE · ${sourceFiles[phase]}`} />
    </AbsoluteFill>
  );
};

const ToolLifecycleScene = () => {
  const frame = useCurrentFrame();
  const phase: 0 | 1 | 2 = frame < 98 ? 0 : frame < 216 ? 1 : 2;
  return (
    <Scene duration={330}>
      <NativeToolPanel
        key={phase}
        phase={phase}
        frame={phase === 0 ? frame : phase === 1 ? frame - 98 : frame - 216}
      />
      <CaptureStamp
        plate="04 / NATIVE DISCOVERY"
        status={
          phase === 0 ? "04 tools" : phase === 1 ? "05 tools" : "04 tools"
        }
        tone={phase === 1 ? "green" : phase === 2 ? "red" : "amber"}
      />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 102,
            text: "A fresh native discovery sees four tools before approval.",
          },
          {
            from: 102,
            to: 212,
            text: "After approval, it sees five. The repair runs once.",
          },
          {
            from: 212,
            to: 322,
            text: "A new discovery sees four again.",
          },
        ]}
      />
    </Scene>
  );
};

const RerunScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={480}>
      <Shot
        from={0}
        to={145}
        src="24-repaired-human-routes-complete.png"
        zoom={1}
        panX={330}
      />
      <Shot
        from={145}
        to={292}
        src="25-repaired-agent-native.png"
        zoom={1}
        panX={330}
      />
      <Shot
        from={292}
        to={480}
        src="26-parity-receipt-16x9.png"
        zoom={1.02}
        drift={0.035}
        panY={-18}
      />
      <CaptureStamp
        plate="05 / FRESH REPAIRED PROOF"
        status={
          frame < 145
            ? "02 / 03 routes"
            : frame < 292
              ? "03 / 03 routes"
              : "receipt issued"
        }
        tone={frame < 145 ? "cyan" : "green"}
      />
      {frame > 180 && frame < 315 && <ScoreBand frame={frame - 180} repaired />}
      {frame > 316 && (
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 86,
            top: 118,
            zIndex: 35,
            color: C.green,
            background: "rgba(2,7,13,.94)",
            borderLeft: `5px solid ${C.green}`,
            padding: "16px 20px",
            fontSize: 19,
            lineHeight: 1.45,
          }}
        >
          status / pass
          <br />
          receipt / 3edf6503b77b…44728
        </div>
      )}
      <SourceLine text="FRESH ROUTES ONLY · OLD BASELINE TRACES CLEARED" />
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 130,
            text: "EqualTrace deletes the old traces and repeats all three routes.",
          },
          {
            from: 130,
            to: 276,
            text: "This time every route preserves all six protections.",
          },
          {
            from: 276,
            to: 472,
            text: "The receipt is bound to the evidence, the seed, and the applied repair.",
          },
        ]}
      />
    </Scene>
  );
};

const CloseScene = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Scene duration={270}>
      <LiveShot
        src="26-parity-receipt-16x9.png"
        frame={frame}
        duration={270}
        zoom={1.05}
        drift={0.02}
        dim={0.74}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          right: 112,
          top: 160,
          zIndex: 35,
          color: C.white,
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        <div
          style={{
            ...mono,
            color: C.green,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 1.5,
          }}
        >
          EQUALTRACE / VERIFIED ON THE PUBLIC BUILD
        </div>
        <div
          style={{
            ...sans,
            marginTop: 32,
            fontSize: 92,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -3,
          }}
        >
          3 routes.
          <br />6 protections each.
          <br />1 deterministic receipt.
        </div>
        <div
          style={{
            ...mono,
            marginTop: 52,
            paddingTop: 22,
            borderTop: `3px solid ${C.green}`,
            color: C.muted,
            fontSize: 22,
          }}
        >
          ricardonp51.github.io/equaltrace-webmcp
        </div>
      </div>
      <Subtitles
        frame={frame}
        cues={[
          {
            from: 8,
            to: 140,
            text: "EqualTrace is runtime protection parity for the agentic web.",
          },
          {
            from: 140,
            to: 262,
            text: "Not just the same result—the same protections.",
          },
        ]}
      />
    </Scene>
  );
};

const liveAudio = [
  { from: 0, duration: 240, file: "live-scene-01.wav" },
  { from: 240, duration: 420, file: "live-scene-02.wav" },
  { from: 660, duration: 270, file: "live-scene-03.wav" },
  { from: 930, duration: 390, file: "live-scene-04.wav" },
  { from: 1320, duration: 330, file: "live-scene-05.wav" },
  { from: 1650, duration: 480, file: "live-scene-06.wav" },
  { from: 2130, duration: 270, file: "live-scene-07.wav" },
] as const;

export const EqualTraceLiveFinal = () => (
  <AbsoluteFill style={{ background: C.ink, width: W, height: H }}>
    <Audio src={staticFile("generated/soundbed-live.wav")} volume={0.105} />
    {liveAudio.map((audio) => (
      <Sequence
        key={audio.file}
        from={audio.from}
        durationInFrames={audio.duration}
      >
        <Audio src={staticFile(`generated/${audio.file}`)} volume={1} />
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={240}>
      <HookScene />
    </Sequence>
    <Sequence from={240} durationInFrames={420}>
      <BaselineScene />
    </Sequence>
    <Sequence from={660} durationInFrames={270}>
      <DivergenceScene />
    </Sequence>
    <Sequence from={930} durationInFrames={390}>
      <ApprovalScene />
    </Sequence>
    <Sequence from={1320} durationInFrames={330}>
      <ToolLifecycleScene />
    </Sequence>
    <Sequence from={1650} durationInFrames={480}>
      <RerunScene />
    </Sequence>
    <Sequence from={2130} durationInFrames={270}>
      <CloseScene />
    </Sequence>
  </AbsoluteFill>
);

export const LIVE_FINAL_DURATION = 2400;
export const LIVE_FINAL_FPS = FPS;
