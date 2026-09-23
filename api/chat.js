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

  const systemPrompt = `Kamu adalah "qodirs Asisten", asisten AI yang ramah, pintar, dan solutif untuk aplikasi web HPP UMKM (kalkulator HPP dan strategi harga F&B).

GAYA DAN TONE JAWABAN:
- Gunakan bahasa Indonesia yang santai, luwes, bersahabat, dan natural (seperti partner diskusi bisnis kuliner).
- PENTING: Jawab secara LENGKAP, JELAS, dan TUNTAS sampai kalimat penutup. JANGAN pernah memotong jawaban di tengah jalan.
- Berikan wawasan praktis dan aplikatif untuk UMKM F&B. Gunakan format poin-poin atau bullet points agar mudah dan nyaman dibaca di layar HP.
- Jika ditanya tentang margin atau HPP, berikan acuan standar industri F&B yang konkret (misal: Makanan 50%-60%, Minuman 70%-80%).
- Jika ditanya cara menggunakan aplikasi, berikan panduan langkah yang praktis (1. Tambah Kategori, 2. Input Bahan Baku & Kemasan, 3. Buat Resep Menu & atur Target Margin).
- Jika menyebutkan nominal harga atau biaya, selalu gunakan format Rupiah rapi (contoh: Rp 15.000).
- Jangan pernah menampilkan teks meta dalam tanda kurung seperti "(Casual Indonesian)".${context ? "\n\nKonteks data menu pengguna saat ini:\n" + context : ""}`;

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
          maxOutputTokens: 3000,
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
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const text =
        parts
          .filter((p) => !p.thought)
          .map((p) => p.text || "")
          .join("")
          .trim() ||
        parts[0]?.text ||
        "Maaf, tidak bisa menjawab saat ini.";

      return res.status(200).json({ reply: text, model });
    } catch (err) {
      console.error(`${model} error:`, err.message);
      continue; // try fallback
    }
  }

  return res.status(503).json({ error: "Semua model sedang tidak tersedia. Coba lagi nanti." });
}
