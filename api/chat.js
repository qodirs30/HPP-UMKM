export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

  const { messages = [], context = "" } = req.body;

  const systemPrompt = `Kamu adalah asisten AI untuk aplikasi HPP UMKM (Harga Pokok Penjualan untuk UMKM F&B).
Tugasmu membantu pengguna soal:
- Cara menghitung HPP makanan/minuman
- Tips menetapkan harga jual & margin
- Strategi bisnis F&B sederhana
- Cara pakai fitur aplikasi ini

ATURAN KETAT:
- Jawab SINGKAT, maks 2-3 kalimat. Langsung to the point.
- Pakai bahasa Indonesia kasual.
- Kalau ada angka/harga, pakai format Rp (contoh: Rp 25.000).
- Jangan pernah jawab panjang lebar. Hemat token.
- Kalau ditanya di luar topik F&B/HPP, tolak sopan dalam 1 kalimat.${context ? "\n\nKonteks data pengguna saat ini:\n" + context : ""}`;

  const contents = [];
  messages.forEach((m) => {
    contents.push({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    });
  });

  // Models: primary Gemini 3.6 Flash, rollback to Gemini 3.5 Flash-Lite, plus safety net
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite"
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const body = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        console.error(`${model} failed: ${resp.status}`);
        continue; // try fallback
      }

      const data = await resp.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak bisa menjawab saat ini.";

      return res.status(200).json({ reply: text, model });
    } catch (err) {
      console.error(`${model} error:`, err.message);
      continue; // try fallback
    }
  }

  return res.status(503).json({ error: "Semua model sedang tidak tersedia. Coba lagi nanti." });
}
