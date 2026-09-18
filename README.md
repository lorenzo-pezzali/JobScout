# Job Scout

React + TypeScript job finder using the OpenAI Responses API, the Gemini API or OpenRouter, all
with built-in web search.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. There's no bundled API key: the app will prompt you to pick a
provider (ChatGPT/OpenAI, Gemini/Google or OpenRouter) and enter your own API key for it on first
run (see "What it does" below).

## What it does
- On first visit, pick an AI provider (ChatGPT, Gemini or OpenRouter) and enter your own API key for it. It's
  stored only in your browser's `localStorage` and sent per-request - never saved on any server.
  You can change the provider or key later from the menu → Settings.
- Then upload your CV (PDF). It's sent to the selected provider to extract a candidate profile,
  which is also saved in `localStorage` and reused for every future search - no need to re-upload.
- Shows one job at a time, carousel-style, instead of a list.
- Only ever surfaces roles published in the last 3 days, matched against your uploaded CV.
- Asks for original employer / ATS application URLs, avoiding paywalled boards.
- Deduplicates against every job you've ever been shown (by URL and by company+title), so the same posting never comes back twice.
- "Apply" opens the original posting in a new tab. "Applied" or "Ignore" records your decision and immediately loads the next unseen job - applied/ignored jobs are excluded from all future searches.
- Each offer includes a short, ready-to-copy "why working for us" answer for that specific posting, deliberately written short and casual rather than corporate-sounding.
- "Tailor CV for this role" generates a PDF of your CV re-emphasized for the offer you're viewing (same facts, reordered/reworded skills and bullets - never invents anything), in one of 5 layouts (Classic, Sidebar, Bold Header, Minimal, Timeline), each a single accent color.
- The menu (hamburger icon, top left) lists every job you've applied to and opens Settings, where you can switch provider, update your API key and pick the tailored-CV layout.

Locally, state is persisted per-browser in `data/clients/<clientId>.json`. `OPENAI_API_KEY` /
`GEMINI_API_KEY` / `OPENROUTER_API_KEY` in `.env` (copy `.env.example`) are optional server-side
fallbacks for calling the API directly (e.g. with `curl`) - the app itself always asks for a key in
the browser regardless, since that's what actually gets sent with each request.

## Providers

| Provider | Default model | Override | Web search |
|---|---|---|---|
| ChatGPT (OpenAI) | `gpt-4o` | `OPENAI_MODEL` | OpenAI `web_search` tool (Responses API) |
| Gemini (Google) | `gemini-2.5-flash` | `GEMINI_MODEL` | Google Search grounding |
| OpenRouter | `perplexity/sonar` | `OPENROUTER_MODEL` | Native for `perplexity/*` models, otherwise OpenRouter's `web` plugin (extra per-request cost) |

OpenRouter talks the OpenAI Chat Completions API, so any model slug on
[openrouter.ai/models](https://openrouter.ai/models) works. CV PDFs are parsed by OpenRouter
itself (text-layer extraction via the free `pdf-text` engine, so scanned/image-only CVs are not
supported on this provider).

## Deploy to Firebase

The app is set up as **Firebase Hosting** (the React frontend) + **Cloud Functions** (the Express API) + **Firestore** (per-visitor job storage, since Cloud Functions have no persistent local disk - this is why the deployed backend uses Firestore instead of the local JSON files used in `pnpm dev`).

One-time project setup (from the Firebase console, or CLI as noted):
1. **Enable Firestore** for the project (Firestore Database → Create database, native mode, pick a region). Required - it's not enabled yet.
2. **Upgrade the project to the Blaze (pay-as-you-go) plan.** Cloud Functions v2 (used here) require it, and it also causes real cost: every visitor's search calls the selected AI provider on your key (if they haven't set their own in Settings). There is no login/paywall in front of this app (by design, per your choice), so anyone with the URL can trigger searches.
3. Set the provider key(s) as Cloud Functions secrets (never commit them) - at least one is needed as a fallback, all of them if you want every provider to work without visitors supplying their own key:
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   firebase functions:secrets:set GEMINI_API_KEY
   firebase functions:secrets:set OPENROUTER_API_KEY
   ```
4. (Optional) Override the models by creating `functions/.env` from `functions/.env.example`.

Then, whenever you want to deploy:
```bash
pnpm deploy
```
(equivalent to `vite build && firebase deploy`, which deploys hosting, functions and Firestore rules together)

Firestore is locked down (`firestore.rules` denies all direct client access) since the Cloud Function - using the Admin SDK - is the only thing that talks to it.
