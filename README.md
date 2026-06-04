# TDC Matchmaker Dashboard

Internal MVP for The Date Crew matchmakers to manage customer profiles, review biodata, rank suggested matches, capture notes, and preview match outreach.

## Run Locally

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

Sample credentials:

- Username: `admin`
- Password: `matchmaker2026`

## Tech Choices

This MVP uses Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Bun, `lucide-react`, Gemini, and a static JSON profile pool. The app uses `proxy.ts` for route protection because Next.js 16 has renamed the old middleware convention to Proxy. Data is kept in `data/dummyProfiles.json` to make the demo easy to deploy without a database.

The matching engine is implemented in `utils/matchAlgo.ts`. Male customers are matched with women who are younger, shorter, earn less or equal, and have compatible children preferences. Female customers use a broader compatibility model covering profession/education tier, relocation flexibility, religion, language overlap, and children preferences.

AI is exposed through `app/api/ai-match/route.ts`. When `GEMINI_API_KEY` is configured, the route calls Gemini `gemini-2.5-flash` and returns a strict JSON compatibility score, reasoning, and personalized introduction. If no key is present, the route returns deterministic fallback insight so the hosted demo remains functional during review.
