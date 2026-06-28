// Vercel serverless proxy for AI movie recommendations (Groq).
//
// Why this exists: keeps the API key server-side (env var GROQ_KEY) so it's
// never shipped in the public JS bundle and can't be scraped.
//
// Groq is free (no billing card) and OpenAI-compatible. Swapped in from Gemini,
// whose free tier returned limit: 0. To use a different OpenAI-compatible
// provider, only AI_BASE_URL / AI_MODEL / the env key below need to change.
//
// Request:  POST /api/ai-search  { "query": "feel-good sci-fi" }
// Response: { "movies": ["Interstellar", "The Martian", ...] }

const AI_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const AI_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Body may arrive parsed (object) or raw (string) depending on runtime.
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const query = (body.query || "").trim();

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' in request body" });
  }

  const apiKey = process.env.GROQ_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "AI API key not configured" });
  }

  const prompt = `Act as a Movie Recommendation system and suggest some movies for the query: "${query}". Only give me names of 5 movies, comma-separated like this example: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya.`;

  try {
    const aiRes = await fetch(AI_BASE_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await aiRes.json();

    // Surface the provider's own error (e.g. rate limit) to the client.
    if (!aiRes.ok) {
      return res.status(aiRes.status).json({
        error: data?.error?.message || "AI request failed",
      });
    }

    const text = data?.choices?.[0]?.message?.content || "";
    const movies = text
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    res.setHeader("cache-control", "no-store");
    return res.status(200).json({ movies });
  } catch (error) {
    return res
      .status(502)
      .json({ error: "AI proxy request failed", detail: String(error) });
  }
}
