"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  HeartHandshake,
  Mail,
  MapPin,
  NotebookPen,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { formatIncome, getProfileName } from "@/utils/matchAlgo";
import type { AiMatchInsight, MatchSuggestion, Profile } from "@/utils/types";

type InsightState =
  | { status: "loading"; data?: never; error?: never }
  | { status: "ready"; data: AiMatchInsight; error?: never }
  | { status: "error"; data?: never; error: string };

export function DetailClient({ client, matches }: { client: Profile; matches: MatchSuggestion[] }) {
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<MatchSuggestion | null>(null);
  const [insights, setInsights] = useState<Record<string, InsightState>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNotes(window.localStorage.getItem(`notes:${client.id}`) ?? "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [client.id]);

  useEffect(() => {
    const topMatches = matches.slice(0, 8);
    topMatches.forEach((candidate) => {
      setInsights((current) => {
        if (current[candidate.id]) return current;
        return { ...current, [candidate.id]: { status: "loading" } };
      });

      fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, candidate }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("AI insight request failed");
          return response.json() as Promise<AiMatchInsight>;
        })
        .then((data) => {
          setInsights((current) => ({ ...current, [candidate.id]: { status: "ready", data } }));
        })
        .catch(() => {
          setInsights((current) => ({
            ...current,
            [candidate.id]: { status: "error", error: "Insight unavailable. Algorithm score is still available." },
          }));
        });
    });
  }, [client, matches]);

  function saveNotes() {
    window.localStorage.setItem(`notes:${client.id}`, notes);
    setToast("Notes saved for this customer.");
    window.setTimeout(() => setToast(""), 2200);
  }

  const groupedFields = useMemo(
    () => [
      {
        title: "Demographics",
        icon: <UserRound className="size-4" />,
        fields: [
          ["First Name", client.firstName],
          ["Last Name", client.lastName],
          ["Gender", client.gender],
          ["Date of Birth", client.dob],
          ["Age", client.age],
          ["Height", `${client.height} cm`],
          ["Country", client.country],
          ["City", client.city],
          ["Email", `${client.firstName.toLowerCase()}.${client.lastName.toLowerCase()}@example.com`],
          ["Phone Number", `+91 90000 ${client.id.slice(1).padStart(5, "0")}`],
        ],
      },
      {
        title: "Career & Education",
        icon: <BriefcaseBusiness className="size-4" />,
        fields: [
          ["Undergraduate College", client.undergradCollege],
          ["Degree", client.degree],
          ["Income", formatIncome(client.income)],
          ["Current Company", client.currentCompany],
          ["Designation", client.designation],
        ],
      },
      {
        title: "Family & Preferences",
        icon: <HeartHandshake className="size-4" />,
        fields: [
          ["Marital Status", client.maritalStatus],
          ["Languages Known", client.languagesKnown.join(", ")],
          ["Siblings", client.siblings],
          ["Caste", client.caste],
          ["Religion", client.religion],
          ["Want Kids", client.wantKids],
          ["Open to Relocate", client.openToRelocate],
          ["Open to Pets", client.openToPets],
          ["Diet", client.diet ?? "Not specified"],
          ["Family Type", client.familyType ?? "Not specified"],
          ["Manglik", client.manglik ?? "Not specified"],
          ["Values", client.values?.join(", ") ?? "Not specified"],
        ],
      },
    ],
    [client],
  );

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <Link
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-300"
              href="/dashboard"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">{getProfileName(client)}</h1>
              <StatusBadge status={client.statusTag} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
              <MapPin className="size-4" aria-hidden="true" />
              {client.city}, {client.country} · {client.age} · {client.designation}
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8">
        <section className="space-y-5">
          {groupedFields.map((group) => (
            <div key={group.title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="mb-4 flex items-center gap-2 text-stone-950 dark:text-stone-50">
                <span className="flex size-8 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  {group.icon}
                </span>
                <h2 className="text-base font-semibold">{group.title}</h2>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                {group.fields.map(([label, value]) => (
                  <div key={String(label)} className="border-b border-stone-100 pb-2 dark:border-stone-800">
                    <dt className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="mb-3 flex items-center gap-2">
              <NotebookPen className="size-5 text-rose-700" aria-hidden="true" />
              <h2 className="text-base font-semibold text-stone-950 dark:text-stone-50">Matchmaker Notes</h2>
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-32 w-full resize-y rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:bg-white dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:bg-stone-900"
              placeholder="Record call notes, family context, preferences, or follow-up reminders."
            />
            <button
              onClick={saveNotes}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800"
            >
              <Check className="size-4" aria-hidden="true" />
              Save Notes
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="size-5 text-rose-700" aria-hidden="true" />
              <h2 className="text-base font-semibold text-stone-950 dark:text-stone-50">Suggested Matches</h2>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Ranked from {matches.length} algorithmic matches in the 100-profile pool.
            </p>
          </div>

          {matches.slice(0, 8).map((candidate) => (
            <article key={candidate.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-stone-950 dark:text-stone-50">{getProfileName(candidate)}</h3>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    {candidate.age} · {candidate.city} · {candidate.designation}
                  </p>
                </div>
                <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  {candidate.algorithmScore}%
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-stone-600 dark:text-stone-300">
                {candidate.matchReasons.slice(0, 3).map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <AiInsightView state={insights[candidate.id] ?? { status: "loading" }} />

              <button
                onClick={() => setSelectedMatch(candidate)}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700"
              >
                <Send className="size-4" aria-hidden="true" />
                Send Match
              </button>
            </article>
          ))}
        </aside>
      </div>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-md bg-stone-950 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      {selectedMatch ? (
        <OutreachModal
          client={client}
          candidate={selectedMatch}
          insight={insights[selectedMatch.id]?.status === "ready" ? insights[selectedMatch.id].data : undefined}
          onClose={() => setSelectedMatch(null)}
        />
      ) : null}
    </main>
  );
}

function AiInsightView({ state }: { state: InsightState }) {
  if (state.status === "loading") {
    return (
      <div className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
        Generating AI insight...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
        {state.error}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-rose-100 bg-rose-50 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-rose-700">AI Insights</span>
        <span className="text-xs font-bold text-stone-950 dark:text-stone-50">{state.data.compatibilityScore}/100</span>
      </div>
      <p className="text-sm leading-6 text-stone-700 dark:text-stone-300">{state.data.reasoning}</p>
    </div>
  );
}

function OutreachModal({
  client,
  candidate,
  insight,
  onClose,
}: {
  client: Profile;
  candidate: MatchSuggestion;
  insight?: AiMatchInsight;
  onClose: () => void;
}) {
  const intro =
    insight?.personalizedIntro ??
    `We think ${client.firstName} and ${candidate.firstName} could have a meaningful first conversation based on shared priorities and long-term intent.`;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-stone-950/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl dark:bg-stone-900">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-rose-700" aria-hidden="true" />
            <h2 className="text-base font-semibold text-stone-950 dark:text-stone-50">Mock Outreach Email</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800" aria-label="Close modal">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-4 p-5 text-sm leading-6 text-stone-700 dark:text-stone-300">
          <p className="font-medium text-stone-950 dark:text-stone-50">Subject: A thoughtful introduction from The Date Crew</p>
          <p>Hi {client.firstName},</p>
          <p>{intro}</p>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
            <p className="font-semibold text-stone-950 dark:text-stone-50">{getProfileName(candidate)}</p>
            <p>
              {candidate.age}, {candidate.city} · {candidate.height} cm · {candidate.designation} at{" "}
              {candidate.currentCompany}
            </p>
            <p>
              {candidate.degree}, {candidate.undergradCollege} · {candidate.religion}, {candidate.caste}
            </p>
          </div>
          <p>
            We can share the full profile and schedule a short introduction call if this feels aligned with your current
            preferences.
          </p>
          <p>Warmly,<br />TDC Matchmaking Team</p>
        </div>
      </div>
    </div>
  );
}
