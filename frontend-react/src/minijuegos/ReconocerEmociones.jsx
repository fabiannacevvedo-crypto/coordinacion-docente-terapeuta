import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Smile, Frown, Sparkles, Heart, CheckCircle2, RotateCcw } from "lucide-react";

const PREGUNTAS = [
  {
    situacion: "Mateo compartió sus lápices de colores con Sofía para pintar un arcoíris 🌈. ¿Cómo se siente Mateo?",
    opciones: [
      { texto: "Feliz y generoso", emoji: "😊", correcta: true },
      { texto: "Enojado", emoji: "😠", correcta: false },
      { texto: "Asustado", emoji: "😨", correcta: false },
    ],
    consejo: "¡Compartir nos hace sentir felices y conecta corazones!"
  },
  {
    situacion: "Lucas tropezó en el patio y se raspó la rodilla 🩹. ¿Cómo se siente en este momento?",
    opciones: [
      { texto: "Triste / Dolorido", emoji: "😢", correcta: true },
      { texto: "Muy alegre", emoji: "😄", correcta: false },
      { texto: "Con sueño", emoji: "😴", correcta: false },
    ],
    consejo: "Cuando un amigo se lastima, le damos un abrazo y llamamos a la seño."
  },
  {
    situacion: "La Seño Laura nos trajo una sorpresa mágica dentro de una caja con moño 🎁. ¿Cómo nos sentimos?",
    opciones: [
      { texto: "Sorprendidos y curiosos", emoji: "🤩", correcta: true },
      { texto: "Aburridos", emoji: "🥱", correcta: false },
      { texto: "Tristes", emoji: "🙁", correcta: false },
    ],
    consejo: "¡La curiosidad es genial para aprender cosas nuevas cada día!"
  },
  {
    situacion: "Llegó el momento del descanso: apagamos la luz fuerte y respiramos suave ☁️. ¿Cómo está nuestro cuerpo?",
    opciones: [
      { texto: "En calma y relajado", emoji: "😌", correcta: true },
      { texto: "Gritando", emoji: "📢", correcta: false },
      { texto: "Corriendo rápido", emoji: "🏃", correcta: false },
    ],
    consejo: "Respirar hondo nos ayuda a recargar energía para seguir jugando."
  }
];

export default function ReconocerEmociones() {
  const [indice, setIndice] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [esCorrecta, setEsCorrecta] = useState(null);
  const [completado, setCompletado] = useState(false);

  const preguntaActual = PREGUNTAS[indice];

  const handleSeleccionar = (opcion) => {
    setSeleccionada(opcion);
    if (opcion.correcta) {
      setEsCorrecta(true);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      setEsCorrecta(false);
    }
  };

  const siguiente = () => {
    if (indice + 1 < PREGUNTAS.length) {
      setIndice(indice + 1);
      setSeleccionada(null);
      setEsCorrecta(null);
    } else {
      setCompletado(true);
      confetti({ particleCount: 150, spread: 100 });
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setSeleccionada(null);
    setEsCorrecta(null);
    setCompletado(false);
  };

  return (
    <div className="card" style={{
      background: "linear-gradient(180deg, #ffffff, #eff6ff)",
      border: "3px solid #bfdbfe",
      borderRadius: "24px",
      padding: "25px",
      textAlign: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 className="font-fun" style={{ fontSize: "24px", color: "#0284c7", margin: 0 }}>
            🎭 Rueda de las Emociones
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Aprende a reconocer qué sienten tus amigos</p>
        </div>
        <button onClick={reiniciar} className="btn btn-secondary" style={{ borderRadius: "12px" }}>
          <RotateCcw size={16} /> Reiniciar
        </button>
      </div>

      {completado ? (
        <div style={{ padding: "30px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "10px" }}>🌈✨</div>
          <h2 className="font-fun" style={{ fontSize: "30px", color: "#0284c7" }}>¡Sos un Campeón Emocional!</h2>
          <p style={{ fontSize: "16px", color: "#475569", marginBottom: "20px" }}>
            Reconociste todas las emociones con mucha empatía y cariño.
          </p>
          <button onClick={reiniciar} className="btn btn-fun">
            Jugar de nuevo 🚀
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "20px",
            border: "2px dashed #93c5fd",
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.05)"
          }}>
            <span style={{
              background: "#dbeafe",
              color: "#1e40af",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 12px",
              borderRadius: "20px",
              display: "inline-block",
              marginBottom: "10px"
            }}>
              Historia {indice + 1} de {PREGUNTAS.length}
            </span>
            <p className="font-fun" style={{ fontSize: "20px", color: "#1e293b", lineHeight: "1.4", margin: 0 }}>
              {preguntaActual.situacion}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginBottom: "20px" }}>
            {preguntaActual.opciones.map((op, i) => {
              const estaSeleccionada = seleccionada === op;
              return (
                <button
                  key={i}
                  onClick={() => handleSeleccionar(op)}
                  style={{
                    background: estaSeleccionada ? (op.correcta ? "#dcfce7" : "#fee2e2") : "#ffffff",
                    border: `3px solid ${estaSeleccionada ? (op.correcta ? "#22c55e" : "#ef4444") : "#e2e8f0"}`,
                    borderRadius: "20px",
                    padding: "18px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span style={{ fontSize: "42px" }}>{op.emoji}</span>
                  <span className="font-fun" style={{ fontSize: "16px", fontWeight: "600", color: "#334155" }}>
                    {op.texto}
                  </span>
                </button>
              );
            })}
          </div>

          {esCorrecta !== null && (
            <div style={{
              background: esCorrecta ? "#ecfdf5" : "#fff1f2",
              border: `2px solid ${esCorrecta ? "#6ee7b7" : "#fecdd3"}`,
              borderRadius: "16px",
              padding: "15px",
              marginBottom: "15px",
              textAlign: "left"
            }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "700", color: esCorrecta ? "#065f46" : "#9f1239" }}>
                {esCorrecta ? "¡Correcto! 🌟" : "Casi... ¡Intenta otra opción! 🌱"}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
                {preguntaActual.consejo}
              </p>
            </div>
          )}

          {esCorrecta && (
            <button onClick={siguiente} className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "16px" }}>
              Siguiente Historia ➔
            </button>
          )}
        </div>
      )}
    </div>
  );
}
