# Job Scout

React + TypeScript job finder using the OpenAI Responses API with built-in web search.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. There's no bundled API key: the app will prompt you for your own
OpenAI API key on first run (see "What it does" below).

## What it does
- On first visit, enter your own OpenAI API key. It's stored only in your browser's
  `localStorage` and sent per-request - never saved on any server. You can change it later from
  the menu → Settings.
- Then upload your CV (PDF). It's sent to OpenAI to extract a candidate profile, which is also
  saved in `localStorage` and reused for every future search - no need to re-upload.
- Shows one job at a time, carousel-style, instead of a list.
- Only ever surfaces roles published in the last 3 days, matched against your uploaded CV.
- Asks for original employer / ATS application URLs, avoiding paywalled boards.
- Deduplicates against every job you've ever been shown (by URL and by company+title), so the same posting never comes back twice.
- "Apply" opens the original posting in a new tab. "Applied" or "Ignore" records your decision and immediately loads the next unseen job - applied/ignored jobs are excluded from all future searches.
- Each offer includes a short, ready-to-copy "why working for us" answer for that specific posting, deliberately written short and casual rather than corporate-sounding.
- "Tailor CV for this role" generates a PDF of your CV re-emphasized for the offer you're viewing (same facts, reordered/reworded skills and bullets - never invents anything), in one of 5 layouts (Classic, Sidebar, Bold Header, Minimal, Timeline), each a single accent color.
- The menu (hamburger icon, top left) lists every job you've applied to and opens Settings, where you can update your API key and pick the tailored-CV layout.

Locally, state is persisted per-browser in `data/clients/<clientId>.json`. `OPENAI_API_KEY` in
`.env` (copy `.env.example`) is an optional server-side fallback for calling the API directly
(e.g. with `curl`) - the app itself always asks for a key in the browser regardless, since that's
what actually gets sent with each request.

## Deploy to Firebase

The app is set up as **Firebase Hosting** (the React frontend) + **Cloud Functions** (the Express API) + **Firestore** (per-visitor job storage, since Cloud Functions have no persistent local disk - this is why the deployed backend uses Firestore instead of the local JSON files used in `pnpm dev`).

One-time project setup (from the Firebase console, or CLI as noted):
1. **Enable Firestore** for the project (Firestore Database → Create database, native mode, pick a region). Required - it's not enabled yet.
2. **Upgrade the project to the Blaze (pay-as-you-go) plan.** Cloud Functions v2 (used here) require it, and it also causes real cost: every visitor's search calls the OpenAI API on your key. There is no login/paywall in front of this app (by design, per your choice), so anyone with the URL can trigger searches.
3. Set the OpenAI key as a Cloud Functions secret (never commit it):
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```
4. (Optional) Override the model by creating `functions/.env` from `functions/.env.example`.

Then, whenever you want to deploy:
```bash
pnpm deploy
```
(equivalent to `vite build && firebase deploy`, which deploys hosting, functions and Firestore rules together)

Firestore is locked down (`firestore.rules` denies all direct client access) since the Cloud Function - using the Admin SDK - is the only thing that talks to it.
