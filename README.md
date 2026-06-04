## 🚀 TDC Matchmaker Dashboard

**Internal MVP** designed for TDC matchmakers to efficiently manage customer profiles, review comprehensive biodata, rank suggested matches, capture custom notes, and preview personalized outreach.

* **Live App:** [tdc-mvp.vercel.app](https://tdc-mvp.vercel.app/)
* **GitHub Repository:** [github.com/uttam282005/tdc-mvp](https://github.com/uttam282005/tdc-mvp.git)

### 🔑 Sample Login Credentials

* **Username:** `admin`
* **Password:** `matchmaker2026`

### 💻 Local Setup & Installation

Run the following commands in your terminal to get the project started locally:

```bash
bun install      # Install dependencies
bun run dev      # Start the local development server

```

> **Note:** Once the server is running, open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack Choices

The MVP leverages modern tools built for speed, type safety, and smooth deployment:

* **Framework & UI:** Built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS 4** for a highly responsive user experience and seamless developer workflow.
* **Runtime & Package Manager:** **Bun** is utilized to drastically speed up installation and execution times.
* **Authentication & Security:** Uses `proxy.ts` for secure route protection, adapting to the updated middleware standards introduced in Next.js 16.
* **Data Storage:** Local mock database housed in `data/dummyProfiles.json` (containing 100+ rich profiles) allowing the app to be fully functional anywhere without requiring an active external database.
* **Icons & Core AI:** Visuals are supported by `lucide-react`. The AI layer integrates Google's **Gemini 2.5 Flash** model (`app/api/ai-match/route.ts`).

---

## 🧠 Matching Logic & Algorithm

The core engine located in `utils/matchAlgo.ts` operates on specific cross-gender criteria tailored heavily to standard preferences in the Indian matchmaking landscape:

### Male Client Preferences (Targeting Female Candidates)

Filters candidates down to women who are:

* Younger and shorter.
* Earn less than or equal to the client.
* Have aligned or compatible children preferences.

### Female Client Preferences (Targeting Male Candidates)

Applies a broader compatibility algorithm focusing heavily on:

* Profession and educational tiering.
* Relocation flexibility.
* Shared religion and language overlap.
* Family-planning alignment.

> **Scoring Mechanism:** Every potential candidate receives a weighted score ranging from **0 to 100**. This score is accompanied by human-readable explanations for each metric, giving matchmakers the context needed to manually override suggestions if necessary.

---

## 🤖 AI Usage & Assumptions

### AI Integration & Fallback

* **When Configured (`GEMINI_API_KEY` present):** The system passes profile data to Gemini with a structured JSON schema. It returns a definitive compatibility score, a concise two-sentence reasoning breakdown, and a warm, ready-to-send personalized introduction for matchmaker outreach.
* **When Unconfigured (No API key):** The system uses a deterministic backend fallback engine utilizing the same profile fields to generate consistent insights, ensuring the hosted Vercel preview never breaks.

### Key Framework Assumptions

* **Strictly Cross-Gender:** The database pool currently features strictly opposite-gender matching configurations.
* **Traditional Metrics:** Income and height parameters prioritize traditional preference dynamics for male clients.
* **Flexibility Optimization:** A stance of `"Maybe"` regarding relocation or children is programmatically treated as fully compatible with any other stance to maximize the potential matching pool.
* **Human-in-the-Loop:** The algorithm acts strictly as an advisory, preference-based tool rather than a predictive generator—final matchmaking authority is always left to the human specialist.
