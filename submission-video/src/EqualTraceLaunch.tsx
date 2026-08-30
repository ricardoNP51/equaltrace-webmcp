import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  bg: "#050911",
  surface: "#091321",
  surfaceRaised: "#0d1929",
  border: "#293c52",
  text: "#eef7ff",
  soft: "#c5d5e4",
  muted: "#9fb2c5",
  cyan: "#65dcff",
  amber: "#ffc86b",
  green: "#61e6a2",
  danger: "#ff8c8c",
} as const;

const font: CSSProperties = {
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const mono: CSSProperties = {
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
};

const scenes = [
  { from: 0, duration: 450, audio: "scene-01.wav" },
  { from: 450, duration: 690, audio: "scene-02.wav" },
  { from: 1140, duration: 720, audio: "scene-03.wav" },
  { from: 1860, duration: 780, audio: "scene-04.wav" },
  { from: 2640, duration: 780, audio: "scene-05.wav" },
  { from: 3420, duration: 750, audio: "scene-06.wav" },
  { from: 4170, duration: 330, audio: "scene-07.wav" },
] as const;

const Fade: React.FC<{ children: ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 18, duration - 18, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Background: React.FC<{ accent?: "cyan" | "amber" | "green" }> = ({
  accent = "cyan",
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 4500], [-120, 140]);
  const color = COLORS[accent];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(circle at ${28 + drift / 30}% 25%, ${color}24 0, transparent 34%), radial-gradient(circle at 82% 78%, #143c5f50 0, transparent 32%), linear-gradient(rgba(101, 220, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(101, 220, 255, 0.035) 1px, transparent 1px)`,
        backgroundSize: "auto, auto, 56px 56px, 56px 56px",
      }}
    />
  );
};

const Brand: React.FC = () => (
  <div
    style={{
      ...font,
      position: "absolute",
      left: 70,
      top: 54,
      display: "flex",
      alignItems: "center",
      gap: 14,
      color: COLORS.text,
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: -0.6,
      zIndex: 20,
    }}
  >
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        background: COLORS.cyan,
        boxShadow: `0 0 28px ${COLORS.cyan}`,
      }}
    />
    EqualTrace
  </div>
);

const Caption: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      ...font,
      position: "absolute",
      left: 280,
      right: 280,
      bottom: 44,
      zIndex: 30,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      fontSize: 30,
      lineHeight: 1.24,
      fontWeight: 650,
      color: COLORS.text,
      textShadow: "0 4px 20px rgba(0,0,0,.8)",
    }}
  >
    <span
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        background: "rgba(5, 9, 17, .88)",
        padding: "14px 24px",
        boxShadow: "0 18px 50px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </span>
  </div>
);

