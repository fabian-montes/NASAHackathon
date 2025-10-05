// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});