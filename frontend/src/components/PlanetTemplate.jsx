import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // ← para leer planetKey desde el NavBar
import "../css/estrellas.css";
import "../css/planeta.css";

// Catálogo base
export const PLANETS = {
  jupiter: {
    planetName: "Júpiter",
    description:
      "Júpiter es el planeta más grande de nuestro sistema solar, conocido como un gigante gaseoso compuesto principalmente de hidrógeno y helio, y se caracteriza por su Gran Mancha Roja y sus bandas de nubes arremolinadas.",
    planetImageUrl: undefined,
  },
  mars: {
    planetName: "Marte",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
  saturn: {
    planetName: "Saturno",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
  mercury: {
    planetName: "Mercurio",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
  venus: {
    planetName: "Venus",
    description: "venusvenusvens.",
    planetImageUrl: undefined,
  },
  earth: {
    planetName: "Tierra",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
  uranus: {
    planetName: "Urano",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
  neptune: {
    planetName: "Neptuno",
    description:
      "Marte es un planeta rocoso de color rojizo, con volcanes colosales y una atmósfera delgada.",
    planetImageUrl: undefined,
  },
};

// NUEVO: mapa de alias para detectar menciones a otros planetas
const PLANET_ALIASES = {
  Júpiter: ["jupiter", "júpiter", "io", "europa", "ganímedes", "calisto"],
  Marte: ["marte", "mars", "olympus mons", "phobos", "deimos"],
};

function buildSystemPrompt(planetName) {
  // NUEVO: instrucción que “encierra” la respuesta al planeta actual
  return `
Eres un asistente que SOLO responde sobre el planeta "${planetName}".
Reglas:
- Responde exclusivamente datos, hechos y contexto relacionados con "${planetName}".
- Si el usuario pregunta sobre otro tema o planeta distinto, responde brevemente:
  "Solo puedo hablar sobre ${planetName}."
- Responde en español, con precisión y concisión.
`.trim();
}

export default function PlanetTemplate({
  planetKey = "venus",
  planetName,
  description,
  questionLabel,
  placeholder,
  sendLabel = "",
  // onSubmit por defecto que llama a tu backend
  onSubmit = async (value, ctx) => {
    if (!value?.trim()) return;

    // helpers: obtener/crear el chat y añadir mensajes
    const ensureChatBox = () => {
      let box = document.getElementById("chat-box");
      if (!box) {
        box = document.createElement("section");
        box.id = "chat-box";
        box.className = "chat-box";
        const qa = document.querySelector(".planet-root .qa");
        (qa?.parentNode || document.body).insertBefore(box, qa || null);
      }
      return box;
    };
    const appendMsg = (role, text) => {
      const box = ensureChatBox();
      const row = document.createElement("div");
      row.className = `chat-row ${role}`;
      const msg = document.createElement("div");
      msg.className = "chat-msg";
      msg.textContent = text;
      row.appendChild(msg);
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;
    };
    const appendUser = (t) => appendMsg("user", t);
    const appendBot = (t) => appendMsg("bot", t);

    // pinta primero lo que escribió el usuario
    appendUser(value);

    // lógica de restricción por planeta (igual que tenías)
    const { activePlanetName, otherPlanetAliases } = ctx || {};
    const text = value.toLowerCase();
    const mentionsOther = otherPlanetAliases?.some((alias) =>
      text.includes(alias)
    );
    if (mentionsOther) {
      appendBot(`Solo puedo hablar sobre ${activePlanetName}.`);
      return;
    }

    // system + prompt
    const system = buildSystemPrompt(activePlanetName);
    const userPrompt = `Pregunta del usuario: ${value}`;

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: `${system}\n\n${userPrompt}` }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { text: answer } = await res.json();
      appendBot(answer || `Solo puedo hablar de ${activePlanetName}.`);
    } catch (e) {
      appendBot(`Error: ${e.message}`);
    }
  },
  planetImageUrl,
  spaceBgUrl,
}) {
  const [value, setValue] = useState("");

  // === lee planetKey mandado desde el NavBar.jsx vía state ===
  const { state } = useLocation();
  const fromNav = state?.planetKey; // 'jupiter' | 'mars' | ...

  // usa el que llega del NavBar si existe en el catálogo, si no el prop/default
  const effectivePlanetKey =
    fromNav && PLANETS[fromNav] ? fromNav : planetKey;

  const base = PLANETS[effectivePlanetKey] || PLANETS.jupiter;

  const final = {
    planetName: planetName ?? base.planetName,
    description: description ?? base.description,
    questionLabel:
      questionLabel ?? `Pregunta acerca de ${planetName ?? base.planetName}`,
    placeholder: placeholder ?? "Escribe tu pregunta…",
    planetImageUrl: planetImageUrl ?? base.planetImageUrl,
  };

  // NUEVO: prepara lista de alias del planeta activo y de “otros”
  const activeAliases =
    PLANET_ALIASES[final.planetName] || [final.planetName.toLowerCase()];
  const otherPlanetAliases = Object.keys(PLANET_ALIASES)
    .filter((p) => p !== final.planetName)
    .flatMap((p) => PLANET_ALIASES[p])
    .map((s) => s.toLowerCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    // pasamos contexto al onSubmit por si lo necesita
    onSubmit?.(value, {
      activePlanetName: final.planetName,
      activeAliases,
      otherPlanetAliases,
    });
    setValue("");
  };

  const handlePlay = async () => {
    try {
      const res = await fetch("http://localhost:3000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: final.description }),
      });
      if (!res.ok) throw new Error("Error al generar audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (e) {
      alert("Error al reproducir: " + e.message);
    }
  };

  return (
    <div className="planet-root">
      <div
        className="canvas"
        style={{
          ...(spaceBgUrl ? { ["--space-bg"]: `url(${spaceBgUrl})` } : {}),
          ...(final.planetImageUrl
            ? { ["--planet-image"]: `url(${final.planetImageUrl})` }
            : {}),
        }}
      >
        <h1 className="title">{final.planetName}</h1>

        <div
          className="planet-slot"
          aria-label={`Imagen de ${final.planetName}`}
        />

        <aside className="desc">
        <p>{final.description}</p>
        <button onClick={handlePlay} className="play-btn" aria-label="Reproducir descripción">
            🔊 Escuchar descripción
        </button>
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
                <path
                  d="M2 3l20 9-20 9 5-9-5-9zm5 9l3 3 8-3-8-3-3 3z"
                  fill="currentColor"
                />
              </svg>
              {sendLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
