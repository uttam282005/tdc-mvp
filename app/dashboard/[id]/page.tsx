import { notFound } from "next/navigation";
import { DetailClient } from "@/components/DetailClient";
import { db, profiles } from "@/db";
import { getAlgorithmicMatches } from "@/utils/matchAlgo";
import type { Profile } from "@/utils/types";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allProfilesRaw = await db.select().from(profiles);
  const allProfiles: Profile[] = allProfilesRaw.map((p) => ({
    ...p,
    assignedClient: p.assignedClient ?? undefined,
    diet: p.diet ?? undefined,
    familyType: p.familyType ?? undefined,
    manglik: p.manglik ?? undefined,
    values: p.values ?? undefined,
    bio: p.bio ?? undefined,
  }));
  const client = allProfiles.find((profile) => profile.id === id);

  if (!client) {
    notFound();
  }

  const matches = getAlgorithmicMatches(client, allProfiles);

  return <DetailClient client={client} matches={matches} />;
}


