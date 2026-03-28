import { useState, useEffect, useCallback } from "react";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;800;900&display=swap",
    },
  ];
}

// Pokemon ordered roughly by name length (easy → hard)
const POKEMON = [
  { name: "MEW", id: 151 },
  { name: "ONIX", id: 95 },
  { name: "EEVEE", id: 133 },
  { name: "DITTO", id: 132 },
  { name: "MEOWTH", id: 52 },
  { name: "RAICHU", id: 26 },
  { name: "GENGAR", id: 94 },
  { name: "VULPIX", id: 37 },
  { name: "PSYDUCK", id: 54 },
  { name: "PIKACHU", id: 25 },
  { name: "SNORLAX", id: 143 },
  { name: "SQUIRTLE", id: 7 },
  { name: "BULBASAUR", id: 1 },
  { name: "CHARMANDER", id: 4 },
  { name: "JIGGLYPUFF", id: 39 },
];

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

// Deterministic confetti data (avoids hydration mismatch)
const CONFETTI_PIECES = [
  { left: 8, delay: 0.0, dur: 1.2, color: "#FF6B6B", round: true },
  { left: 18, delay: 0.1, dur: 1.0, color: "#FFE066", round: false },
  { left: 27, delay: 0.2, dur: 1.4, color: "#6BCB77", round: true },
  { left: 36, delay: 0.0, dur: 1.1, color: "#4D96FF", round: false },
  { left: 45, delay: 0.3, dur: 0.9, color: "#FF6BD6", round: true },
  { left: 55, delay: 0.1, dur: 1.3, color: "#FFE066", round: false },
  { left: 63, delay: 0.2, dur: 1.0, color: "#FF6B6B", round: true },
  { left: 72, delay: 0.0, dur: 1.2, color: "#6BCB77", round: false },
  { left: 82, delay: 0.3, dur: 1.4, color: "#4D96FF", round: true },
  { left: 91, delay: 0.1, dur: 1.1, color: "#FF6BD6", round: false },
  { left: 12, delay: 0.4, dur: 0.8, color: "#FFE066", round: true },
  { left: 22, delay: 0.0, dur: 1.5, color: "#FF6B6B", round: false },
  { left: 50, delay: 0.2, dur: 1.0, color: "#6BCB77", round: true },
  { left: 68, delay: 0.1, dur: 1.3, color: "#4D96FF", round: false },
  { left: 78, delay: 0.3, dur: 0.9, color: "#FF6BD6", round: true },
];

function playSound(type: "correct" | "wrong" | "complete") {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === "correct") {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "wrong") {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.connect(gain);
      osc.frequency.value = 180;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else {
      // Happy ascending fanfare
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.connect(gain);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.18);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.18);
      });
    }
  } catch {
    // Audio not supported — silently ignore
  }
}

