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

const C = {
  paper: "#ebe8de",
  paperWarm: "#ddd7c8",
  ink: "#101517",
  inkSoft: "#475055",
  cyan: "#0c96b5",
  cyanDark: "#075b70",
  green: "#118657",
  amber: "#c56b16",
  red: "#b93832",
  white: "#f8f6ef",
  dark: "#071019",
  rule: "rgba(16,21,23,.24)",
};

const sans: CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
};

const serif: CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const mono: CSSProperties = {
  fontFamily: 'Consolas, "Courier New", monospace',
};

type Cue = { from: number; to: number; text: string };

const fade = (frame: number, duration: number) =>
  interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const reveal = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const PaperTexture = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent 0, transparent 47px, rgba(16,21,23,.035) 48px), repeating-linear-gradient(90deg, transparent 0, transparent 47px, rgba(16,21,23,.025) 48px)",
    }}
  />
);

const RegistrationMarks = () => (
  <>
    {[
      { key: "top-left", left: 38, top: 38 },
      { key: "top-right", right: 38, top: 38 },
      { key: "bottom-left", left: 38, bottom: 38 },
      { key: "bottom-right", right: 38, bottom: 38 },
    ].map(({ key, ...position }, index) => (
      <div
        key={key}
        style={{
          position: "absolute",
          ...position,
          width: 28,
          height: 28,
          borderTop: `2px solid ${C.ink}`,
          borderLeft: `2px solid ${C.ink}`,
          transform:
            index === 1
              ? "rotate(90deg)"
              : index === 2
                ? "rotate(-90deg)"
                : index === 3
                  ? "rotate(180deg)"
                  : undefined,
          opacity: 0.42,
        }}
      />
    ))}
  </>
);

const Header: React.FC<{
  plate: string;
  title: string;
  status: string;
  tone?: "cyan" | "green" | "amber" | "red";
}> = ({ plate, title, status, tone = "cyan" }) => {
  const color = C[tone];
  return (
    <div
      style={{
        ...mono,
        position: "absolute",
        left: 84,
        right: 84,
        top: 50,
        height: 64,
        display: "grid",
        gridTemplateColumns: "240px 1fr auto",
        alignItems: "center",
        borderTop: `3px solid ${C.ink}`,
        borderBottom: `1px solid ${C.rule}`,
        color: C.ink,
        fontSize: 18,
        letterSpacing: 1.2,
        textTransform: "uppercase",
      }}
    >
      <div style={{ fontWeight: 800 }}>{plate}</div>
      <div style={{ color: C.inkSoft }}>{title}</div>
      <div style={{ color, fontWeight: 900 }}>{status}</div>
    </div>
  );
};

const Subtitle: React.FC<{ cues: Cue[]; frame: number }> = ({
  cues,
  frame,
}) => {
  const cue = cues.find(({ from, to }) => frame >= from && frame < to);
  if (!cue) return null;
  const local = frame - cue.from;
  const opacity = interpolate(
    local,
    [0, 5, Math.max(6, cue.to - cue.from - 5), cue.to - cue.from],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        ...sans,
        position: "absolute",
        left: 84,
        right: 84,
        bottom: 42,
        minHeight: 64,
        display: "grid",
        gridTemplateColumns: "188px 1fr",
        alignItems: "center",
        borderTop: `2px solid ${C.ink}`,
        background: C.paper,
        color: C.ink,
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          ...mono,
          color: C.cyanDark,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: 1.6,
          textTransform: "uppercase",
        }}
      >
        Narration
      </div>
      <div style={{ fontSize: 27, lineHeight: 1.25, fontWeight: 650 }}>
        {cue.text}
      </div>
    </div>
  );
};

const Screenshot: React.FC<{
  src: string;
  style?: CSSProperties;
  objectPosition?: string;
}> = ({ src, style, objectPosition = "center" }) => (
  <div
    style={{
      position: "absolute",
      overflow: "hidden",
      background: C.dark,
      border: `2px solid ${C.ink}`,
      boxShadow: "12px 14px 0 rgba(16,21,23,.15)",
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
      }}
    />
  </div>
);

const Trace: React.FC<{
  frame: number;
  start?: number;
  end?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ frame, start = 0, end = 30, color = C.cyan, style }) => (
  <div
    style={{
      position: "absolute",
      height: 5,
      background: color,
      transformOrigin: "left center",
      transform: `scaleX(${reveal(frame, start, end)})`,
      ...style,
    }}
  />
);

