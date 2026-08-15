import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, RotateCcw } from "lucide-react";

const FIGURAS = [
  { id: 1, forma: "⭐ Estrella", color: "Amarillo", emoji: "⭐", tipoForma: "estrella", tipoColor: "amarillo" },
  { id: 2, forma: "🔴 Círculo", color: "Rojo", emoji: "🔴", tipoForma: "circulo", tipoColor: "rojo" },
  { id: 3, forma: "🔷 Rombo", color: "Azul", emoji: "🔷", tipoForma: "rombo", tipoColor: "azul" },
  { id: 4, forma: "🟢 Círculo", color: "Verde", emoji: "🟢", tipoForma: "circulo", tipoColor: "verde" },
  { id: 5, forma: "💛 Corazón", color: "Amarillo", emoji: "💛", tipoForma: "corazon", tipoColor: "amarillo" },
  { id: 6, forma: "🟦 Cuadrado", color: "Azul", emoji: "🟦", tipoForma: "cuadrado", tipoColor: "azul" },
  { id: 7, forma: "🍎 Manzana", color: "Rojo", emoji: "🍎", tipoForma: "fruta", tipoColor: "rojo" },
  { id: 8, forma: "🐸 Ranita", color: "Verde", emoji: "🐸", tipoForma: "animal", tipoColor: "verde" },
];

const DESAFIOS = [
  { consigna: "Toca todos los objetos de color ROJO 🔴", campo: "tipoColor", valor: "rojo" },
  { consigna: "Encuentra todos los CÍRCULOS ⚪", campo: "tipoForma", valor: "circulo" },
  { consigna: "Toca todos los objetos de color VERDE 🟢", campo: "tipoColor", valor: "verde" },
  { consigna: "Encuentra los objetos de color AMARILLO 💛", campo: "tipoColor", valor: "amarillo" },
];

export default function ColoresYFormas() {
  const [desafioIndex, setDesafioIndex] = useState(0);
  const [seleccionados, setSeleccionados] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [ganado, setGanado] = useState(false);

  const desafioActual = DESAFIOS[desafioIndex];
  const objetivos = FIGURAS.filter(f => f[desafioActual.campo] === desafioActual.valor);

  const handleTocar = (figura) => {
    if (seleccionados.includes(figura.id)) return;

    if (figura[desafioActual.campo] === desafioActual.valor) {
      const nuevosSeleccionados = [...seleccionados, figura.id];
      setSeleccionados(nuevosSeleccionados);
      setPuntos(p => p + 10);

      // Ver si completó el desafío actual
      if (nuevosSeleccionados.length === objetivos.length) {
        confetti({ particleCount: 80, spread: 70 });
        setTimeout(() => {
          if (desafioIndex + 1 < DESAFIOS.length) {
            setDesafioIndex(d => d + 1);
            setSeleccionados([]);
          } else {
            setGanado(true);
            confetti({ particleCount: 160, spread: 100 });
          }
        }, 1000);
      }
    } else {
      // Feedback suave de intento
      const cardEl = document.getElementById(`fig-${figura.id}`);
      if (cardEl) {
        cardEl.style.transform = "rotate(6deg)";
        setTimeout(() => cardEl.style.transform = "none", 300);
      }
    }
  };

  const reiniciar = () => {
    setDesafioIndex(0);
    setSeleccionados([]);
    setPuntos(0);
    setGanado(false);
  };

  return (
    <div className="card" style={{
      background: "linear-gradient(180deg, #ffffff, #fefce8)",
      border: "3px solid #fef08a",
      borderRadius: "24px",
      padding: "25px",
      textAlign: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 className="font-fun" style={{ fontSize: "24px", color: "#ca8a04", margin: 0 }}>
            🎨 Formas y Colores Mágicos
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>¡Aprende jugando con figuras brillantes!</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ background: "#fef9c3", padding: "6px 14px", borderRadius: "12px", fontWeight: "700", color: "#854d0e" }}>
            ⭐ Puntos: {puntos}
          </div>
          <button onClick={reiniciar} className="btn btn-secondary" style={{ borderRadius: "12px" }}>
            <RotateCcw size={16} /> Reiniciar
          </button>
        </div>
      </div>

      {ganado ? (
        <div style={{ padding: "30px 20px" }}>
          <Trophy size={64} color="#eab308" style={{ margin: "0 auto 15px", animation: "bounce 1s infinite" }} />
          <h2 className="font-fun" style={{ fontSize: "32px", color: "#ca8a04" }}>¡Maestro de las Formas! 🏆</h2>
          <p style={{ fontSize: "16px", color: "#475569", marginBottom: "20px" }}>
            ¡Completaste todos los desafíos con un puntaje de <strong>{puntos} puntos</strong>!
          </p>
          <button onClick={reiniciar} className="btn btn-fun">
            ¡Jugar otra vez! ✨
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            background: "#fef08a",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            boxShadow: "0 4px 10px rgba(202, 138, 4, 0.15)"
          }}>
            <h4 className="font-fun" style={{ fontSize: "22px", color: "#854d0e", margin: 0 }}>
              🎯 Misión: {desafioActual.consigna}
            </h4>
            <p style={{ fontSize: "13px", color: "#713f12", margin: "4px 0 0 0" }}>
              Encontrados: {seleccionados.length} de {objetivos.length}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {FIGURAS.map((fig) => {
              const estaSeleccionado = seleccionados.includes(fig.id);
              return (
                <div
                  key={fig.id}
                  id={`fig-${fig.id}`}
                  onClick={() => handleTocar(fig)}
                  style={{
                    background: estaSeleccionado ? "#dcfce7" : "#ffffff",
                    border: `3px solid ${estaSeleccionado ? "#22c55e" : "#fde047"}`,
                    borderRadius: "18px",
                    padding: "20px 10px",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    opacity: estaSeleccionado ? 0.7 : 1
                  }}
                >
                  <span style={{ fontSize: "40px" }}>{fig.emoji}</span>
                  <span className="font-fun" style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                    {fig.forma}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
