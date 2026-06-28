// Vercel serverless proxy for the Google Gemini API.
//
// Why this exists: the old key lived in REACT_APP_GEMINI_KEY, which CRA bakes
// into the public JS bundle. Anyone could scrape it and exhaust the quota
// (the likely cause of the "max limit reached" error). Routing through here
// keeps the new key server-side only (env var GEMINI_KEY), never shipped to
// the browser.
//
// Request:  POST /api/gemini  { "query": "feel-good sci-fi" }
// Response: { "movies": ["Interstellar", "The Martian", ...] }

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

  const apiKey = process.env.GEMINI_KEY || process.env.REACT_APP_GEMINI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  const prompt = `Act as a Movie Recommendation system and suggest some movies for the query: "${query}". Only give me names of 5 movies, comma-separated like this example: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya.`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await geminiRes.json();

    // Surface Gemini's own error (e.g. quota exceeded) to the client.
    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({
        error: data?.error?.message || "Gemini request failed",
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const movies = text
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    res.setHeader("cache-control", "no-store");
    return res.status(200).json({ movies });
  } catch (error) {
    return res
      .status(502)
      .json({ error: "Gemini proxy request failed", detail: String(error) });
  }
}
