import React, { useState } from "react";
//import '../css/starfield.css'; 

/* Catálogo base con Júpiter (default) y Marte */
export const PLANETS = {
  jupiter: {
    planetName: "Júpiter",
    description:
      "Júpiter es el planeta más grande de nuestro sistema solar, conocido como un gigante gaseoso compuesto principalmente de hidrógeno y helio, y se caracteriza por su Gran Mancha Roja y sus bandas de nubes arremolinadas.",
    planetImageUrl: undefined, // añade URL si deseas mostrar imagen en el slot
  },
  mars: {
    planetName: "Marte",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
};

export default function PlanetTemplate({
  planetKey = "jupiter",
  planetName,
  description,
  questionLabel,
  placeholder,
  sendLabel = "",
  // NUEVO: onSubmit por defecto que llama a tu backend y alerta la respuesta
  onSubmit = async (value) => {
    if (!value?.trim()) return;
    try {
      const res = await fetch("http://localhost:3000/chat", {   // <-- NO uses solo "/chat"
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: value })
      });
      if (!res.ok) throw new Error(await res.text());
      const { text } = await res.json();
      alert(text || "(sin respuesta)");
    } catch (e) {
      alert("Error: " + e.message);
    }
  },
  planetImageUrl,
  spaceBgUrl,
}) {

  const [value, setValue] = useState("");

  const base = PLANETS[planetKey] || PLANETS.jupiter;
  const final = {
    planetName: planetName ?? base.planetName,
    description: description ?? base.description,
    questionLabel: questionLabel ?? `Pregunta acerca de ${planetName ?? base.planetName}`,
    placeholder: placeholder ?? "Escribe tu pregunta…",
    planetImageUrl: planetImageUrl ?? base.planetImageUrl,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
    setValue("");
  };

  return (
    <div className="planet-root">
      <div
        className="canvas"
        style={{
          ...(spaceBgUrl ? { ["--space-bg"]: `url(${spaceBgUrl})` } : {}),
          ...(final.planetImageUrl ? { ["--planet-image"]: `url(${final.planetImageUrl})` } : {}),
        }}
      >
        <h1 className="title">{final.planetName}</h1>

        {/* Slot cuadrado con posiciones exactas. */}
        <div className="planet-slot" aria-label={`Imagen de ${final.planetName}`} />

        <aside className="desc">
          <p>{final.description}</p>
        </aside>

        <div className="qa">
          <div className="label">{final.questionLabel}</div>
          <form className="inputRow" onSubmit={handleSubmit}>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={final.placeholder}
              aria-label={final.placeholder}
            />
            <button className="send" aria-label="enviar" title="Enviar">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                <path d="M2 3l20 9-20 9 5-9-5-9zm5 9l3 3 8-3-8-3-3 3z" fill="currentColor" />
              </svg>
              {sendLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
