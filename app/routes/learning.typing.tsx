import { useState, useEffect, useCallback } from "react";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap",
    },
  ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PokemonType =
  | "fire" | "water" | "grass" | "electric" | "psychic" | "ghost"
  | "normal" | "rock" | "fighting" | "dark" | "dragon" | "fairy"
  | "ice" | "steel" | "poison" | "ground" | "flying" | "bug";

type Pokemon = { name: string; id: number; type: PokemonType };

// ─── Type colour palette ──────────────────────────────────────────────────────

const TYPE_THEME: Record<PokemonType, { emoji: string; label: string; accent: string; bg: string; border: string; shadow: string }> = {
  fire:     { emoji: "🔥", label: "Fire",     accent: "#E65100", bg: "#FFF3E0", border: "#FF8C00", shadow: "#FF8C00" },
  water:    { emoji: "💧", label: "Water",     accent: "#1565C0", bg: "#E3F2FD", border: "#1976D2", shadow: "#1976D2" },
  grass:    { emoji: "🌿", label: "Grass",     accent: "#2E7D32", bg: "#E8F5E9", border: "#388E3C", shadow: "#388E3C" },
  electric: { emoji: "⚡", label: "Electric",  accent: "#E65100", bg: "#FFFDE7", border: "#FFC107", shadow: "#FFC107" },
  psychic:  { emoji: "🔮", label: "Psychic",   accent: "#880E4F", bg: "#FCE4EC", border: "#E91E63", shadow: "#E91E63" },
  ghost:    { emoji: "👻", label: "Ghost",     accent: "#4A148C", bg: "#EDE7F6", border: "#7B1FA2", shadow: "#7B1FA2" },
  normal:   { emoji: "⭐", label: "Normal",    accent: "#616161", bg: "#FAFAFA", border: "#9E9E9E", shadow: "#BDBDBD" },
  rock:     { emoji: "🪨", label: "Rock",      accent: "#4E342E", bg: "#EFEBE9", border: "#795548", shadow: "#8D6E63" },
  fighting: { emoji: "🥊", label: "Fighting",  accent: "#B71C1C", bg: "#FFEBEE", border: "#C62828", shadow: "#E53935" },
  dark:     { emoji: "🌑", label: "Dark",      accent: "#263238", bg: "#ECEFF1", border: "#455A64", shadow: "#607D8B" },
  dragon:   { emoji: "🐉", label: "Dragon",    accent: "#311B92", bg: "#EDE7F6", border: "#512DA8", shadow: "#673AB7" },
  fairy:    { emoji: "🌸", label: "Fairy",     accent: "#880E4F", bg: "#FCE4EC", border: "#D81B60", shadow: "#E91E63" },
  ice:      { emoji: "❄️", label: "Ice",       accent: "#006064", bg: "#E0F7FA", border: "#0097A7", shadow: "#00BCD4" },
  steel:    { emoji: "⚙️", label: "Steel",     accent: "#37474F", bg: "#ECEFF1", border: "#546E7A", shadow: "#78909C" },
  poison:   { emoji: "☠️", label: "Poison",    accent: "#6A1B9A", bg: "#F3E5F5", border: "#8E24AA", shadow: "#AB47BC" },
  ground:   { emoji: "🌍", label: "Ground",    accent: "#E65100", bg: "#FFF8E1", border: "#F9A825", shadow: "#FBC02D" },
  flying:   { emoji: "🦅", label: "Flying",    accent: "#283593", bg: "#E8EAF6", border: "#3949AB", shadow: "#5C6BC0" },
  bug:      { emoji: "🐛", label: "Bug",       accent: "#33691E", bg: "#F9FBE7", border: "#689F38", shadow: "#8BC34A" },
};

// ─── Pokemon list (35 total, ordered roughly easy → hard) ─────────────────────

