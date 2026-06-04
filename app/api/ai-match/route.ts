import type { NextRequest } from "next/server";
import type { AiMatchInsight, Profile } from "@/utils/types";
import { getProfileName } from "@/utils/matchAlgo";

function clampScore(score: number) {
  return Math.max(1, Math.min(100, Math.round(score)));
}

function fallbackInsight(client: Profile, candidate: Profile): AiMatchInsight {
  const sharedLanguages = client.languagesKnown.filter((language) =>
    candidate.languagesKnown.includes(language),
  );
  const sharedCulture = client.religion === candidate.religion;
  const relocationFit =
    client.openToRelocate === candidate.openToRelocate ||
    client.openToRelocate === "Maybe" ||
    candidate.openToRelocate === "Maybe";
  const kidsFit =
    client.wantKids === candidate.wantKids ||
    client.wantKids === "Maybe" ||
    candidate.wantKids === "Maybe";

  const score =
    52 +
    (sharedCulture ? 12 : 0) +
    Math.min(sharedLanguages.length * 8, 16) +
    (relocationFit ? 10 : 0) +
    (kidsFit ? 10 : 0);

  return {
    compatibilityScore: clampScore(score),
    reasoning: `${getProfileName(client)} and ${getProfileName(candidate)} show ${
      sharedCulture ? "strong cultural alignment" : "some cultural differences to discuss"
    }, with ${sharedLanguages.length ? `shared language comfort in ${sharedLanguages.join(", ")}` : "limited language overlap"}. ${
      relocationFit && kidsFit
        ? "Their relocation and family-planning preferences are flexible enough for a promising introduction."
        : "The matchmaker should clarify relocation or family-planning expectations before introducing them."
    }`,
    personalizedIntro: `We noticed that ${client.firstName} and ${candidate.firstName} both bring thoughtful professional ambition and clear family expectations to the search. This introduction could be a warm starting point to explore values, lifestyle, and long-term compatibility.`,
  };
}

function parseInsight(raw: string): AiMatchInsight | null {
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<AiMatchInsight>;

    if (
      typeof parsed.compatibilityScore === "number" &&
      typeof parsed.reasoning === "string" &&
      typeof parsed.personalizedIntro === "string"
    ) {
      return {
        compatibilityScore: clampScore(parsed.compatibilityScore),
        reasoning: parsed.reasoning,
        personalizedIntro: parsed.personalizedIntro,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    client?: Profile;
    candidate?: Profile;
  };

  if (!body.client || !body.candidate) {
    return Response.json({ error: "client and candidate profiles are required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(fallbackInsight(body.client, body.candidate));
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are a senior Indian matrimonial matchmaker. Return only strict JSON with compatibilityScore, reasoning, and personalizedIntro.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: JSON.stringify({
            instruction:
              "Evaluate relationship fit using lifestyle, cultural metrics, family preferences, career profile, relocation, children, pets, language, and education. Keep reasoning exactly two sentences and personalizedIntro warm but concise.",
            client: body.client,
            candidate: body.candidate,
            schema: {
              compatibilityScore: "integer from 1 to 100",
              reasoning: "two-sentence compatibility brief",
              personalizedIntro: "warm opening for an introduction email",
            },
                  }),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                compatibilityScore: { type: "INTEGER" },
                reasoning: { type: "STRING" },
                personalizedIntro: { type: "STRING" },
              },
              required: ["compatibilityScore", "reasoning", "personalizedIntro"],
            },
          },
        }),
      },
    );

    if (!response.ok) {
      return Response.json(fallbackInsight(body.client, body.candidate));
    }

    const geminiResponse = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const content = geminiResponse.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("");
    const insight = content ? parseInsight(content) : null;
    return Response.json(insight ?? fallbackInsight(body.client, body.candidate));
  } catch {
    return Response.json(fallbackInsight(body.client, body.candidate));
  }
}
