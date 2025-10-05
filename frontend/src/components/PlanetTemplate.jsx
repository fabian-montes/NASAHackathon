import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // ← para leer planetKey desde el NavBar
import "../css/estrellas.css";
import "../css/planeta.css";

// Catálogo base
export const PLANETS = {
  jupiter: {
    planetName: "Jupiter",
    description:
      "Jupiter is the largest planet and a gas giant composed primarily of hydrogen and helium, with a ~69,911 km equatorial radius and a mass of 318 M⊕ at 5.20 AU. It displays prominent cloud bands, long-lived cyclones such as the Great Red Spot, a ~9.9 h day, and an 11.86-year orbital period. Its magnetosphere is the most extensive in the solar system, and it hosts a broad satellite system—including the Galilean moons Io, Europa, Ganymede, and Callisto—and faint rings.",
    planetImageUrl: undefined,
  },
  mars: {
    planetName: "Mars",
    description:
      "Mars is a cold, arid terrestrial world at 1.52 AU with a mean radius of ~3,390 km and a mass of 0.107 M⊕. It hosts seasonal polar caps, a thin CO₂-dominated atmosphere (~6 mbar at the surface), temperatures from ~–125 °C to ~20 °C, and geology that includes Olympus Mons and extensive valleys. The solar day is ~24.6 h, the year 687 days, and its two small, irregular moons are Phobos and Deimos.",
    planetImageUrl: undefined,
  },
  saturn: {
    planetName: "Saturn",
    description:
      "Saturn, a low-density gas giant (~0.69 g/cm³), orbits at 9.58 AU and possesses the most developed ring system, composed mainly of ice and dust distributed among complex families (A, B, C). With an equatorial radius of ~58,232 km and a mass of 95 M⊕, its day is ~10.7 h and its year 29.45 years. Notable moons include Titan, with a dense nitrogen atmosphere and hydrocarbon lakes, and Enceladus, which emits plumes consistent with a subsurface ocean.",
    planetImageUrl: undefined,
  },
  mercury: {
    planetName: "Mercury",
    description:
      "Mercury is the innermost rocky planet, exhibiting a heavily cratered surface, an extremely tenuous exosphere dominated by sodium and potassium, and a 3:2 spin–orbit resonance. With a mean radius of ~2,439 km and a mass of 0.055 Earth masses, it orbits at 0.39 AU and completes a year in 87.97 days. Its sidereal day lasts 58.65 days; surface temperatures range from ~–170 °C to +430 °C, and its intrinsic magnetic field is weak (≈1% of Earth’s). No natural satellites are known.",
    planetImageUrl: undefined,
  },
  venus: {
    planetName: "Venus",
    description:
      "Venus, similar to Earth in size (mean radius ~6,052 km; 0.815 Earth masses) and located at 0.72 AU, rotates very slowly in a retrograde sense (sidereal day ~–243 days) and is enveloped by a dense CO₂ atmosphere with sulfuric acid clouds, producing an extreme greenhouse effect. Surface pressure is ~92 bar, mean temperature ~465 °C, and high-altitude winds exhibit superrotation. No natural satellites are present.",
    planetImageUrl: undefined,
  },
  earth: {
    planetName: "Earth",
    description:
      "Earth, at 1 AU from the Sun, is the only known planet with life and maintains a dynamic balance among active geology, liquid oceans (~71% surface coverage), a protective atmosphere, and a robust geomagnetic field. With a mean radius of ~6,371 km and a mass of 1 M⊕, its year lasts 365.25 days and its sidereal day 23 h 56 min. The global mean surface temperature is ~15 °C, and the atmosphere is ~78% N₂, ~21% O₂, with trace gases. It has one natural satellite, the Moon.",
    planetImageUrl: undefined,
  },
  uranus: {
    planetName: "Uranus",
    description:
      "Uranus is an ice giant at 19.2 AU characterized by an extreme axial tilt (~98°) that yields prolonged seasons and a retrograde rotation with a ~–17.2 h day. With a mean radius of ~25,362 km and a mass of 14.5 M⊕, its atmosphere contains hydrogen, helium, and methane that imparts a turquoise hue; typical cloud-top temperatures are ~–224 °C. It features faint rings, a magnetosphere offset and tilted relative to the spin axis, and 27 known moons.",
    planetImageUrl: undefined,
  },
  neptune: {
    planetName: "Neptune",
    description:
      "Neptune, the most distant ice giant at 30.1 AU, has a mean radius of ~24,622 km and a mass of 17.1 M⊕. Its hydrogen-helium-methane atmosphere exhibits very high-speed winds (measured above 600 m/s) and variable storm systems, including dark spots. The day is ~16.1 h and the year 164.8 years. It has faint rings and over a dozen moons, among them Triton, which orbits retrograde and shows cryovolcanic activity.",
    planetImageUrl: undefined,
  },
};

// NUEVO: mapa de alias para detectar menciones a otros planetas
const PLANET_ALIASES = {
  Jupiter: ["jupiter", "io", "europa", "ganymede", "callisto"],
  Mars: ["mars", "olympus mons", "phobos", "deimos"],
};

function buildSystemPrompt(planetName) {
  // NUEVO: instrucción que “encierra” la respuesta al planeta actual
  return `
You are an assistant that ONLY answers about the planet "${planetName}".
Rules:
- Respond exclusively with facts and context related to "${planetName}".
- If the user asks about a different topic or planet, reply briefly:
  "I can only talk about ${planetName}."
- Answer in English with precision and concision.
`.trim();
}

export default function PlanetTemplate({
  planetKey = "mars",
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

  // 🔊 Estado y referencia de audio (DENTRO del componente)
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

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

  // 🔊 Inicializar y reproducir audio automáticamente
  const initAndPlay = async () => {
    try {
      const res = await fetch("http://localhost:3000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: final.description }),
      });
      if (!res.ok) throw new Error("Error al generar audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Limpia audio previo
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audio.muted = isMuted;
      audioRef.current = audio;
      audio.play().catch(() => {
        // Algunos navegadores bloquean autoplay; lo ignoramos.
      });
    } catch (e) {
      alert("Error al reproducir: " + e.message);
    }
  };

  useEffect(() => {
    initAndPlay();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, [final.planetName, final.description]); // ⬅️ no incluir isMuted para no regenerar TTS

  return (
    <div className="planet-root" key={effectivePlanetKey}>
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
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (audioRef.current) audioRef.current.muted = next;
            }}
            className="play-btn"
            aria-label={isMuted ? "Activar sonido" : "Silenciar audio"}
          >
            {isMuted ? "🔈 Activar sonido" : "🔇 Silenciar"}
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

            {/* 🔽 AÑADE ESTE BOTÓN NUEVO AQUÍ */}
            <button
              className="mic"
              aria-label="micrófono"
              title="Micrófono"
              type="button"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                <path
                  d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 8a7.98 7.98 0 0 1-6-2.7V20h12v-3.7A7.98 7.98 0 0 1 12 19z"
                  fill="currentColor"
                />
              </svg>
            </button>

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
