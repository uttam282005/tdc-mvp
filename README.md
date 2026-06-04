# TDC Matchmaker Dashboard

Internal MVP for The Date Crew matchmakers to manage customer profiles, review biodata, rank suggested matches, capture notes, and preview match outreach.

- **Live app**: https://tdc-mvp.vercel.app/
- **GitHub repo**: https://github.com/uttam282005/tdc-mvp.git

## Sample Login Credentials

- Username: `admin`
- Password: `matchmaker2026`

## Run Locally

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Write-up

**Tech choices.** This MVP is built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4 — chosen for a fast, type-safe development loop and a polished component ecosystem. Bun is used as the runtime and package manager for its speed. The app uses `proxy.ts` for route protection because Next.js 16 has renamed the old middleware convention to Proxy. Data is kept in `data/dummyProfiles.json` (100+ profiles) so the demo can be deployed anywhere without a database. `lucide-react` provides consistent icons, and the AI layer uses Google's Gemini `gemini-2.5-flash` model via `app/api/ai-match/route.ts`.

**Matching logic.** The matching engine in `utils/matchAlgo.ts` is gender-specific. For male customers, candidates are filtered to women who are younger, shorter, earn less or equal, and have compatible children preferences — reflecting common preference patterns in the Indian matchmaking space. For female customers, a broader compatibility model is used: candidates are evaluated on profession/education tier, relocation flexibility, shared religion, language overlap, and family-planning alignment. Each match candidate receives a weighted score (0–100) with human-readable reasoning for every contributing factor, so matchmakers can understand and override suggestions when needed.

**AI usage and assumptions.** When `GEMINI_API_KEY` is configured, the AI route calls Gemini with a structured prompt and JSON schema to produce a compatibility score, two-sentence reasoning, and a warm personalized introduction for the matchmaker to use. If no key is present, the route returns a deterministic fallback insight built from the same profile fields — ensuring the hosted demo remains fully functional during review. Key assumptions baked into the system: matches are strictly cross-gender (the pool contains opposite-gender profiles only); income and height comparisons presume traditional preference patterns for male clients; "Maybe" on children or relocation is treated as compatible with any stance (maximising match pool); and the algorithm is preference-based, not predictive — it surfaces compatible candidates but leaves final judgment to the human matchmaker.
