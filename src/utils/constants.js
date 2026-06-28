// Served from /public so it always renders (the old hosted Netflix logo URL
// now returns 403). process.env.PUBLIC_URL keeps it correct on any base path.
export const NETFLIX_LOGO = `${process.env.PUBLIC_URL || ""}/cinestream-logo.svg`;

export const NETFLIX_BACKGROUND =
  "https://assets.nflxext.com/ffe/siteui/vlv3/50fcc930-ba3f-4cae-9257-9f920e30a998/web/IN-en-20250310-TRIFECTA-perspective_739387a0-ff14-44ed-a5af-36e5aa4d236e_large.jpg";

// Defaults to the same-origin serverless proxy (see api/tmdb/[...path].js).
// Some ISPs block direct browser access to api.themoviedb.org, so we route
// TMDB calls through our own origin, which the browser can always reach.
// Override with REACT_APP_TMDB_API_BASE_URL to hit TMDB directly (e.g. local dev).
export const TMDB_API_BASE_URL =
  process.env.REACT_APP_TMDB_API_BASE_URL || "/api/tmdb";
export const TMDB_TOKEN = process.env.REACT_APP_TMDB_TOKEN;
export const API_KEY = process.env.REACT_APP_TMDB_KEY;

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    ...(TMDB_TOKEN ? { Authorization: `Bearer ${TMDB_TOKEN}` } : {}),
  },
};

export const buildTmdbUrl = (path, params = {}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // TMDB_API_BASE_URL may be relative (e.g. "/api/tmdb"), which `new URL()`
  // can't parse without a base, so resolve against the current origin.
  const isAbsolute = /^https?:\/\//i.test(TMDB_API_BASE_URL);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const url = new URL(
    `${TMDB_API_BASE_URL}${normalizedPath}`,
    isAbsolute ? undefined : origin
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  // When hitting TMDB directly without a bearer token, fall back to the v3 key.
  // (Behind the proxy the server injects auth, so neither is needed client-side.)
  if (isAbsolute && !TMDB_TOKEN && API_KEY) {
    url.searchParams.set("api_key", API_KEY);
  }

  return url.toString();
};

export const BASE_URL =
  process.env.REACT_APP_BASE_URL || `${TMDB_API_BASE_URL}/movie/`;
export const TMDB_IMG =
  process.env.REACT_APP_TMDB_IMG_URL || "https://image.tmdb.org/t/p/w500";

// Gemini now runs through a same-origin serverless proxy (see api/gemini.js)
// so the API key never reaches the browser bundle. Override only for local dev.
export const GEMINI_API_URL =
  process.env.REACT_APP_GEMINI_API_URL || "/api/gemini";