const Scene: React.FC<{
  duration: number;
  children: ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(frame, duration) }}>
      <PaperTexture />
      <RegistrationMarks />
      {children}
    </AbsoluteFill>
  );
};

const ColdOpen = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [0, 300], [-10, 55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Scene duration={300}>
      <Header
        plate="CASE ET-001"
        title="public release evidence"
        status="contract failure"
        tone="red"
      />
      <Screenshot
        src="screens/01-opening-preview.png"
        style={{ left: 84, top: 142, width: 1210, height: 756 }}
        objectPosition={`${scan}% 23%`}
      />
      <div
        style={{
          position: "absolute",
          left: 1350,
          right: 84,
          top: 142,
          height: 790,
          borderLeft: `5px solid ${C.red}`,
          paddingLeft: 34,
          color: C.ink,
        }}
      >
        <div
          style={{
            ...mono,
            color: C.red,
            fontSize: 22,
            fontWeight: 900,
            marginBottom: 28,
          }}
        >
          OUTCOME / DELETED
        </div>
        <div
          style={{
            ...serif,
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          Correct result.
          <br />
          Broken journey.
        </div>
        <div
          style={{
            ...sans,
            marginTop: 44,
            paddingTop: 24,
            borderTop: `1px solid ${C.rule}`,
            fontSize: 27,
            lineHeight: 1.35,
          }}
        >
          Final-state tests miss the protections an agent skipped before the
          action committed.
        </div>
        <div
          style={{
            ...mono,
            position: "absolute",
            bottom: 34,
            left: 34,
            color: C.inkSoft,
            fontSize: 18,
            lineHeight: 1.6,
          }}
        >
          fixture: equaltrace-golden-01
          <br />
          release: challenge-v1.0.0
        </div>
      </div>
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 12,
            to: 105,
            text: "The deletion succeeded. The protection contract did not.",
          },
          {
            from: 105,
            to: 220,
            text: "EqualTrace finds the gap a final-state test would miss.",
          },
        ]}
      />
    </Scene>
  );
};

const RouteRow: React.FC<{
  frame: number;
  start: number;
  route: string;
  mode: string;
  score: string;
  color: string;
  note: string;
}> = ({ frame, start, route, mode, score, color, note }) => {
  const progress = reveal(frame, start, start + 24);
  return (
    <div
      style={{
        position: "relative",
        height: 190,
        display: "grid",
        gridTemplateColumns: "250px 1fr 180px",
        alignItems: "center",
        borderTop: `2px solid ${C.ink}`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 18}px)`,
      }}
    >
      <div>
        <div
          style={{
            ...mono,
            color: C.inkSoft,
            fontSize: 18,
            textTransform: "uppercase",
          }}
        >
          {mode}
        </div>
        <div style={{ ...serif, fontSize: 43, fontWeight: 700 }}>{route}</div>
      </div>
      <div style={{ position: "relative", height: 80 }}>
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 24,
            top: 24,
            height: 2,
            background: C.ink,
            opacity: 0.25,
          }}
        />
        <Trace
          frame={frame}
          start={start + 8}
          end={start + 52}
          color={color}
          style={{ left: 12, right: 24, top: 23 }}
        />
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${4 + index * 18}%`,
              top: 12,
              width: 24,
              height: 24,
              borderRadius: 99,
              border: `3px solid ${color}`,
              background: index < Number(score[0]) ? color : C.paper,
            }}
          />
        ))}
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 12,
            bottom: 0,
            color: C.inkSoft,
            fontSize: 17,
          }}
        >
          {note}
        </div>
      </div>
      <div
        style={{
          ...sans,
          color,
          fontSize: 68,
          fontWeight: 900,
          textAlign: "right",
        }}
      >
        {score}
      </div>
    </div>
  );
};

const Routes = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={480}>
      <Header
        plate="PLATE 02 / ROUTES"
        title="one seed · one domain engine"
        status="same outcome"
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 145,
          bottom: 135,
          color: C.ink,
        }}
      >
        <div
          style={{
            ...serif,
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 34,
          }}
        >
          Three routes. One protection contract.
        </div>
        <RouteRow
          frame={frame}
          start={26}
          mode="pointer"
          route="Visual"
          score="6/6"
          color={C.green}
          note="disclosure → consent → feedback → reversibility → recovery → outcome"
        />
        <RouteRow
          frame={frame}
          start={78}
          mode="keyboard"
          route="Assistive"
          score="6/6"
          color={C.green}
          note="the same ordered semantic checkpoints"
        />
        <RouteRow
          frame={frame}
          start={130}
          mode="native WebMCP"
          route="Agent"
          score="2/6"
          color={C.red}
          note="same deletion outcome · four protections missing"
        />
      </div>
      <Subtitle
        frame={frame}
        cues={[
          { from: 10, to: 70, text: "One seed. One domain engine." },
          {
            from: 70,
            to: 190,
            text: "The visual and assistive routes preserve all six protections.",
          },
          {
            from: 190,
            to: 305,
            text: "Native WebMCP reaches the same outcome with only two.",
          },
        ]}
      />
    </Scene>
  );
};