const ALL_POKEMON: Pokemon[] = [
  // 3 letters
  { name: "MEW",       id: 151, type: "psychic"  },
  // 4 letters
  { name: "ONIX",      id: 95,  type: "rock"     },
  { name: "ABRA",      id: 63,  type: "psychic"  },
  { name: "SEEL",      id: 86,  type: "water"    },
  // 5 letters
  { name: "EEVEE",     id: 133, type: "normal"   },
  { name: "DITTO",     id: 132, type: "normal"   },
  { name: "RIOLU",     id: 447, type: "fighting" },
  { name: "BAGON",     id: 371, type: "dragon"   },
  { name: "TOGEPI",    id: 175, type: "fairy"    },
  { name: "TEPIG",     id: 498, type: "fire"     },
  { name: "SNIVY",     id: 495, type: "grass"    },
  // 6 letters
  { name: "MEOWTH",    id: 52,  type: "normal"   },
  { name: "RAICHU",    id: 26,  type: "electric" },
  { name: "GENGAR",    id: 94,  type: "ghost"    },
  { name: "VULPIX",    id: 37,  type: "fire"     },
  { name: "LAPRAS",    id: 131, type: "water"    },
  { name: "ESPEON",    id: 196, type: "psychic"  },
  { name: "PIPLUP",    id: 393, type: "water"    },
  { name: "SNORLAX",   id: 143, type: "normal"   },
  // 7 letters
  { name: "PSYDUCK",   id: 54,  type: "water"    },
  { name: "PIKACHU",   id: 25,  type: "electric" },
  { name: "UMBREON",   id: 197, type: "dark"     },
  { name: "LUCARIO",   id: 448, type: "fighting" },
  { name: "SYLVEON",   id: 700, type: "fairy"    },
  { name: "TOTODILE",  id: 158, type: "water"    },
  { name: "MAGIKARP",  id: 129, type: "water"    },
  // 8 letters
  { name: "ARCANINE",  id: 59,  type: "fire"     },
  { name: "SQUIRTLE",  id: 7,   type: "water"    },
  { name: "VENUSAUR",  id: 3,   type: "grass"    },
  { name: "TOGEKISS",  id: 468, type: "fairy"    },
  // 9 letters
  { name: "BULBASAUR", id: 1,   type: "grass"    },
  { name: "CHARIZARD", id: 6,   type: "fire"     },
  { name: "BLASTOISE", id: 9,   type: "water"    },
  { name: "DRAGONITE", id: 149, type: "dragon"   },
  { name: "GARDEVOIR", id: 282, type: "psychic"  },
  { name: "CYNDAQUIL", id: 155, type: "fire"     },
  { name: "CHIKORITA", id: 152, type: "grass"    },
  // 10 letters
  { name: "CHARMANDER", id: 4,  type: "fire"     },
  { name: "JIGGLYPUFF", id: 39, type: "normal"   },
];

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function getCheer(name: string): string {
  const cheers = [
    `${name}, YOU'RE AMAZING!! 🌟`,
    `${name} IS A POKEMON MASTER!! 🏆`,
    `SUPER COOL, ${name}!! 💥`,
    `FANTASTIC, ${name}!! 🎉`,
    `WOW WOW WOW, ${name}!! 🤩`,
    `INCREDIBLE, ${name}!! 🔥`,
    `${name} DID IT!! 💪`,
    `GENIUS TYPIST, ${name}!! 🧠`,
    `UNSTOPPABLE, ${name}!! ⚡`,
  ];
  return cheers[Math.floor(Math.random() * cheers.length)];
}

// Deterministic confetti (avoids SSR/client hydration mismatch)
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

// ─── Audio ────────────────────────────────────────────────────────────────────

function playSound(type: "correct" | "wrong" | "complete") {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === "correct") {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
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
      // Triumphant fanfare
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
    // Silently ignore if Web Audio is unavailable
  }
}

// ─── Sorted Pokemon list (easiest → hardest by name length) ───────────────────

const SORTED_POKEMON = [...ALL_POKEMON].sort((a, b) => a.name.length - b.name.length);

// ─── Component ────────────────────────────────────────────────────────────────

