# Rotating the Gemini API key & configuring Vercel

The old Gemini key hit its quota limit. Because the key used to be shipped in
the public JS bundle (`REACT_APP_GEMINI_KEY`), anyone could scrape and abuse it.
We now route Gemini through a server-side proxy (`api/gemini.js`), so the new
key lives only in Vercel as `GEMINI_KEY` and is never exposed to the browser.

Live app: https://cinestream-iota.vercel.app

---

## Part 1 — Create a new Gemini API key

1. Go to **https://aistudio.google.com/app/apikey** and sign in with your Google account.
2. (Recommended) Delete the old/exhausted key so it can't keep failing:
   click the ⋮ next to it → **Delete API key**.
3. Click **Create API key**.
4. Choose an existing Google Cloud project, or let it create one.
5. Copy the generated key (starts with `AIza...`). You won't be able to see it
   in full again, so paste it somewhere safe for the next step.

> Quota note: the free tier has per-minute and per-day request limits. If you
> keep hitting the cap, enable billing on the Cloud project to raise limits,
> or check usage at https://aistudio.google.com → **Get API key** → usage.

---

## Part 2 — Add the key to Vercel

### Option A — Vercel dashboard (easiest)

1. Open **https://vercel.com** → your project (**cinestream**).
2. **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key:** `GEMINI_KEY`   (no `REACT_APP_` prefix — this must stay server-side)
   - **Value:** the key you copied
   - **Environments:** check **Production**, **Preview**, and **Development**
4. Click **Save**.
5. While you're here, confirm the TMDB proxy vars also exist (used by `api/tmdb`):
   - `TMDB_TOKEN` — your TMDB v4 Read Access Token
   - `TMDB_KEY`   — your TMDB v3 API key (fallback)

### Option B — Vercel CLI

```bash
# Add to each environment (you'll be prompted to paste the value):
vercel env add GEMINI_KEY production
vercel env add GEMINI_KEY preview
vercel env add GEMINI_KEY development
```

---

## Part 3 — Redeploy

Environment variable changes only take effect on a **new deployment**.

- **Dashboard:** Deployments → latest → ⋯ → **Redeploy**.
- **CLI:** `vercel --prod`
- **Git:** push any commit to the production branch (auto-deploys).

---

## Part 4 — Verify

1. Open the live app and use the **GPT Search** feature.
2. It should return 5 movie suggestions with posters.
3. To check the proxy directly:

   ```bash
   curl -X POST https://cinestream-iota.vercel.app/api/gemini \
     -H "content-type: application/json" \
     -d '{"query":"feel-good sci-fi"}'
   # → {"movies":["Interstellar","The Martian", ...]}
   ```

4. Confirm the key is NOT in the bundle (should print nothing):

   ```bash
   curl -s https://cinestream-iota.vercel.app/static/js/main.*.js | grep -o "AIza[A-Za-z0-9_-]*"
   ```

---

## Local development

`.env` (git-ignored) for local `npm start`:

```
REACT_APP_TMDB_TOKEN=<tmdb v4 token>
REACT_APP_TMDB_KEY=<tmdb v3 key>
```

The serverless functions in `api/` only run on Vercel. For local function
testing, use `vercel dev` (reads `GEMINI_KEY` / `TMDB_TOKEN` from Vercel env or
a local `.env`). With plain `npm start`, the `/api/*` calls won't resolve, so
point the app at the live proxy or TMDB directly via the optional overrides in
`.env.example`.
