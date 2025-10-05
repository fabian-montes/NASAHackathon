// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

// --- Rutas ---
app.get("/zoom-in", (req, res) => {
  res.sendStatus(200);
});

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Falta 'prompt' (string)." });
    }

    const MODEL = "gemini-2.5-flash";
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt.slice(0, 4000) }]}],
        generationConfig: { temperature: 0.6, maxOutputTokens: 512 }
      })
    });

    if (!r.ok) return res.status(r.status).send(await r.text());
    const json = await r.json();
    const text = json?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: "Error interno" });
  }
});

/////////////nuevo----------------------------------------------------------
// --- Nueva ruta para texto a voz (TTS) ---
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Falta el texto a convertir." });

    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Puedes cambiar por otra voz disponible
    const apiKey = process.env.ELEVENLABS_API_KEY;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
    });
    res.send(Buffer.from(audioBuffer));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error generando audio" });
  }
});
-///--------------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});