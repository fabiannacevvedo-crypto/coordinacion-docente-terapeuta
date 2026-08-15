import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, RotateCcw, Trophy, Star } from "lucide-react";

const EMOJIS = ["🐶", "🐱", "🦁", "🐸", "🐼", "🦊"];

export default function MemoriaCartas() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched((prev) => {
          const updated = [...prev, first, second];
          if (updated.length === cards.length) {
            setGameWon(true);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          }
          return updated;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="card" style={{
      background: "linear-gradient(180deg, #ffffff, #fdf4ff)",
      border: "3px solid #fbcfe8",
      borderRadius: "24px",
      padding: "25px",
      textAlign: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 className="font-fun" style={{ fontSize: "24px", color: "#db2777", margin: 0 }}>
            🧠 Memorama de Animalitos
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>¡Encuentra las parejas de amigos!</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ background: "#fdf2f8", padding: "6px 14px", borderRadius: "12px", fontWeight: "700", color: "#db2777" }}>
            ⭐ Movimientos: {moves}
          </div>
          <button onClick={initGame} className="btn btn-secondary" style={{ borderRadius: "12px" }}>
            <RotateCcw size={16} /> Reiniciar
          </button>
        </div>
      </div>

      {gameWon ? (
        <div style={{ padding: "30px 20px" }}>
          <Trophy size={64} color="#f59e0b" style={{ margin: "0 auto 15px", animation: "pulse 1s infinite" }} />
          <h2 className="font-fun" style={{ fontSize: "32px", color: "#16a34a" }}>¡Felicitaciones! 🎉</h2>
          <p style={{ fontSize: "16px", color: "#475569", marginBottom: "20px" }}>
            ¡Completaste el juego en solo <strong>{moves}</strong> intentos!
          </p>
          <button onClick={initGame} className="btn btn-fun">
            ¡Jugar otra vez! 🌟
          </button>
        </div>
      ) : (
        <div className="memory-grid">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            const isMatched = matched.includes(index);
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`memory-card ${!isFlipped ? "hidden" : ""} ${isMatched ? "matched" : ""}`}
              >
                {isFlipped ? card.emoji : "❓"}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
