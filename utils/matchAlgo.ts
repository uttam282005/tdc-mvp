import type { MatchSuggestion, Preference, Profile } from "@/utils/types";

const ELITE_COLLEGES = [
  "IIT Delhi",
  "IIT Bombay",
  "BITS Pilani",
  "NIT Trichy",
  "Delhi University",
  "St. Xavier's College",
  "IIM Indore",
];

const TECH_TERMS = ["engineer", "developer", "product", "data", "architect", "analyst"];
const BUSINESS_TERMS = ["manager", "consultant", "finance", "strategy", "founder", "marketing"];

function compatiblePreference(client: Preference, candidate: Preference) {
  if (client === candidate) return true;
  return client === "Maybe" || candidate === "Maybe";
}

function professionBucket(profile: Profile) {
  const text = `${profile.designation} ${profile.degree}`.toLowerCase();
  if (TECH_TERMS.some((term) => text.includes(term))) return "tech";
  if (BUSINESS_TERMS.some((term) => text.includes(term))) return "business";
  if (text.includes("doctor") || text.includes("medical")) return "medical";
  if (text.includes("lawyer") || text.includes("legal")) return "legal";
  return "professional";
}

function languageOverlap(a: Profile, b: Profile) {
  const candidateLanguages = new Set(b.languagesKnown.map((language) => language.toLowerCase()));
  return a.languagesKnown.filter((language) => candidateLanguages.has(language.toLowerCase()));
}

function collegeTier(profile: Profile) {
  return ELITE_COLLEGES.includes(profile.undergradCollege) ? "top" : "standard";
}

function scoreMaleClient(client: Profile, candidate: Profile) {
  const reasons: string[] = [];
  let score = 45;

  if (candidate.age < client.age) {
    score += 14;
    reasons.push(`${candidate.firstName} is younger, matching the client's stated age preference.`);
  }
  if (candidate.height < client.height) {
    score += 10;
    reasons.push("Height preference is aligned.");
  }
  if (candidate.income <= client.income) {
    score += 10;
    reasons.push("Income expectations fit the requested traditional compatibility rule.");
  }
  if (compatiblePreference(client.wantKids, candidate.wantKids)) {
    score += 14;
    reasons.push("Their views on children are compatible.");
  }
  if (client.religion === candidate.religion) {
    score += 5;
    reasons.push("Shared religion may simplify family alignment.");
  }
  if (languageOverlap(client, candidate).length > 0) {
    score += 6;
    reasons.push("They share a common language.");
  }

  return { score: Math.min(score, 100), reasons };
}

function scoreFemaleClient(client: Profile, candidate: Profile) {
  const reasons: string[] = [];
  let score = 40;

  if (professionBucket(client) === professionBucket(candidate)) {
    score += 16;
    reasons.push("Their professional tracks are compatible.");
  }
  if (collegeTier(client) === collegeTier(candidate)) {
    score += 10;
    reasons.push("Their education backgrounds are in a similar tier.");
  }
  if (compatiblePreference(client.openToRelocate, candidate.openToRelocate)) {
    score += 14;
    reasons.push("Relocation preferences are aligned or flexible.");
  }
  if (client.religion === candidate.religion) {
    score += 10;
    reasons.push("Shared religious context supports cultural fit.");
  }
  const overlap = languageOverlap(client, candidate);
  if (overlap.length > 0) {
    score += Math.min(12, overlap.length * 6);
    reasons.push(`They share ${overlap.join(", ")} as common language${overlap.length > 1 ? "s" : ""}.`);
  }
  if (compatiblePreference(client.wantKids, candidate.wantKids)) {
    score += 8;
    reasons.push("Their family planning preferences are compatible.");
  }

  return { score: Math.min(score, 100), reasons };
}

export function getAlgorithmicMatches(
  clientProfile: Profile,
  masterPool: Profile[],
): MatchSuggestion[] {
  const candidates = masterPool.filter(
    (profile) => profile.id !== clientProfile.id && profile.gender !== clientProfile.gender,
  );

  const filtered =
    clientProfile.gender === "Male"
      ? candidates.filter(
          (candidate) =>
            candidate.gender === "Female" &&
            candidate.age < clientProfile.age &&
            candidate.height < clientProfile.height &&
            candidate.income <= clientProfile.income &&
            compatiblePreference(clientProfile.wantKids, candidate.wantKids),
        )
      : candidates.filter((candidate) => {
          const overlap = languageOverlap(clientProfile, candidate);
          return (
            candidate.gender === "Male" &&
            compatiblePreference(clientProfile.openToRelocate, candidate.openToRelocate) &&
            (clientProfile.religion === candidate.religion || overlap.length > 0) &&
            (professionBucket(clientProfile) === professionBucket(candidate) ||
              collegeTier(clientProfile) === collegeTier(candidate))
          );
        });

  return filtered
    .map((candidate) => {
      const result =
        clientProfile.gender === "Male"
          ? scoreMaleClient(clientProfile, candidate)
          : scoreFemaleClient(clientProfile, candidate);

      return {
        ...candidate,
        algorithmScore: result.score,
        matchReasons: result.reasons,
      };
    })
    .sort((a, b) => b.algorithmScore - a.algorithmScore);
}

export function formatIncome(income: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(income);
}

export function getProfileName(profile: Pick<Profile, "firstName" | "lastName">) {
  return `${profile.firstName} ${profile.lastName}`;
}
