# Configuring the AI search key (Groq) & Vercel

The AI movie-search feature now uses **Groq** instead of Gemini. Groq's free
tier needs **no credit card / no billing** and doesn't hit the `limit: 0`
quota problem Gemini had. The key lives only on the server (`GROQ_KEY`), routed
through `api/ai-search.js`, so it's never shipped in the browser bundle.

Live app: https://cinestream-iota.vercel.app

---

## Part 1 — Create a free Groq API key

1. Go to **https://console.groq.com** and sign in with Google or GitHub
   (no credit card requested).
2. Open **API Keys** in the left nav.
3. Click **Create API Key**, give it a name (e.g. "cinestream").
4. Copy the key — it starts with `gsk_...`. You won't see it in full again.

> No project setup, no "enable API" step, no billing. That's the whole point of
> switching off Gemini.

---

## Part 2 — Add the key to Vercel

### Dashboard
1. **https://vercel.com** → your **cinestream** project.
2. **Settings → Environment Variables**.
3. Add:
   - **Key:** `GROQ_KEY`  (no `REACT_APP_` prefix — must stay server-side)
   - **Value:** your `gsk_...` key
   - **Environments:** Production, Preview, Development
4. *(Optional)* `GROQ_MODEL` to override the default `llama-3.3-70b-versatile`.
5. **Save.**

### CLI
```bash
vercel env add GROQ_KEY production
vercel env add GROQ_KEY preview
vercel env add GROQ_KEY development
```

---

## Part 3 — Redeploy

Env var changes only apply to a **new deployment**:
- **Dashboard:** Deployments → latest → ⋯ → **Redeploy**
- **CLI:** `vercel --prod`
- **Git:** push to the production branch (auto-deploys)

---

## Part 4 — Verify

```bash
curl -X POST https://cinestream-iota.vercel.app/api/ai-search \
  -H "content-type: application/json" \
  -d '{"query":"feel-good sci-fi"}'
# → {"movies":["Interstellar","The Martian", ...]}
```

Then try the **GPT Search** feature in the live app — it should return 5
movies with posters.

---

## Switching providers later

`api/ai-search.js` uses an OpenAI-compatible chat API. To swap to another
provider (OpenRouter, Mistral, etc.), change `AI_BASE_URL`, `AI_MODEL`, and the
env key name in that one file — the frontend needs no changes.
