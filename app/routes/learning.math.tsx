import { useState, useEffect, useCallback } from "react";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap",
    },
  ];
}

export function meta() {
  return [
    { title: "Rocket Math — Learn Addition!" },
    { name: "description", content: "A fun rocket-themed addition game for kids" },
  ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase = "intro" | "decompose" | "add-ones" | "add-tens" | "answer" | "celebrate";

type RocketTheme = {
  name: string;
  emoji: string;
  dotColor: string;
  tenDotColor: string;
  tenBg: string;
  tenBorder: string;
  accent: string;
  bg: string;
  border: string;
  shadow: string;
};

type Problem = {
  a: number;
  b: number;
  bTens: number;
  bOnes: number;
  answer: number;
  theme: RocketTheme;
};

// ─── Themes ───────────────────────────────────────────────────────────────────

const ROCKET_THEMES: RocketTheme[] = [
  {
    name: "Rocket Red",
    emoji: "🚀",
    dotColor: "#FF5252",
    tenDotColor: "#FF7043",
    tenBg: "#FFF3E0",
    tenBorder: "#FF5722",
    accent: "#B71C1C",
    bg: "#FFEBEE",
    border: "#FF5252",
    shadow: "#EF9A9A",
  },
  {
    name: "UFO Blue",
    emoji: "🛸",
    dotColor: "#42A5F5",
    tenDotColor: "#1E88E5",
    tenBg: "#E3F2FD",
    tenBorder: "#1976D2",
    accent: "#0D47A1",
    bg: "#E3F2FD",
    border: "#42A5F5",
    shadow: "#90CAF9",
  },
  {
    name: "Moon Yellow",
    emoji: "🌕",
    dotColor: "#FFD740",
    tenDotColor: "#FFC107",
    tenBg: "#FFFDE7",
    tenBorder: "#F9A825",
    accent: "#E65100",
    bg: "#FFFDE7",
    border: "#FFD740",
    shadow: "#FFE082",
  },
  {
    name: "Saturn Purple",
    emoji: "🪐",
    dotColor: "#AB47BC",
    tenDotColor: "#8E24AA",
    tenBg: "#F3E5F5",
    tenBorder: "#7B1FA2",
    accent: "#4A148C",
    bg: "#F3E5F5",
    border: "#AB47BC",
    shadow: "#CE93D8",
  },
  {
    name: "Comet Green",
    emoji: "☄️",
    dotColor: "#66BB6A",
    tenDotColor: "#43A047",
    tenBg: "#E8F5E9",
    tenBorder: "#2E7D32",
    accent: "#1B5E20",
    bg: "#E8F5E9",
    border: "#66BB6A",
    shadow: "#A5D6A7",
  },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_PIECES = [
  { left: 5,  delay: 0.00, dur: 1.1, color: "#FF6B6B", round: true,  size: 12 },
  { left: 12, delay: 0.15, dur: 1.3, color: "#FFE066", round: false, size: 10 },
  { left: 20, delay: 0.05, dur: 1.0, color: "#6BCB77", round: true,  size: 14 },
  { left: 28, delay: 0.25, dur: 1.4, color: "#4D96FF", round: false, size: 8  },
  { left: 35, delay: 0.10, dur: 0.9, color: "#FF6BD6", round: true,  size: 11 },
  { left: 42, delay: 0.30, dur: 1.2, color: "#FFE066", round: false, size: 13 },
  { left: 50, delay: 0.00, dur: 1.1, color: "#FF6B6B", round: true,  size: 9  },
  { left: 57, delay: 0.20, dur: 1.3, color: "#6BCB77", round: false, size: 12 },
  { left: 64, delay: 0.10, dur: 1.0, color: "#4D96FF", round: true,  size: 10 },
  { left: 72, delay: 0.35, dur: 1.4, color: "#FF6BD6", round: false, size: 14 },
  { left: 80, delay: 0.05, dur: 1.2, color: "#FFE066", round: true,  size: 8  },
  { left: 88, delay: 0.25, dur: 0.9, color: "#FF6B6B", round: false, size: 11 },
  { left: 95, delay: 0.15, dur: 1.1, color: "#6BCB77", round: true,  size: 13 },
  { left: 8,  delay: 0.40, dur: 1.3, color: "#4D96FF", round: false, size: 9  },
  { left: 17, delay: 0.20, dur: 1.0, color: "#FF6BD6", round: true,  size: 12 },
  { left: 33, delay: 0.00, dur: 1.4, color: "#FFE066", round: false, size: 10 },
  { left: 47, delay: 0.30, dur: 1.1, color: "#FF6B6B", round: true,  size: 14 },
  { left: 60, delay: 0.10, dur: 0.9, color: "#6BCB77", round: false, size: 8  },
  { left: 75, delay: 0.45, dur: 1.2, color: "#4D96FF", round: true,  size: 11 },
  { left: 90, delay: 0.05, dur: 1.3, color: "#FF6BD6", round: false, size: 13 },
];

// ─── Dot cluster layouts ───────────────────────────────────────────────────────

// [x, y] offsets from center (px) for 0–9 dots
const DOT_OFFSETS: [number, number][][] = [
  [],
  [[0, 0]],
  [[-13, 0], [13, 0]],
  [[0, -13], [-13, 9], [13, 9]],
  [[-13, -13], [13, -13], [-13, 13], [13, 13]],
  [[0, -18], [-16, -4], [16, -4], [-10, 14], [10, 14]],
  [[-18, -13], [0, -15], [18, -13], [-18, 13], [0, 15], [18, 13]],
  [[0, -20], [-18, -9], [18, -9], [-20, 9], [20, 9], [-10, 19], [10, 19]],
  [[-20, -15], [0, -19], [20, -15], [-22, 1], [22, 1], [-16, 17], [0, 19], [16, 17]],
  [[-20, -17], [0, -19], [20, -17], [-22, 0], [0, 0], [22, 0], [-20, 17], [0, 19], [20, 17]],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCheer(name: string): string {
  const cheers = [
    `MISSION COMPLETE, ${name}!! 🚀`,
    `${name} IS AN ASTRONAUT!! 🛸`,
    `BLAST OFF, ${name}!! ☄️`,
    `STELLAR WORK, ${name}!! 🌕`,
    `${name} CONQUERED SPACE!! 🪐`,
    `OUT OF THIS WORLD, ${name}!! ✨`,
    `${name} IS A MATH HERO!! 🚀`,
    `INCREDIBLE, ${name}!! 🌌`,
  ];
  return cheers[Math.floor(Math.random() * cheers.length)];
}

function generateProblem(streak: number, prev?: Problem): Problem {
  const aMax = streak < 5 ? 5 : 9;
  const bMax = streak < 5 ? 19 : 29;
  let a: number, b: number;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    a = Math.floor(Math.random() * aMax) + 1;
    b = Math.floor(Math.random() * (bMax - 11 + 1)) + 11;
    if (b % 10 !== 0 && !(prev != null && a === prev.a && b === prev.b)) break;
  }
  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;
  const prevIdx = prev ? ROCKET_THEMES.findIndex((t) => t.name === prev.theme.name) : -1;
  const themeIdx =
    (prevIdx + 1 + Math.floor(Math.random() * (ROCKET_THEMES.length - 1))) %
    ROCKET_THEMES.length;
  return { a, b, bTens, bOnes, answer: a + b, theme: ROCKET_THEMES[themeIdx] };
}

function playSound(type: "step" | "wrong" | "complete") {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    if (type === "step") {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.frequency.value = 784;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "wrong") {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.connect(gain);
      osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else {
      [523, 659, 784, 1047, 1319].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.connect(gain);
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    }
  } catch {
    // ignore
  }
}

function pillStyle(
  bg: string,
  border: string,
  color: string
): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: bg,
    border: `2px solid ${border}`,
    borderRadius: "50px",
    padding: "4px 14px",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    color,
    letterSpacing: "0.5px",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Confetti() {
  return (
    <>
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confettiFall ${p.dur}s ease-in ${p.delay}s both`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function DotGroup({
  count,
  color,
  wrapAnim,
  showCount = false,
}: {
  count: number;
  color: string;
  wrapAnim?: string;
  showCount?: boolean;
}) {
  const clampedCount = Math.min(Math.max(count, 0), 9);
  const offsets = DOT_OFFSETS[clampedCount];
  const size = clampedCount <= 2 ? 54 : clampedCount <= 4 ? 66 : clampedCount <= 6 ? 80 : 94;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        animation: wrapAnim,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        {offsets.map(([dx, dy], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(${dx - 9}px, ${dy - 9}px)`,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 3px rgba(0,0,0,0.15)`,
              animation: `dotPop 0.3s ease ${i * 55}ms both`,
            }}
          />
        ))}
      </div>
      {showCount && (
        <div
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.3rem",
            color,
            textShadow: "1px 1px 0 rgba(0,0,0,0.1)",
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}

function TenBar({
  theme,
  wrapAnim,
  numTens = 1,
  dimmed = false,
}: {
  theme: RocketTheme;
  wrapAnim?: string;
  numTens?: number;
  dimmed?: boolean;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        animation: wrapAnim,
        opacity: dimmed ? 0.4 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: "0.78rem",
          color: "#777",
        }}
      >
        🚀 {numTens === 1 ? "10 fuel cells!" : "20 fuel cells!"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Array.from({ length: numTens }).map((_, bi) => (
          <div
            key={bi}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              background: theme.tenBg,
              border: `3px solid ${theme.tenBorder}`,
              borderRadius: 12,
              padding: "6px 8px",
              boxShadow: `0 3px 0 ${theme.tenBorder}`,
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: theme.tenDotColor,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                  animation: `twinkle ${1.2 + i * 0.08}s ease-in-out ${
                    i * 55
                  }ms infinite`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NumPill({
  num,
  theme,
  big = false,
  wrapAnim,
}: {
  num: number;
  theme: RocketTheme;
  big?: boolean;
  wrapAnim?: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: big
          ? "clamp(2.8rem, 9vw, 4.5rem)"
          : "clamp(1.8rem, 5vw, 2.6rem)",
        color: theme.accent,
        background: theme.bg,
        border: `4px solid ${theme.border}`,
        borderRadius: 18,
        padding: big ? "8px 24px" : "6px 18px",
        boxShadow: `0 4px 0 ${theme.shadow}`,
        lineHeight: 1,
        animation: wrapAnim,
      }}
    >
      {num}
    </div>
  );
}

function NumberPad({
  onDigit,
  onBackspace,
  onSubmit,
  value,
  wrongFlash,
  theme,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  value: string;
  wrongFlash: boolean;
  theme: RocketTheme;
}) {
  const rows = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["⌫", "0", "✓"],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Answer display */}
      <div
        style={{
          width: 96,
          height: 64,
          border: `4px solid ${wrongFlash ? "#FF5252" : theme.border}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.4rem",
          fontFamily: "'Fredoka One', cursive",
          color: wrongFlash ? "#FF5252" : theme.accent,
          background: wrongFlash ? "#FFEBEE" : "white",
          boxShadow: `0 5px 0 ${wrongFlash ? "#FFCDD2" : theme.shadow}`,
          transition: "border-color 0.15s, background 0.15s, color 0.15s",
          animation: wrongFlash ? "answerShake 0.4s ease" : "none",
        }}
      >
        {value || "?"}
      </div>
      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          animation: wrongFlash ? "answerShake 0.4s ease" : "none",
        }}
      >
        {rows.flat().map((key) => {
          const isSubmit = key === "✓";
          const isBack = key === "⌫";
          return (
            <button
              key={key}
              className="numpad-btn"
              onClick={() => {
                if (isBack) onBackspace();
                else if (isSubmit) onSubmit();
                else onDigit(key);
              }}
              style={{
                width: "clamp(52px, 12vw, 68px)",
                height: "clamp(52px, 12vw, 68px)",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                fontFamily: "'Fredoka One', cursive",
                borderRadius: 14,
                border: `3px solid ${
                  isSubmit ? "#4CAF50" : isBack ? "#FF9800" : theme.border
                }`,
                background: isSubmit ? "#E8F5E9" : isBack ? "#FFF8E1" : "white",
                color: isSubmit ? "#2E7D32" : isBack ? "#E65100" : theme.accent,
                boxShadow: `0 4px 0 ${
                  isSubmit ? "#A5D6A7" : isBack ? "#FFE082" : theme.shadow
                }`,
                cursor: "pointer",
              }}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MathPage() {
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [problem, setProblem] = useState<Problem | null>(null);
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [problemKey, setProblemKey] = useState(0);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [wrongFlash, setWrongFlash] = useState(false);
  const [cheer, setCheer] = useState("");

  // SSR-safe: generate first problem only on client
  useEffect(() => {
    setProblem(generateProblem(0));
  }, []);

  // No auto-advance for decompose / add-ones / add-tens — user clicks Next to proceed

  // celebrate → next problem
  useEffect(() => {
    if (phase !== "celebrate") return;
    const t = setTimeout(() => {
      setProblem((prev) => generateProblem(streak, prev ?? undefined));
      setProblemKey((k) => k + 1);
      setPhase("intro");
      setAnswerInput("");
    }, 2800);
    return () => clearTimeout(t);
  }, [phase, streak]);

  const handleDigit = useCallback((d: string) => {
    setAnswerInput((prev) => (prev.length >= 2 ? prev : prev + d));
  }, []);

  const handleBackspace = useCallback(() => {
    setAnswerInput((prev) => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!answerInput || !problem) return;
    const guess = parseInt(answerInput, 10);
    if (guess === problem.answer) {
      playSound("complete");
      setScore((s) => s + 1);
      setStreak((k) => k + 1);
      setCheer(getCheer(playerName));
      setPhase("celebrate");
    } else {
      playSound("wrong");
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setAnswerInput("");
      }, 500);
    }
  }, [answerInput, problem, playerName]);

  // Keyboard support during answer phase
  useEffect(() => {
    if (phase !== "answer") return;
    const handler = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) handleDigit(e.key);
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleDigit, handleBackspace, handleSubmit]);

  // ── Name entry ─────────────────────────────────────────────────────────────
  if (!playerName) {
    return (
      <div
        style={{
          fontFamily: "'Fredoka One', cursive",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "8px",
              animation: "float 2s ease-in-out infinite",
              display: "inline-block",
            }}
          >
            🚀
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              color: "#1A237E",
              textShadow: "2px 2px 0 #FF5252, 4px 4px 0 rgba(0,0,0,0.08)",
              margin: "0 0 6px 0",
              letterSpacing: "1px",
            }}
          >
            Rocket Math!
          </h1>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "1.05rem",
              color: "#9E9E9E",
              margin: 0,
            }}
          >
            Fly through space solving math problems! 🛸
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            border: "4px solid #FF5252",
            padding: "28px 32px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 6px 0 #FF5252, 0 10px 24px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🧑‍🚀</div>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#555",
              marginBottom: "16px",
            }}
          >
            What&apos;s your name, astronaut?
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = nameInput.trim();
              if (trimmed) setPlayerName(trimmed);
            }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              autoFocus
              type="text"
              autoComplete="off"
              data-1p-ignore
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                textAlign: "center",
                border: "3px solid #FF5252",
                borderRadius: "14px",
                padding: "10px 16px",
                outline: "none",
                color: "#B71C1C",
                background: "#FFEBEE",
                letterSpacing: "1px",
                boxShadow: "0 4px 0 #FF5252",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.25rem",
                background: nameInput.trim() ? "#FF5252" : "#E0E0E0",
                color: nameInput.trim() ? "white" : "#9E9E9E",
                border: "none",
                borderRadius: "50px",
                padding: "12px 32px",
                cursor: nameInput.trim() ? "pointer" : "default",
                boxShadow: nameInput.trim()
                  ? "0 4px 0 #B71C1C"
                  : "0 4px 0 #BDBDBD",
                transition: "all 0.15s ease",
                letterSpacing: "1px",
              }}
            >
              Blast Off! 🚀
            </button>
          </form>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  if (!problem) return null;

  const { a, b, bTens, bOnes, answer, theme } = problem;
  const numTens = bTens / 10;
  const midResult = a + bOnes;

  const PHASE_LABELS: Record<GamePhase, string> = {
    intro: "🚀 Let's solve this together!",
    decompose: `💥 Break it apart!  ${b} = ${bTens} + ${bOnes}`,
    "add-ones": `🛸 Add the ones first!  ${a} + ${bOnes} = ?`,
    "add-tens": `🚀 Now add the tens!  ${midResult} + ${bTens} = ?`,
    answer: "🎯 What's the answer, astronaut?",
    celebrate: "",
  };

  return (
    <div
      style={{
        fontFamily: "'Fredoka One', cursive",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            color: "#1A237E",
            textShadow: "2px 2px 0 #FF5252, 3px 3px 0 rgba(0,0,0,0.08)",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          🚀 {playerName}&apos;s Rocket Math! 🚀
        </h1>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginTop: "8px",
            flexWrap: "wrap",
          }}
        >
          <div style={pillStyle("#FFF3E0", "#FF5252", "#B71C1C")}>
            🏆 Solved: {score}
          </div>
          {streak >= 2 && (
            <div
              style={{
                ...pillStyle("#FFF3E0", "#FF8C00", "#BF360C"),
                animation: "popIn 0.25s ease",
              }}
            >
              🔥 Streak: {streak}!
            </div>
          )}
        </div>
      </div>

      {/* ── Main card — keyed on problemKey to reset all CSS animations on new problem ── */}
      <div
        key={problemKey}
        style={{
          background: phase === "celebrate" ? theme.bg : "white",
          borderRadius: "24px",
          border: `4px solid ${theme.border}`,
          padding: "20px 24px",
          width: "100%",
          maxWidth: "660px",
          boxShadow: `0 6px 0 ${theme.shadow}, 0 10px 24px rgba(0,0,0,0.1)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s",
        }}
      >
        {phase === "celebrate" && <Confetti />}

        {/* Theme badge */}
        <div style={{ marginBottom: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: theme.border,
              color: "white",
              borderRadius: "50px",
              padding: "2px 14px",
              fontSize: "0.85rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
            }}
          >
            {theme.emoji} {theme.name}
          </span>
        </div>

        {/* Equation */}
        <div
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3em",
            flexWrap: "wrap",
            marginBottom: "4px",
          }}
        >
          <span style={{ color: theme.dotColor }}>{a}</span>
          <span style={{ color: "#aaa" }}>+</span>
          <span style={{ color: theme.accent }}>{b}</span>
          <span style={{ color: "#aaa" }}>=</span>
          <span
            style={{
              color: phase === "celebrate" ? theme.dotColor : "#ddd",
              animation:
                phase === "celebrate" ? "resultReveal 0.5s ease both" : "none",
            }}
          >
            {phase === "celebrate" ? answer : "?"}
          </span>
        </div>

        {/* Phase label — keyed on phase so it re-animates on every phase change */}
        {phase !== "celebrate" && (
          <div
            key={phase + "-label"}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
              color: "#555",
              marginBottom: "16px",
              animation: "fadeSlideUp 0.35s ease both",
              minHeight: "1.4em",
            }}
          >
            {PHASE_LABELS[phase]}
          </div>
        )}

        {/* ── Visuals area — keyed on phase to reset dot entry animations ── */}
        <div
          key={phase + "-vis"}
          style={{
            minHeight: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {/* ── INTRO ── */}
          {phase === "intro" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(14px, 4vw, 28px)",
                  flexWrap: "wrap",
                }}
              >
                <DotGroup
                  count={a}
                  color={theme.dotColor}
                  wrapAnim="float 2s ease-in-out infinite"
                  showCount
                />
                <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#bbb" }}>+</span>
                <div
                  style={{ animation: "float 2.3s ease-in-out 0.3s infinite" }}
                >
                  <NumPill num={b} theme={theme} big />
                </div>
              </div>
              <button
                onClick={() => setPhase("decompose")}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                  background: "#FF5252",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "14px 36px",
                  cursor: "pointer",
                  boxShadow: "0 5px 0 #B71C1C",
                  letterSpacing: "1px",
                  animation: "popIn 0.4s ease 0.3s both",
                  marginTop: 8,
                }}
              >
                Blast Off! 🚀
              </button>
            </>
          )}

          {/* ── DECOMPOSE ── */}
          {phase === "decompose" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              {/* Top row: a-dots + b fading out */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(14px, 4vw, 28px)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <DotGroup count={a} color={theme.dotColor} showCount />
                <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#bbb" }}>+</span>
                <div style={{ animation: "fadeOutShrink 0.7s ease 0.6s both" }}>
                  <NumPill num={b} theme={theme} big />
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  color: "#aaa",
                  animation: "fadeIn 0.4s ease 1.1s both",
                  opacity: 0,
                }}
              >
                ↓ splits into ↓
              </div>

              {/* Bottom row: TenBar + bOnes dots */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(12px, 3vw, 22px)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <TenBar
                  theme={theme}
                  numTens={numTens}
                  wrapAnim="decomposeAppear 0.65s ease 1.3s both"
                />
                <div
                  style={{
                    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                    color: "#bbb",
                    animation: "fadeIn 0.4s ease 1.6s both",
                    opacity: 0,
                  }}
                >
                  +
                </div>
                <DotGroup
                  count={bOnes}
                  color={theme.dotColor}
                  wrapAnim="decomposeAppear 0.65s ease 1.6s both"
                  showCount
                />
              </div>

              {/* Next button — appears after animations settle */}
              <button
                onClick={() => { playSound("step"); setPhase("add-ones"); }}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  background: theme.border,
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  boxShadow: `0 4px 0 ${theme.accent}`,
                  letterSpacing: "1px",
                  animation: "fadeSlideUp 0.4s ease 2.2s both",
                  opacity: 0,
                  marginTop: 4,
                }}
              >
                Got it! Next 🛸
              </button>
            </div>
          )}

          {/* ── ADD-ONES ── */}
          {phase === "add-ones" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              {/* a-dots + bOnes-dots — fade out after 1.6s */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(14px, 4vw, 28px)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  animation: "fadeOutShrink 0.6s ease 1.6s both",
                }}
              >
                <DotGroup count={a} color={theme.dotColor} showCount />
                <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#bbb" }}>+</span>
                <DotGroup count={bOnes} color={theme.dotColor} showCount />
              </div>

              {/* Result appears */}
              <div
                style={{
                  animation: "resultReveal 0.6s ease 2.0s both",
                  opacity: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    color: "#888",
                  }}
                >
                  {a} + {bOnes} =
                </div>
                <NumPill num={midResult} theme={theme} big />
              </div>

              {/* TenBar idle — dimmed */}
              <TenBar theme={theme} numTens={numTens} dimmed />

              {/* Next button */}
              <button
                onClick={() => { playSound("step"); setPhase("add-tens"); }}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  background: theme.border,
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  boxShadow: `0 4px 0 ${theme.accent}`,
                  letterSpacing: "1px",
                  animation: "fadeSlideUp 0.4s ease 2.7s both",
                  opacity: 0,
                  marginTop: 4,
                }}
              >
                Nice! Next 🚀
              </button>
            </div>
          )}

          {/* ── ADD-TENS ── */}
          {phase === "add-tens" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              {/* midResult + TenBar — fade out */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(14px, 4vw, 28px)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  animation: "fadeOutShrink 0.6s ease 1.6s both",
                }}
              >
                <NumPill num={midResult} theme={theme} />
                <span style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#bbb" }}>+</span>
                <TenBar theme={theme} numTens={numTens} />
              </div>

              {/* Final answer appears */}
              <div
                style={{
                  animation: "resultReveal 0.6s ease 2.0s both",
                  opacity: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    color: "#888",
                  }}
                >
                  {midResult} + {bTens} =
                </div>
                <NumPill num={answer} theme={theme} big />
              </div>

              {/* Now try it yourself button */}
              <button
                onClick={() => { setPhase("answer"); setAnswerInput(""); }}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 32px",
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #2E7D32",
                  letterSpacing: "1px",
                  animation: "fadeSlideUp 0.4s ease 2.7s both",
                  opacity: 0,
                  marginTop: 4,
                }}
              >
                Now I try it! 🎯
              </button>
            </div>
          )}

          {/* ── ANSWER ── */}
          {phase === "answer" && (
            <NumberPad
              value={answerInput}
              onDigit={handleDigit}
              onBackspace={handleBackspace}
              onSubmit={handleSubmit}
              wrongFlash={wrongFlash}
              theme={theme}
            />
          )}

          {/* ── CELEBRATE ── */}
          {phase === "celebrate" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: "clamp(3rem, 10vw, 5rem)",
                  animation: "celebrateSpin 0.55s linear infinite",
                  display: "inline-block",
                }}
              >
                🚀
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
                  color: theme.accent,
                  textShadow: `2px 2px 0 ${theme.shadow}`,
                  animation: "popIn 0.4s ease both",
                }}
              >
                {cheer}
              </div>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#888",
                }}
              >
                {a} + {b} = {answer} ✓
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0%   { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes fadeOutShrink {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.7); }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes decomposeAppear {
          0%   { transform: translateY(24px) scale(0.65); opacity: 0; }
          60%  { transform: translateY(-5px) scale(1.08); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes resultReveal {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes celebrateSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes answerShake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-12px) rotate(-2deg); }
          50%      { transform: translateX(12px) rotate(2deg); }
          80%      { transform: translateX(-8px); }
        }
        @keyframes dotPop {
          0%   { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
          70%  { transform: translate(var(--dx), var(--dy)) scale(1.2); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(600deg); opacity: 0; }
        }
        .numpad-btn:active {
          transform: scale(0.92) translateY(2px) !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