export default function TypingPage() {
  const [pokemonIndex, setPokemonIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<number | null>(null);

  const pokemon = POKEMON[pokemonIndex % POKEMON.length];
  const nextLetter = celebrating ? null : pokemon.name[typed.length];
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

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
        setTimeout(() => setLastCorrect(null), 250);

        if (newTyped === pokemon.name) {
          playSound("complete");
          setCelebrating(true);
          setScore((s) => s + 1);
          setTimeout(() => {
            setCelebrating(false);
            setPokemonIndex((i) => i + 1);
            setTyped("");
          }, 2800);
        }
      } else {
        playSound("wrong");
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 350);
      }
    },
    [typed, pokemon, celebrating, nextLetter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      style={{
        fontFamily: "'Fredoka One', cursive",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Title + Score */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            color: "#FF6B6B",
            textShadow: "2px 2px 0 #FFD700, 4px 4px 0 rgba(0,0,0,0.1)",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          ⚡ Pokémon Typing! ⚡
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#FFF9C4",
            border: "3px solid #FFD700",
            borderRadius: "50px",
            padding: "6px 20px",
            marginTop: "8px",
            fontSize: "1.1rem",
            color: "#E65100",
            boxShadow: "0 3px 0 #FFD700",
          }}
        >
          <span>🏆</span>
          <span>Caught: {score} Pokémon!</span>
        </div>
      </div>

      {/* Main card */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          border: "4px solid #FFD700",
          padding: "24px 28px",
          width: "100%",
          maxWidth: "660px",
          boxShadow: "0 6px 0 #FFD700, 0 10px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {celebrating && <Confetti />}

        {/* Pokemon sprite */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "8px" }}>
          <img
            src={spriteUrl}
            alt={pokemon.name}
            width={130}
            height={130}
            style={{
              objectFit: "contain",
              display: "block",
              animation: celebrating
                ? "celebrateSpin 0.6s linear infinite"
                : wrongFlash
                ? "wiggle 0.35s ease"
                : "idleBounce 2.5s ease-in-out infinite",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              transition: "filter 0.2s",
            }}
          />
          {celebrating && (
            <div
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 70%)",
                animation: "glowPulse 0.5s ease infinite alternate",
              }}
            />
          )}
        </div>

        {/* Celebration or typing prompt */}
        {celebrating ? (
          <div
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              color: "#FF6B6B",
              animation: "popIn 0.3s ease",
              marginBottom: "16px",
            }}
          >
            🎉 You caught <strong>{pokemon.name}</strong>! 🎉
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "1rem",
              color: "#999",
              margin: "0 0 12px 0",
            }}
          >
            Type the name to catch it!
          </p>
        )}

        {/* Letter boxes */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {pokemon.name.split("").map((letter, i) => {
            const isDone = i < typed.length;
            const isCurrent = i === typed.length && !celebrating;
            const justPopped = i === lastCorrect;

            return (
              <div
                key={i}
                style={{
                  width: "clamp(42px, 7vw, 54px)",
                  height: "clamp(50px, 8vw, 62px)",
                  borderRadius: "14px",
                  border: `3px solid ${
                    isDone ? "#4CAF50" : isCurrent ? "#FF6B6B" : "#E0E0E0"
                  }`,
                  background: isDone
                    ? "#F1F8E9"
                    : isCurrent
                    ? "#FFF3F3"
                    : "#FAFAFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  fontWeight: "bold",
                  color: isDone ? "#388E3C" : isCurrent ? "#FF6B6B" : "#BDBDBD",
                  boxShadow: isDone
                    ? "0 4px 0 #A5D6A7"
                    : isCurrent
                    ? "0 4px 0 #FF8A80"
                    : "0 4px 0 #E0E0E0",
                  transform: justPopped
                    ? "scale(1.35)"
                    : isCurrent
                    ? "translateY(-4px)"
                    : "none",
                  transition: "transform 0.15s ease, background 0.2s, border-color 0.2s",
                  animation: isCurrent ? "currentPulse 1.2s ease-in-out infinite" : "none",
                }}
              >
                {isDone ? letter : isCurrent ? letter : "?"}
              </div>
            );
          })}
        </div>

        {/* "Press X" hint */}
        {!celebrating && nextLetter && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#FFF8E1",
              border: "2px solid #FFD54F",
              borderRadius: "50px",
              padding: "6px 20px",
              color: "#E65100",
              fontSize: "1rem",
            }}
          >
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              Press:
            </span>
            <span
              style={{
                fontSize: "1.8rem",
                display: "inline-block",
                animation: "keyHint 0.7s ease-in-out infinite alternate",
              }}
            >
              {nextLetter}
            </span>
          </div>
        )}
      </div>

      {/* Keyboard */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          border: "3px solid #E0E0E0",
          padding: "16px 20px",
          width: "100%",
          maxWidth: "660px",
          boxShadow: "0 4px 0 #E0E0E0",
        }}
      >
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              marginBottom: rowIdx < KEYBOARD_ROWS.length - 1 ? "5px" : 0,
            }}
          >
            {row.map((key) => {
              const isTarget = key === nextLetter && !celebrating;
              return (
                <div
                  key={key}
                  style={{
                    width: "clamp(30px, 5vw, 50px)",
                    height: "clamp(30px, 5vw, 50px)",
                    borderRadius: "8px",
                    border: `2px solid ${isTarget ? "#FF6B6B" : "#DDD"}`,
                    background: isTarget ? "#FFECEC" : "#F5F5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                    fontWeight: "bold",
                    color: isTarget ? "#FF6B6B" : "#777",
                    boxShadow: isTarget ? "0 3px 0 #FF8A80" : "0 3px 0 #CCC",
                    transform: isTarget ? "translateY(-3px)" : "none",
                    transition: "all 0.15s ease",
                    animation: isTarget ? "keyBounce 0.6s ease-in-out infinite alternate" : "none",
                  }}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {POKEMON.map((p, i) => (
          <div
            key={p.id}
            title={i < pokemonIndex % POKEMON.length ? p.name : "???"}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background:
                i < pokemonIndex % POKEMON.length
                  ? "#4CAF50"
                  : i === pokemonIndex % POKEMON.length
                  ? "#FF6B6B"
                  : "#E0E0E0",
              border: i === pokemonIndex % POKEMON.length ? "2px solid #FF6B6B" : "2px solid transparent",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes idleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px) rotate(-5deg); }
          60% { transform: translateX(10px) rotate(5deg); }
        }
        @keyframes celebrateSpin {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        @keyframes glowPulse {
          from { opacity: 0.6; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
        @keyframes currentPulse {
          0%, 100% { box-shadow: 0 4px 0 #FF8A80; }
          50% { box-shadow: 0 4px 12px #FF8A80; }
        }
        @keyframes keyHint {
          from { transform: scale(1); }
          to { transform: scale(1.2); }
        }
        @keyframes keyBounce {
          from { transform: translateY(-3px); }
          to { transform: translateY(-6px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(320px) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Confetti() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {CONFETTI_PIECES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: "10px",
            height: "10px",
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