export default function TypingPage() {
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [pokemon] = useState<Pokemon[]>(SORTED_POKEMON);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [cheer, setCheer] = useState("");
  const [wrongFlash, setWrongFlash] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<number | null>(null);

  const current = pokemon[index % pokemon.length];
  const theme = TYPE_THEME[current.type];
  const nextLetter = celebrating ? null : current.name[typed.length];
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${current.id}.png`;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (celebrating) return;
      const key = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(key)) return;

      if (key === nextLetter) {
        playSound("correct");
        const newTyped = typed + key;
        setLastCorrect(typed.length);
        setTyped(newTyped);
        setTimeout(() => setLastCorrect(null), 220);

        if (newTyped === current.name) {
          playSound("complete");
          const newStreak = streak + 1;
          setStreak(newStreak);
          setScore((s) => s + 1);
          setCheer(getCheer(playerName));
          setCelebrating(true);
          setTimeout(() => {
            setCelebrating(false);
            setIndex((i) => i + 1);
            setTyped("");
          }, 2800);
        }
      } else {
        playSound("wrong");
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 380);
      }
    },
    [typed, current, celebrating, nextLetter, streak, playerName]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Name entry screen
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
          <div style={{ fontSize: "4rem", marginBottom: "8px" }}>⚡</div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              color: "#FF6B6B",
              textShadow: "2px 2px 0 #FFD700, 4px 4px 0 rgba(0,0,0,0.08)",
              margin: "0 0 6px 0",
              letterSpacing: "1px",
            }}
          >
            Pokémon Typing!
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.05rem", color: "#9E9E9E", margin: 0 }}>
            Who's ready to catch 'em all?
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            border: "4px solid #FFD700",
            padding: "28px 32px",
            maxWidth: "380px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 6px 0 #FFD700, 0 10px 24px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🎮</div>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#555",
              marginBottom: "16px",
            }}
          >
            Enter your name to start!
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = nameInput.trim().toUpperCase();
              if (trimmed) setPlayerName(trimmed);
            }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="YOUR NAME"
              maxLength={20}
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.5rem",
                textAlign: "center",
                textTransform: "uppercase",
                border: "3px solid #FFD700",
                borderRadius: "14px",
                padding: "10px 16px",
                outline: "none",
                color: "#E65100",
                background: "#FFFDE7",
                letterSpacing: "2px",
                boxShadow: "0 4px 0 #FFD700",
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
                background: nameInput.trim() ? "#FF6B6B" : "#E0E0E0",
                color: nameInput.trim() ? "white" : "#9E9E9E",
                border: "none",
                borderRadius: "50px",
                padding: "12px 32px",
                cursor: nameInput.trim() ? "pointer" : "default",
                boxShadow: nameInput.trim() ? "0 4px 0 #C62828" : "0 4px 0 #BDBDBD",
                transition: "all 0.15s ease",
                letterSpacing: "1px",
              }}
            >
              Let's Go! 🚀
            </button>
          </form>
        </div>

        <style>{`
          @keyframes popIn {
            0%   { transform: scale(0.6); opacity: 0; }
            75%  { transform: scale(1.12); }
            100% { transform: scale(1);   opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

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
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            color: "#FF6B6B",
            textShadow: "2px 2px 0 #FFD700, 4px 4px 0 rgba(0,0,0,0.08)",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          ⚡ {playerName}'s Pokémon Typing! ⚡
        </h1>

        {/* Score + Streak row */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "8px", flexWrap: "wrap" }}>
          <div style={pillStyle("#FFF9C4", "#FFD700", "#E65100")}>
            🏆 {playerName} caught: {score}
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

      {/* ── Main card ── */}
      <div
        style={{
          background: celebrating ? theme.bg : "white",
          borderRadius: "24px",
          border: `4px solid ${celebrating ? theme.border : "#FFD700"}`,
          padding: "20px 24px",
          width: "100%",
          maxWidth: "660px",
          boxShadow: `0 6px 0 ${celebrating ? theme.shadow : "#FFD700"}, 0 10px 24px rgba(0,0,0,0.1)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
        }}
      >
        {celebrating && <Confetti />}

        {/* Type badge */}
        <div style={{ marginBottom: "4px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: theme.border,
              color: "white",
              borderRadius: "50px",
              padding: "2px 12px",
              fontSize: "0.85rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              letterSpacing: "0.5px",
            }}
          >
            {theme.emoji} {theme.label}
          </span>
        </div>

        {/* Pokemon sprite */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "6px" }}>
          <img
            src={spriteUrl}
            alt={current.name}
            width={140}
            height={140}
            style={{
              objectFit: "contain",
              display: "block",
              animation: celebrating
                ? "celebrateSpin 0.55s linear infinite"
                : wrongFlash
                ? "wiggle 0.38s ease"
                : "idleBounce 2.4s ease-in-out infinite",
              filter: wrongFlash
                ? "drop-shadow(0 0 12px #FF5252) saturate(2)"
                : "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              transition: "filter 0.15s",
            }}
          />
          {celebrating && (
            <div
              style={{
                position: "absolute",
                inset: "-12px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${theme.border}55 0%, transparent 70%)`,
                animation: "glowPulse 0.45s ease infinite alternate",
              }}
            />
          )}
        </div>

        {/* Celebration message or prompt */}
        {celebrating ? (
          <div style={{ animation: "popIn 0.3s ease" }}>
            <div style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", color: theme.accent, fontWeight: "bold", marginBottom: "4px" }}>
              🎉 You caught <strong>{current.name}</strong>! 🎉
            </div>
            <div style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)", color: theme.accent }}>
              {cheer}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", color: "#9E9E9E", margin: "0 0 10px 0" }}>
            Type the name to catch it!
          </p>
        )}

        {/* Letter boxes */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", margin: "10px 0 12px" }}>
          {current.name.split("").map((letter, i) => {
            const isDone = i < typed.length;
            const isCurrent = i === typed.length && !celebrating;
            const justPopped = i === lastCorrect;

            return (
              <div
                key={i}
                style={{
                  width: "clamp(38px, 6.5vw, 52px)",
                  height: "clamp(46px, 7.5vw, 60px)",
                  borderRadius: "12px",
                  border: `3px solid ${isDone ? "#4CAF50" : isCurrent ? theme.border : "#E0E0E0"}`,
                  background: isDone ? "#F1F8E9" : isCurrent ? theme.bg : "#FAFAFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(1.3rem, 2.8vw, 1.8rem)",
                  fontWeight: "bold",
                  color: isDone ? "#388E3C" : isCurrent ? theme.accent : "#BDBDBD",
                  boxShadow: isDone ? "0 4px 0 #A5D6A7" : isCurrent ? `0 4px 0 ${theme.shadow}` : "0 4px 0 #E0E0E0",
                  transform: justPopped ? "scale(1.35)" : isCurrent ? "translateY(-4px)" : "none",
                  transition: "transform 0.12s ease, background 0.2s, border-color 0.2s",
                  animation: isCurrent ? "currentPulse 1.2s ease-in-out infinite" : "none",
                }}
              >
                {isDone ? letter : isCurrent ? letter : "?"}
              </div>
            );
          })}
        </div>

        {/* Press hint */}
        {!celebrating && nextLetter && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFF8E1",
              border: "2px solid #FFD54F",
              borderRadius: "50px",
              padding: "5px 18px",
              color: "#E65100",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>Press:</span>
            <span style={{ fontSize: "1.7rem", display: "inline-block", animation: "keyHint 0.65s ease-in-out infinite alternate" }}>
              {nextLetter}
            </span>
          </div>
        )}
      </div>

      {/* ── Keyboard ── */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "3px solid #E0E0E0",
          padding: "14px 18px",
          width: "100%",
          maxWidth: "660px",
          boxShadow: "0 4px 0 #E0E0E0",
        }}
      >
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: rowIdx < 2 ? "4px" : 0 }}
          >
            {row.map((key) => {
              const isTarget = key === nextLetter && !celebrating;
              return (
                <div
                  key={key}
                  style={{
                    width: "clamp(28px, 4.8vw, 48px)",
                    height: "clamp(28px, 4.8vw, 48px)",
                    borderRadius: "8px",
                    border: `2px solid ${isTarget ? theme.border : "#DDD"}`,
                    background: isTarget ? theme.bg : "#F5F5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(0.7rem, 1.4vw, 0.95rem)",
                    fontWeight: "bold",
                    color: isTarget ? theme.accent : "#777",
                    boxShadow: isTarget ? `0 3px 0 ${theme.shadow}` : "0 3px 0 #CCC",
                    transform: isTarget ? "translateY(-3px)" : "none",
                    transition: "all 0.15s ease",
                    animation: isTarget ? "keyBounce 0.55s ease-in-out infinite alternate" : "none",
                  }}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Progress ── */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "660px" }}>
        {pokemon.map((p, i) => {
          const done = i < index % pokemon.length;
          const active = i === index % pokemon.length;
          const t = TYPE_THEME[p.type];
          return (
            <div
              key={p.id}
              title={done ? p.name : active ? p.name : "???"}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: done ? t.border : active ? "#FF6B6B" : "#E0E0E0",
                border: `2px solid ${done ? t.shadow : active ? "#FF8A80" : "transparent"}`,
                transition: "background 0.3s, transform 0.3s",
                transform: active ? "scale(1.4)" : "none",
                boxShadow: active ? "0 0 6px #FF8A80" : "none",
              }}
            />
          );
        })}
      </div>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes idleBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(-12px) rotate(-2deg); }
          60% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-12px) rotate(-6deg); }
          60% { transform: translateX(12px) rotate(6deg); }
          80% { transform: translateX(-6px) rotate(-3deg); }
        }
        @keyframes celebrateSpin {
          from { transform: rotate(0deg) scale(1.15); }
          to   { transform: rotate(360deg) scale(1.15); }
        }
        @keyframes glowPulse {
          from { opacity: 0.5; transform: scale(0.88); }
          to   { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes currentPulse {
          0%, 100% { box-shadow: 0 4px 0 var(--shadow); }
          50%       { box-shadow: 0 4px 14px var(--shadow); }
        }
        @keyframes keyHint {
          from { transform: scale(1); }
          to   { transform: scale(1.22); }
        }
        @keyframes keyBounce {
          from { transform: translateY(-3px); }
          to   { transform: translateY(-7px); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          75%  { transform: scale(1.12); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(340px) rotate(600deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function pillStyle(bg: string, border: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: bg,
    border: `3px solid ${border}`,
    borderRadius: "50px",
    padding: "4px 16px",
    fontSize: "1rem",
    color,
    boxShadow: `0 3px 0 ${border}`,
  };
}

function Confetti() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 10 }}>
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confettiFall ${p.dur}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
