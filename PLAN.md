You are an expert Full-Stack Software Engineer specializing in Next.js (App Router), Tailwind CSS, Bun, and AI engineering. 

Your objective is to generate the entire codebase for a high-fidelity internal tool MVP called "TDC Matchmaker Dashboard". This system enables matchmakers to manage client portfolios, review detailed match criteria, process gender-specific matching rules, and integrate OpenAI to evaluate relationship fit and compose outreach summaries.

### TECH STACK & ARCHITECTURE RULES
1. Framework: Next.js 14+ (App Router, using Bun as the package manager/runtime environment).
2. Styling: Tailwind CSS (Clean, polished, modern corporate aesthetic utilizing soft rose/pink accents for an emotionally aligned matchmaking tool theme). Use Lucide React for modern, scannable iconography.
3. Component Separation: Provide complete, copy-pasteable files. Do not use placeholding syntax or leave "TODO: implement later" comments.
4. Database/State: Use a unified file-based architecture (`data/dummyProfiles.json` at the root level) acting as a local database pool containing exactly 100 mock profiles.
5. Absolute Imports: Since this project does not use a "src" folder, all absolute imports should reference your root configuration (e.g., `@/components/...` or `@/utils/...` depending on your tsconfig, or clean relative paths like `../../utils/matchAlgo`).

### ENTIRE DIRECTORY STRUCTURING TO GENERATE

Please output the code for each of the following files completely:

1. `data/dummyProfiles.json` (Create a root-level 'data' directory)
2. `utils/matchAlgo.ts` (Create a root-level 'utils' directory)
3. `middleware.ts` (Placed at the root level alongside app/)
4. `app/page.tsx` (Login Route)
5. `app/dashboard/page.tsx` (Main Portal Grid)
6. `app/dashboard/[id]/page.tsx` (Deep Dive Detail + Matching Engine View)
7. `app/api/ai-match/route.ts` (OpenAI prompt controller)

---

### STEP-BY-STEP SPECIFICATION FOR EACH FILE

#### 1. `data/dummyProfiles.json`
Provide an array containing exactly 100 distinct profile objects representing a rich Indian matrimonial pool. Half must be male, half female. Every profile object must feature these exact keys:
- Basic Demographics: `id` (string), `firstName`, `lastName`, `gender` ('Male' | 'Female'), `dob`, `age`, `height` (in cm), `maritalStatus` ('Never Married' | 'Divorced' | 'Awaiting Divorce').
- Geography & Family: `country`, `city`, `religion`, `caste`, `siblings` (number), `wantKids` ('Yes' | 'No' | 'Maybe').
- Career & Finance: `income` (annual in INR, e.g., 1200000), `undergradCollege`, `degree`, `currentCompany`, `designation`.
- Relocation & Lifestyle: `openToRelocate` ('Yes' | 'No' | 'Maybe'), `openToPets` ('Yes' | 'No' | 'Maybe'), `languagesKnown` (array of strings, e.g., ["English", "Hindi", "Marathi"]).
- System Tags: `statusTag` ('Onboarding' | 'Searching' | 'Matched').

#### 2. `utils/matchAlgo.ts`
Write a robust, pure TypeScript function `getAlgorithmicMatches(clientProfile: Profile, masterPool: Profile[]): Profile[]`. It must segment logical rules exactly by gender:
- If Client is MALE: Filter the pool for Female candidates who are:
  - Younger than the client.
  - Shorter in height than the client.
  - Earn less than or equal to the client's income.
  - Match on children views (if client says 'Yes', candidate must say 'Yes' or 'Maybe').
- If Client is FEMALE: Filter the pool for Male candidates with a high-value checklist:
  - Deep compatibility on profession (e.g., both corporate/tech or shared tier of undergrad college background).
  - Explicit alignment on relocation preferences (`openToRelocate` matches exactly or is 'Maybe').
  - Shared cultural values (matching Religion and overlapping Language array).

#### 3. `middleware.ts`
Implement standard Next.js edge cookie monitoring. Read `cookies().get("isLoggedIn")`. 
- Protect all subroutes matching `/dashboard/:path*`. If unauthenticated, redirect to `/`.
- If an authenticated user hits `/`, redirect them directly into `/dashboard`.

#### 4. `app/page.tsx` (Login Screen)
A visually stunning, soft card layout. 
- Hardcode credentials (`admin` / `matchmaker2026`) directly into the click controller to fulfill sample requirement checks.
- On valid submission, append `isLoggedIn=true; path=/; max-age=86400; SameSite=Strict` onto `document.cookie` and trigger `router.push('/dashboard')`. Throw a clean inline error block if credentials fail.

#### 5. `app/dashboard/page.tsx` (Main Dashboard)
- Design an elegant multi-column data dashboard tracking all clients.
- Render a header with branding, a summary counter KPI block, and a working "Logout" button that destroys the cookie.
- Display a scannable client data table. Each entry must highlight: Full Name, Age, Location, Marital Status, and a badge colorized by `statusTag` (e.g., green for Matched, soft amber for Searching).
- Make rows clickable, linking via NextJS Navigation router straight into `/dashboard/[id]`.

#### 6. `app/dashboard/[id]/page.tsx` (Detailed Client View & Match Deck)
- Construct a layout split into two functional panels.
- Left Panel (Full Client Biodata): Beautifully display every field from the client JSON template sorted cleanly into technical categories (Demographics, Career & Income, Family & Lifestyle Preferences). Underneath the biodata fields, implement a fully interactive "Matchmaker Notes" textarea with a mock "Save Notes" trigger toast.
- Right Panel (Algorithmic & AI Match suggestions):
  - Run the `getAlgorithmicMatches` function using the current client against your JSON pool.
  - Display the top suggested matches in an actionable vertical list card layout.
  - Each match card needs a distinct, prominent button reading "Send Match". Clicking this must render a gorgeous UI Modal/Toast containing a preview copy of a mock outreach email with the candidate’s primary bio info.
  - Next to each match card, show an "AI Insights" container. This section will asynchronously pull analytical data from the OpenAI route handler.

#### 7. `app/api/ai-match/route.ts`
Create a Next.js App Router POST Route Handler which interfaces with OpenAI's Chat Completions endpoint using `gpt-4o-mini`.
- It accepts the client profile and a potential match candidate profile within the request body.
- It submits a structured prompt instructing the model to evaluate compatibility based on lifestyle, cultural metrics, and career profiles.
- It must return a strict JSON payload format containing:
  1. `compatibilityScore`: An integer between 1 and 100.
  2. `reasoning`: A 2-sentence natural language brief detailing precisely why they fit or where potential friction points reside.
  3. `personalizedIntro`: A warm, custom-tailored opening sequence intended for an introduction email (e.g., "We noticed you both share a passion for tech careers in Bangalore and are avid dog lovers...").

---

Ensure your generation produces complete, valid TypeScript code mapped precisely to this flat root directory configuration. Include necessary layout configurations, standard Tailwind utility implementations, and inline descriptive commentary explaining data mappings or logical flows. Generate the files now.