const Divergence = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 540], [1.03, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Scene duration={540}>
      <Header
        plate="PLATE 03 / BREAK"
        title="recorded runtime evidence"
        status="first divergence"
        tone="amber"
      />
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 142,
          width: 1190,
          height: 744,
          overflow: "hidden",
          border: `2px solid ${C.ink}`,
          background: C.dark,
        }}
      >
        <Img
          src={staticFile("screens/02-first-divergence.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 62%",
            transform: `scale(${zoom})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1320,
          right: 84,
          top: 142,
          height: 790,
          color: C.ink,
        }}
      >
        <div style={{ ...mono, color: C.amber, fontSize: 22, fontWeight: 900 }}>
          CHECKPOINT 01
        </div>
        <div
          style={{
            ...serif,
            fontSize: 64,
            lineHeight: 1.02,
            fontWeight: 700,
            marginTop: 22,
          }}
        >
          Consequences came after commitment.
        </div>
        <div
          style={{
            ...mono,
            marginTop: 46,
            padding: "22px 0",
            borderTop: `2px solid ${C.ink}`,
            borderBottom: `1px solid ${C.rule}`,
            fontSize: 21,
            lineHeight: 1.5,
            color: C.red,
          }}
        >
          agent / disclosure.consequences
          <br />
          expected: before commit
          <br />
          observed: missing
        </div>
        <div
          style={{
            ...sans,
            marginTop: 34,
            fontSize: 28,
            lineHeight: 1.4,
          }}
        >
          EqualTrace stops at the earliest semantic break—not the final state.
        </div>
      </div>
      <Trace
        frame={frame}
        start={40}
        end={130}
        color={C.amber}
        style={{ left: 84, top: 918, width: 1190 }}
      />
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 12,
            to: 170,
            text: "The first break is concrete. The agent commits before consequences are disclosed.",
          },
          {
            from: 170,
            to: 300,
            text: "EqualTrace stops there and links the failure to recorded runtime evidence.",
          },
        ]}
      />
    </Scene>
  );
};

const Approval = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={600}>
      <Header
        plate="PLATE 04 / AUTHORITY"
        title="visible human review"
        status="tool absent"
        tone="amber"
      />
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 142,
          width: 445,
          bottom: 146,
          color: C.ink,
          borderRight: `2px solid ${C.ink}`,
          paddingRight: 38,
        }}
      >
        <div style={{ ...serif, fontSize: 58, lineHeight: 1, fontWeight: 700 }}>
          The agent proposes.
          <br />A person decides.
        </div>
        {[
          ["01", "Exact action"],
          ["02", "Consequence"],
          ["03", "Seed + digest"],
          ["04", "Expiry"],
        ].map(([number, label], index) => {
          const p = reveal(frame, 55 + index * 32, 80 + index * 32);
          return (
            <div
              key={number}
              style={{
                ...mono,
                display: "grid",
                gridTemplateColumns: "58px 1fr",
                gap: 12,
                padding: "19px 0",
                borderBottom: `1px solid ${C.rule}`,
                opacity: p,
                transform: `translateX(${(1 - p) * -16}px)`,
                fontSize: 21,
              }}
            >
              <div style={{ color: C.amber, fontWeight: 900 }}>{number}</div>
              <div>{label}</div>
            </div>
          );
        })}
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 0,
            bottom: 0,
            color: C.red,
            fontSize: 19,
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        >
          before approval / apply tool absent
        </div>
      </div>
      <Screenshot
        src="screens/03-human-approval-boundary.png"
        style={{ left: 575, right: 84, top: 142, bottom: 146 }}
        objectPosition="56% 45%"
      />
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 12,
            to: 115,
            text: "The agent can stage one exact repair. It cannot approve it.",
          },
          {
            from: 115,
            to: 280,
            text: "A person reviews the action, consequence, seed, digest, and expiry.",
          },
          {
            from: 280,
            to: 365,
            text: "Before that approval, the repair tool is absent.",
          },
        ]}
      />
    </Scene>
  );
};

const ToolSurface = () => {
  const frame = useCurrentFrame();
  const phase = frame < 180 ? 0 : frame < 390 ? 1 : 2;
  const labels = ["ABSENT", "AVAILABLE ONCE", "REMOVED"];
  const counts = [4, 5, 4];
  const colors = [C.amber, C.green, C.red];
  return (
    <Scene duration={600}>
      <Header
        plate="PLATE 05 / LIFETIME"
        title="native capability surface"
        status={labels[phase]}
        tone={phase === 1 ? "green" : phase === 2 ? "red" : "amber"}
      />
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 150,
          bottom: 148,
          color: C.ink,
        }}
      >
        <div style={{ ...serif, fontSize: 62, fontWeight: 700, width: 820 }}>
          Human authority changes what the agent can discover.
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 245,
            height: 4,
            background: C.ink,
          }}
        />
        {[0, 1, 2].map((index) => {
          const active = phase === index;
          const left = 85 + index * 615;
          return (
            <div
              key={labels[index]}
              style={{
                position: "absolute",
                left,
                top: 198,
                width: 420,
                color: active ? colors[index] : C.inkSoft,
                opacity: active ? 1 : 0.4,
              }}
            >
              <div
                style={{
                  width: 94,
                  height: 94,
                  borderRadius: 99,
                  background: active ? colors[index] : C.paper,
                  border: `5px solid ${active ? colors[index] : C.inkSoft}`,
                  display: "grid",
                  placeItems: "center",
                  color: active ? C.white : C.inkSoft,
                  ...sans,
                  fontSize: 44,
                  fontWeight: 900,
                }}
              >
                {counts[index]}
              </div>
              <div
                style={{
                  ...mono,
                  marginTop: 26,
                  fontSize: 21,
                  fontWeight: 900,
                }}
              >
                {index === 0
                  ? "T0 / 4 STABLE TOOLS"
                  : index === 1
                    ? "T1 / + APPLY REPAIR"
                    : "T2 / BACK TO 4"}
              </div>
              <div
                style={{
                  ...serif,
                  marginTop: 16,
                  fontSize: 38,
                  fontWeight: 700,
                }}
              >
                {labels[index]}
              </div>
            </div>
          );
        })}
        <div
          style={{
            ...mono,
            position: "absolute",
            left: 300,
            right: 300,
            bottom: 34,
            padding: "26px 30px",
            borderTop: `3px solid ${colors[phase]}`,
            borderBottom: `1px solid ${C.rule}`,
            fontSize: 24,
            textAlign: "center",
            color: colors[phase],
            fontWeight: 900,
          }}
        >
          {phase === 0
            ? "equaltrace_apply_approved_repair / NOT DISCOVERABLE"
            : phase === 1
              ? "equaltrace_apply_approved_repair / BOUND · ONE USE"
              : "REPLAY REJECTED / CAPABILITY ABORTED"}
        </div>
      </div>
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 12,
            to: 135,
            text: "Approval changes the native tool surface. Four tools become five.",
          },
          {
            from: 135,
            to: 235,
            text: "The bound repair runs once.",
          },
          {
            from: 235,
            to: 316,
            text: "Immediately, the surface returns to four and replay is blocked.",
          },
        ]}
      />
    </Scene>
  );
};

const Receipt = () => {
  const frame = useCurrentFrame();
  const items = [
    "disclosure",
    "consent",
    "feedback",
    "reversibility",
    "recovery",
    "outcome",
  ];
  return (
    <Scene duration={660}>
      <Header
        plate="PLATE 06 / PROOF"
        title="fresh routes · deterministic receipt"
        status="5 native runs"
        tone="green"
      />
      <Screenshot
        src="screens/04-verified-receipt.png"
        style={{ left: 84, top: 142, width: 1160, height: 725 }}
        objectPosition="52% 55%"
      />
      <div
        style={{
          position: "absolute",
          left: 1290,
          right: 84,
          top: 142,
          bottom: 146,
          color: C.ink,
        }}
      >
        <div style={{ ...mono, color: C.green, fontSize: 21, fontWeight: 900 }}>
          RECEIPT / 3EDF6503…44728
        </div>
        <div
          style={{
            ...serif,
            fontSize: 62,
            lineHeight: 1.02,
            fontWeight: 700,
            marginTop: 22,
          }}
        >
          Six protections survive every route.
        </div>
        <div style={{ marginTop: 34, borderTop: `2px solid ${C.ink}` }}>
          {items.map((item, index) => {
            const p = reveal(frame, 120 + index * 42, 148 + index * 42);
            return (
              <div
                key={item}
                style={{
                  ...mono,
                  display: "grid",
                  gridTemplateColumns: "42px 1fr auto",
                  alignItems: "center",
                  height: 58,
                  borderBottom: `1px solid ${C.rule}`,
                  fontSize: 19,
                  opacity: p,
                }}
              >
                <div style={{ color: C.green }}>✓</div>
                <div>{item}</div>
                <div style={{ color: C.green, fontWeight: 900 }}>PASS</div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...sans,
            marginTop: 30,
            paddingTop: 20,
            borderTop: `3px solid ${C.green}`,
            fontSize: 25,
            lineHeight: 1.35,
          }}
        >
          Same seed. Same domain engine. Same receipt across five consecutive
          native runs.
        </div>
      </div>
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 12,
            to: 160,
            text: "EqualTrace clears the old traces and reruns all three routes.",
          },
          {
            from: 160,
            to: 250,
            text: "Six protections now survive every path.",
          },
          {
            from: 250,
            to: 350,
            text: "Five consecutive native runs produce the same deterministic receipt.",
          },
        ]}
      />
    </Scene>
  );
};

const Close = () => {
  const frame = useCurrentFrame();
  const p = reveal(frame, 8, 50);
  return (
    <Scene duration={240}>
      <Header
        plate="EQUALTRACE"
        title="runtime protection parity for the agentic web"
        status="challenge-v1.0.0"
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 210,
          color: C.ink,
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        <div
          style={{
            ...serif,
            fontSize: 104,
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: -4,
          }}
        >
          No route gets
          <br />
          fewer protections.
        </div>
        <div
          style={{
            marginTop: 58,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: `4px solid ${C.ink}`,
          }}
        >
          {[
            ["05", "native runs"],
            ["01", "deterministic receipt"],
            ["06/06", "protections per route"],
          ].map(([value, label]) => (
            <div
              key={label}
              style={{
                padding: "28px 24px 0 0",
                borderRight: `1px solid ${C.rule}`,
              }}
            >
              <div
                style={{
                  ...sans,
                  color: C.cyanDark,
                  fontSize: 64,
                  fontWeight: 900,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  ...mono,
                  marginTop: 8,
                  fontSize: 20,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          ...mono,
          position: "absolute",
          left: 120,
          bottom: 126,
          color: C.inkSoft,
          fontSize: 22,
        }}
      >
        ricardonp51.github.io/equaltrace-webmcp
      </div>
      <Subtitle
        frame={frame}
        cues={[
          {
            from: 8,
            to: 110,
            text: "EqualTrace. Runtime protection parity for the agentic web.",
          },
          {
            from: 110,
            to: 190,
            text: "Five native runs. One receipt.",
          },
        ]}
      />
    </Scene>
  );
};

const audioScenes = [
  { from: 0, duration: 300, file: "v2-scene-01.wav" },
  { from: 300, duration: 480, file: "v2-scene-02.wav" },
  { from: 780, duration: 540, file: "v2-scene-03.wav" },
  { from: 1320, duration: 600, file: "v2-scene-04.wav" },
  { from: 1920, duration: 600, file: "v2-scene-05.wav" },
  { from: 2520, duration: 660, file: "v2-scene-06.wav" },
  { from: 3180, duration: 240, file: "v2-scene-07.wav" },
] as const;

export const EqualTraceEvidenceCut = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Audio src={staticFile("generated/soundbed-v2.wav")} volume={0.11} />
    {audioScenes.map((scene) => (
      <Sequence
        key={scene.file}
        from={scene.from}
        durationInFrames={scene.duration}
      >
        <Audio src={staticFile(`generated/${scene.file}`)} volume={1} />
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={300}>
      <ColdOpen />
    </Sequence>
    <Sequence from={300} durationInFrames={480}>
      <Routes />
    </Sequence>
    <Sequence from={780} durationInFrames={540}>
      <Divergence />
    </Sequence>
    <Sequence from={1320} durationInFrames={600}>
      <Approval />
    </Sequence>
    <Sequence from={1920} durationInFrames={600}>
      <ToolSurface />
    </Sequence>
    <Sequence from={2520} durationInFrames={660}>
      <Receipt />
    </Sequence>
    <Sequence from={3180} durationInFrames={240}>
      <Close />
    </Sequence>
  </AbsoluteFill>
);