const BrowserFrame: React.FC<{
  src: string;
  scale?: number;
  translateX?: number;
  translateY?: number;
  rotate?: number;
}> = ({ src, scale = 1, translateX = 0, translateY = 0, rotate = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 170,
      top: 145,
      width: 1580,
      height: 890,
      borderRadius: 30,
      overflow: "hidden",
      border: `1px solid ${COLORS.border}`,
      background: COLORS.surface,
      boxShadow: "0 45px 120px rgba(0, 0, 0, .58)",
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: "center center",
    }}
  >
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
        background: "#07101c",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      {[COLORS.danger, COLORS.amber, COLORS.green].map((color) => (
        <span
          key={color}
          style={{ width: 12, height: 12, borderRadius: 99, background: color }}
        />
      ))}
      <div
        style={{
          ...mono,
          marginLeft: 18,
          color: COLORS.muted,
          fontSize: 17,
        }}
      >
        ricardonp51.github.io/equaltrace-webmcp
      </div>
    </div>
    <Img
      src={staticFile(`screens/${src}`)}
      style={{
        width: "100%",
        height: 842,
        objectFit: "cover",
        objectPosition: "top",
      }}
    />
  </div>
);

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const image = interpolate(frame, [0, 450], [1.03, 1.1]);
  return (
    <Fade duration={450}>
      <Background accent="amber" />
      <Brand />
      <BrowserFrame
        src="01-opening-preview.png"
        scale={image}
        translateY={28}
      />
      <div
        style={{
          ...font,
          position: "absolute",
          left: 110,
          top: 150,
          width: 850,
          zIndex: 12,
          opacity: headline,
          transform: `translateY(${(1 - headline) * 38}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "10px 15px",
            borderRadius: 999,
            border: `1px solid ${COLORS.amber}77`,
            color: COLORS.amber,
            background: "rgba(5,9,17,.86)",
            fontSize: 20,
            fontWeight: 750,
            letterSpacing: 0.7,
            textTransform: "uppercase",
          }}
        >
          Outcome passed · protections failed
        </div>
        <div
          style={{
            marginTop: 24,
            color: COLORS.text,
            fontSize: 76,
            lineHeight: 0.98,
            fontWeight: 850,
            letterSpacing: -4.4,
            textShadow: "0 10px 40px rgba(0,0,0,.75)",
          }}
        >
          The agent got the right result.
          <br />
          <span style={{ color: COLORS.amber }}>It still failed.</span>
        </div>
      </div>
      <Caption>Equal outcomes can hide unequal protections.</Caption>
    </Fade>
  );
};

const RouteCard: React.FC<{
  label: string;
  source: string;
  score: string;
  tone: "green" | "danger";
  delay: number;
}> = ({ label, source, score, tone, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const color = tone === "green" ? COLORS.green : COLORS.danger;
  return (
    <div
      style={{
        ...font,
        width: 470,
        minHeight: 330,
        borderRadius: 28,
        border: `1px solid ${color}66`,
        background:
          "linear-gradient(145deg, rgba(13,25,41,.98), rgba(7,16,28,.98))",
        boxShadow: `0 28px 80px ${color}14`,
        padding: 38,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 60}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 20,
          textTransform: "uppercase",
        }}
      >
        {source}
      </div>
      <div
        style={{
          color: COLORS.text,
          fontSize: 44,
          fontWeight: 800,
          marginTop: 16,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color,
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: -5,
          marginTop: 42,
        }}
      >
        {score}
      </div>
      <div style={{ color: COLORS.soft, fontSize: 24 }}>
        semantic protections
      </div>
    </div>
  );
};

const RoutesScene: React.FC = () => (
  <Fade duration={690}>
    <Background />
    <Brand />
    <div
      style={{
        ...font,
        position: "absolute",
        left: 0,
        right: 0,
        top: 130,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: COLORS.cyan,
          fontSize: 23,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        One seed · one domain engine
      </div>
      <div
        style={{
          color: COLORS.text,
          fontSize: 68,
          fontWeight: 850,
          letterSpacing: -3,
          marginTop: 14,
        }}
      >
        Three real routes. One standard.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 185,
        right: 185,
        top: 330,
        display: "flex",
        gap: 42,
        justifyContent: "center",
      }}
    >
      <RouteCard
        label="Visual"
        source="Pointer"
        score="6/6"
        tone="green"
        delay={20}
      />
      <RouteCard
        label="Assistive"
        source="Keyboard"
        score="6/6"
        tone="green"
        delay={40}
      />
      <RouteCard
        label="Agent"
        source="Native WebMCP"
        score="2/6"
        tone="danger"
        delay={60}
      />
    </div>
    <Caption>
      All three reach deleted. Only the agent skips the journey.
    </Caption>
  </Fade>
);

const DivergenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 720], [1.01, 1.17], {
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(frame, [0, 720], [0, -95]);
  const y = interpolate(frame, [0, 720], [18, -34]);
  return (
    <Fade duration={720}>
      <Background accent="amber" />
      <Brand />
      <BrowserFrame
        src="02-first-divergence.png"
        scale={zoom}
        translateX={x}
        translateY={y}
      />
      <div
        style={{
          ...mono,
          position: "absolute",
          right: 80,
          top: 115,
          zIndex: 15,
          padding: "18px 22px",
          borderRadius: 16,
          color: COLORS.amber,
          background: "rgba(5,9,17,.93)",
          border: `1px solid ${COLORS.amber}66`,
          fontSize: 25,
          fontWeight: 750,
        }}
      >
        first divergence → disclosure.consequences
      </div>
      <Caption>
        EqualTrace stops at the earliest missing protection—not the final state.
      </Caption>
    </Fade>
  );
};

const ApprovalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 780], [1.03, 1.16], {
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(frame, [0, 780], [0, 95]);
  return (
    <Fade duration={780}>
      <Background accent="amber" />
      <Brand />
      <BrowserFrame
        src="03-human-approval-boundary.png"
        scale={scale}
        translateX={x}
        translateY={20}
      />
      <div
        style={{
          ...font,
          position: "absolute",
          left: 85,
          top: 150,
          zIndex: 14,
          width: 535,
          padding: 30,
          borderRadius: 24,
          border: `1px solid ${COLORS.amber}66`,
          background: "rgba(5,9,17,.94)",
          boxShadow: "0 24px 70px rgba(0,0,0,.5)",
        }}
      >
        <div
          style={{
            color: COLORS.amber,
            fontSize: 20,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Human authority boundary
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 46,
            lineHeight: 1.05,
            fontWeight: 850,
            marginTop: 15,
          }}
        >
          The agent can stage.
          <br />
          It cannot approve.
        </div>
        <div
          style={{
            ...mono,
            color: COLORS.muted,
            fontSize: 19,
            lineHeight: 1.5,
            marginTop: 24,
          }}
        >
          exact action · digest · seed · expiry
        </div>
      </div>
      <Caption>
        Before visible approval, the repair capability is absent.
      </Caption>
    </Fade>
  );
};

const ToolPill: React.FC<{
  name: string;
  active?: boolean;
  removed?: boolean;
}> = ({ name, active = false, removed = false }) => (
  <div
    style={{
      ...mono,
      borderRadius: 18,
      border: `1px solid ${active ? COLORS.green : COLORS.border}`,
      color: removed ? COLORS.muted : active ? COLORS.green : COLORS.soft,
      background: active ? "rgba(97,230,162,.08)" : COLORS.surface,
      padding: "20px 24px",
      fontSize: 21,
      textDecoration: removed ? "line-through" : "none",
      opacity: removed ? 0.48 : 1,
      boxShadow: active ? `0 0 36px ${COLORS.green}1f` : "none",
    }}
  >
    {name}
  </div>
);

const LifecycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const approved = frame >= 215;
  const used = frame >= 520;
  const count = used ? 4 : approved ? 5 : 4;
  const state = used
    ? "removed after use"
    : approved
      ? "available once"
      : "absent before approval";
  return (
    <Fade duration={780}>
      <Background accent={used ? "green" : approved ? "green" : "amber"} />
      <Brand />
      <div
        style={{
          ...font,
          position: "absolute",
          left: 150,
          top: 160,
          width: 650,
        }}
      >
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Native capability lifetime
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 70,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -4,
            marginTop: 22,
          }}
        >
          Authority changes the tool surface.
        </div>
        <div
          style={{
            color: COLORS.soft,
            fontSize: 31,
            lineHeight: 1.35,
            marginTop: 32,
          }}
        >
          Not a permission badge. A capability that does not exist until the
          exact repair is approved.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 145,
          top: 140,
          width: 780,
          borderRadius: 30,
          border: `1px solid ${COLORS.border}`,
          background: "rgba(7,16,28,.92)",
          padding: 34,
          boxShadow: "0 40px 110px rgba(0,0,0,.5)",
        }}
      >
        <div
          style={{
            ...font,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 800 }}>
            Discovered Site tools
          </div>
          <div
            style={{
              color: approved && !used ? COLORS.green : COLORS.amber,
              fontSize: 23,
              fontWeight: 850,
            }}
          >
            {count} tools · {state}
          </div>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <ToolPill name="equaltrace_run_agent_route" />
          <ToolPill name="equaltrace_run_audit" />
          <ToolPill name="equaltrace_stage_repair" />
          <ToolPill name="equaltrace_get_state" />
          {approved && !used && (
            <ToolPill name="equaltrace_apply_approved_repair" active />
          )}
          {used && (
            <div
              style={{
                ...mono,
                borderRadius: 18,
                border: `1px dashed ${COLORS.green}77`,
                color: COLORS.green,
                background: "rgba(97,230,162,.05)",
                padding: "20px 24px",
                fontSize: 19,
              }}
            >
              lifecycle event · apply capability removed
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          ...font,
          position: "absolute",
          left: 150,
          bottom: 155,
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: used ? COLORS.green : approved ? COLORS.green : COLORS.amber,
          fontSize: 28,
          fontWeight: 850,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 99,
            background: "currentColor",
            boxShadow: "0 0 30px currentColor",
          }}
        />
        {used
          ? "Replay blocked"
          : approved
            ? "Exact repair armed"
            : "Waiting for the human"}
      </div>
      <Caption>Absent → approved → invoked once → removed.</Caption>
    </Fade>
  );
};

const ReceiptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 750], [1.02, 1.14], {
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Fade duration={750}>
      <Background accent="green" />
      <Brand />
      <BrowserFrame src="04-verified-receipt.png" scale={zoom} translateY={8} />
      <div
        style={{
          ...font,
          position: "absolute",
          left: 98,
          top: 150,
          zIndex: 15,
          width: 575,
          padding: 30,
          borderRadius: 24,
          border: `1px solid ${COLORS.green}66`,
          background: "rgba(5,9,17,.94)",
        }}
      >
        <div
          style={{
            color: COLORS.green,
            fontSize: 22,
            fontWeight: 850,
            textTransform: "uppercase",
          }}
        >
          Fresh evidence only
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 48,
            lineHeight: 1.03,
            fontWeight: 900,
            marginTop: 14,
          }}
        >
          Same outcome.
          <br />
          Same six protections.
        </div>
        <div
          style={{ ...mono, color: COLORS.cyan, fontSize: 22, marginTop: 24 }}
        >
          SHA-256 parity receipt
        </div>
      </div>
      <Caption>
        The repaired routes rerun from a clean seed and produce portable proof.
      </Caption>
    </Fade>
  );
};

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  return (
    <Fade duration={330}>
      <Background />
      <div
        style={{
          ...font,
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `scale(${0.94 + enter * 0.06})`,
        }}
      >
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 28,
            fontWeight: 850,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          EqualTrace
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 92,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: -5,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Same action.
          <br />
          Same protections.
          <br />
          <span style={{ color: COLORS.green }}>Provable.</span>
        </div>
        <div
          style={{ ...mono, color: COLORS.muted, fontSize: 24, marginTop: 46 }}
        >
          ricardonp51.github.io/equaltrace-webmcp
        </div>
      </div>
    </Fade>
  );
};

export const EqualTraceLaunch: React.FC = () => (
  <AbsoluteFill style={{ ...font, background: COLORS.bg }}>
    <Audio src={staticFile("generated/soundbed.wav")} volume={0.12} />
    {scenes.map((scene) => (
      <Sequence
        key={scene.audio}
        from={scene.from}
        durationInFrames={scene.duration}
      >
        <Audio src={staticFile(`generated/${scene.audio}`)} volume={1} />
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={450}>
      <HookScene />
    </Sequence>
    <Sequence from={450} durationInFrames={690}>
      <RoutesScene />
    </Sequence>
    <Sequence from={1140} durationInFrames={720}>
      <DivergenceScene />
    </Sequence>
    <Sequence from={1860} durationInFrames={780}>
      <ApprovalScene />
    </Sequence>
    <Sequence from={2640} durationInFrames={780}>
      <LifecycleScene />
    </Sequence>
    <Sequence from={3420} durationInFrames={750}>
      <ReceiptScene />
    </Sequence>
    <Sequence from={4170} durationInFrames={330}>
      <ClosingScene />
    </Sequence>
  </AbsoluteFill>
);
