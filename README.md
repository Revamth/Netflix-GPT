# CineStream (Netflix-GPT)

CineStream is a React single-page app that recreates a Netflix-style browsing experience with Firebase Authentication, TMDB movie and TV data, and AI-powered movie recommendations. API calls run through same-origin serverless proxies so third-party keys never reach the browser bundle, and so TMDB works even on networks/ISPs that block `api.themoviedb.org` directly.

Live: https://cinestream-iota.vercel.app

## Features

- Email/password sign in and sign up with Firebase Auth.
- Netflix-style browse page with a hero trailer and horizontal content rows.
- TMDB-powered categories: now playing, trending, popular, top rated, upcoming, popular TV series, and top rated TV series.
- Movie detail modal (click any card or the hero buttons) with poster, metadata, and an opt-in trailer.
- AI search mode that asks Groq for structured recommendations (title + year + reason), matches each against TMDB by title and year, and shows why each was picked.
- Redux Toolkit state for auth, TMDB data, and AI search results.

## Tech Stack

- React 19 with Create React App
- React Router DOM 7 (data router)
- Redux Toolkit and React Redux
- Firebase 11 Auth
- TMDB REST API (via a serverless proxy)
- Groq (OpenAI-compatible) for AI recommendations (via a serverless proxy)
- Tailwind CSS 3
- Deployed on Vercel (serverless functions in `api/`)

## Architecture

The browser never calls TMDB or the AI provider directly. Two Vercel serverless
functions proxy those requests and inject the secret keys server-side:

- `api/tmdb.js` — proxies every TMDB call. `vercel.json` rewrites `/api/tmdb/*`
  to it. Solves both key exposure and ISP blocks of `api.themoviedb.org`.
- `api/ai-search.js` — proxies AI recommendations to Groq using JSON mode, and
  returns a normalized `{ movies: [{ title, year, reason }] }` shape.

Client code targets `/api/tmdb` and `/api/ai-search` by default (see
`src/utils/constants.js`); optional `REACT_APP_*` overrides allow hitting the
upstreams directly for local development.

## Quick Start

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root (see `.env.example`):

```bash
# Client-side (only needed for local dev hitting TMDB directly)
REACT_APP_TMDB_TOKEN=<tmdb-v4-read-access-token>
REACT_APP_TMDB_KEY=<tmdb-v3-api-key>
```

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

> The `api/` serverless functions only run on Vercel. For local function
> testing use `vercel dev`; with plain `npm start` either point the app at the
> live proxy or hit TMDB directly via the optional overrides in `.env.example`.

## Environment Variables

### Client-side (`REACT_APP_*`, embedded in the bundle)

| Variable | Purpose |
| --- | --- |
| `REACT_APP_TMDB_TOKEN` | TMDB v4 bearer token. Only used when calling TMDB directly (local dev); behind the proxy the server injects it. |
| `REACT_APP_TMDB_KEY` | TMDB v3 API key, used as an `api_key` fallback. |
| `REACT_APP_TMDB_API_BASE_URL` | Optional. Override the TMDB base (defaults to `/api/tmdb`). |
| `REACT_APP_AI_SEARCH_URL` | Optional. Override the AI search endpoint (defaults to `/api/ai-search`). |

### Server-side (Vercel project env vars, **not** prefixed `REACT_APP_`)

| Variable | Used by | Purpose |
| --- | --- | --- |
| `TMDB_TOKEN` | `api/tmdb.js` | TMDB bearer token, kept off the client. |
| `TMDB_KEY` | `api/tmdb.js` | TMDB v3 key fallback. |
| `GROQ_KEY` | `api/ai-search.js` | Groq API key for AI recommendations (free tier, no billing card). |
| `GROQ_MODEL` | `api/ai-search.js` | Optional model override (default `llama-3.3-70b-versatile`). |

Set the server-side vars in the Vercel dashboard → Settings → Environment
Variables, then redeploy. See [docs/AI_SEARCH_KEY_AND_VERCEL.md](docs/AI_SEARCH_KEY_AND_VERCEL.md)
for the step-by-step Groq + Vercel setup.

## Available Scripts

```bash
npm start                      # run locally in development mode
npm test -- --watchAll=false   # run the test suite once
npm run build                  # build the production app into build/
```

## Project Structure

```text
api/
├── tmdb.js                   # serverless TMDB proxy
└── ai-search.js              # serverless Groq recommendation proxy
src/
├── App.js                    # Redux Provider wrapper
├── components/               # AppLayout, Login, Browse, Header, GPT, movie UI + detail modal
├── hooks/                    # TMDB and AI-search data-fetching hooks
├── Pages/                    # Shimmer loading skeleton
├── utils/                    # Redux store, slices, Firebase, constants, validation
├── index.css                 # Tailwind directives and utility CSS
└── index.js                  # React entry point
vercel.json                   # build config + SPA / API rewrites
```

Routes are defined in `src/components/Body.js` under a shared `AppLayout`:

- `/` renders the login/sign-up page.
- `/browse` renders the main browsing experience.

`src/components/AppLayout.js` registers the single Firebase `onAuthStateChanged`
listener and drives redirects based on auth state.

## Data Flow

1. `src/index.js` mounts `App`, which wraps the router in the Redux store provider.
2. `Body` defines the routes under `AppLayout`, which syncs auth state into Redux and redirects accordingly.
3. `Browse` runs the TMDB hooks and switches between the home view and the AI search view.
4. AI search posts the query to `/api/ai-search`; Groq returns `{ title, year, reason }` objects, each is matched against TMDB by title and year, and the response is stored in Redux.

See [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md) for a more detailed architecture map.

## Deployment

Deployed on Vercel. `vercel.json` defines the build command, output directory,
the `/api/tmdb/*` rewrite, and the SPA fallback so deep links like `/browse`
resolve. Pushing to the production branch triggers an automatic deployment;
environment variable changes require a redeploy to take effect.
