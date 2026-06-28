// Vercel serverless proxy for the TMDB API.
//
// Why this exists: some ISPs/networks block direct browser access to
// `api.themoviedb.org` (connections time out with net::ERR_CONNECTION_TIMED_OUT).
// The browser CAN reach our own origin, and Vercel's servers CAN reach TMDB, so
// we route every TMDB call through here instead of calling TMDB from the client.
//
// Bonus: the TMDB token lives in a server-side env var and is no longer baked
// into the public JS bundle. An incoming Authorization header is forwarded as a
// fallback so the proxy still works before the server env var is configured.
//
// Mounted as a catch-all: a request to `/api/tmdb/movie/now_playing?page=1`
// arrives here with req.query.path === ["movie", "now_playing"].

const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  const segments = req.query.path || [];
  const path = Array.isArray(segments) ? segments.join("/") : segments;

  const url = new URL(`${TMDB_BASE}/${path}`);

  // Forward every query param except the `path` segments Vercel injects.
  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") return;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, value);
    }
  });

  const token = process.env.TMDB_TOKEN || process.env.REACT_APP_TMDB_TOKEN;
  const apiKey = process.env.TMDB_KEY || process.env.REACT_APP_TMDB_KEY;

  const headers = { accept: "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  } else if (req.headers.authorization) {
    // Fallback: forward the bearer token the client already sends.
    headers.Authorization = req.headers.authorization;
  }

  try {
    const tmdbRes = await fetch(url.toString(), { headers });
    const body = await tmdbRes.text();

    res.status(tmdbRes.status);
    res.setHeader(
      "content-type",
      tmdbRes.headers.get("content-type") || "application/json"
    );
    // TMDB data is fine to cache briefly at the edge.
    res.setHeader("cache-control", "public, max-age=300, s-maxage=300");
    res.send(body);
  } catch (error) {
    res.status(502).json({
      error: "TMDB proxy request failed",
      detail: String(error),
    });
  }
}
