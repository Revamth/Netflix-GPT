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
// Response: { "movies": [{ "title": "Interstellar", "year": 2014,
//                          "reason": "Cerebral space epic." }, ...] }
//
// Returns structured JSON (title + year + reason) instead of bare names so the
// client can match TMDB by title AND year (far fewer wrong-movie matches) and
// show why each film was picked.

const AI_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
// .trim() for the same reason as the key below: a newline pasted into the env
// var turns a valid model id into a 404 that reads like a decommissioned model.
const AI_MODEL =
  (process.env.GROQ_MODEL || "").trim() || "openai/gpt-oss-120b";

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

  // .trim() guards against a trailing newline/space pasted into the Vercel env
  // var — the provider rejects such a key with an opaque 401.
  const apiKey = (process.env.GROQ_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({
      error:
        "AI search is not configured: set GROQ_KEY in the Vercel project env vars.",
    });
  }

  const prompt = `You are a movie recommendation engine. For the query: "${query}", suggest exactly 5 real movies. Respond with ONLY a JSON object of this shape, no extra text: {"movies":[{"title":"<exact movie title>","year":<release year number>,"reason":"<one short sentence why it fits>"}]}`;

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
        // Force valid JSON output (Groq/OpenAI-compatible JSON mode).
        response_format: { type: "json_object" },
      }),
    });

    const data = await aiRes.json();

    // Translate the provider's terse errors into something actionable — a bare
    // "Invalid API Key" reaching the UI reads like a client bug, not a config one.
    if (!aiRes.ok) {
      const providerMessage =
        data?.error?.message || `AI request failed (${aiRes.status})`;
      console.error("AI provider error:", aiRes.status, providerMessage);

      let error = providerMessage;
      if (aiRes.status === 401 || aiRes.status === 403) {
        error =
          "AI search is unavailable: the server's GROQ_KEY is invalid or expired. Generate a new key at console.groq.com, update the Vercel env var, and redeploy.";
      } else if (aiRes.status === 429) {
        error = "AI search is rate limited right now. Try again in a minute.";
      } else if (aiRes.status === 404) {
        error = `AI model "${AI_MODEL}" was rejected by the provider. Set GROQ_MODEL to a model your key can access (list them with GET /openai/v1/models).`;
      }

      // Always pass the provider's own wording through as `detail`. The friendly
      // message above is a guess at the cause; `detail` is the ground truth, and
      // without it a mapped status hides why the call actually failed.
      return res.status(aiRes.status).json({ error, detail: providerMessage });
    }

    const text = data?.choices?.[0]?.message?.content || "{}";

    let movies = [];
    try {
      const parsed = JSON.parse(text);
      movies = Array.isArray(parsed.movies) ? parsed.movies : [];
    } catch {
      return res
        .status(502)
        .json({ error: "AI returned malformed JSON" });
    }

    // Keep only valid entries with a title.
    movies = movies
      .filter((m) => m && m.title)
      .map((m) => ({
        title: String(m.title).trim(),
        year: m.year ? String(m.year).slice(0, 4) : null,
        reason: m.reason ? String(m.reason).trim() : null,
      }));

    res.setHeader("cache-control", "no-store");
    return res.status(200).json({ movies });
  } catch (error) {
    return res
      .status(502)
      .json({ error: "AI proxy request failed", detail: String(error) });
  }
}
