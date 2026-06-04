import { notFound } from "next/navigation";
import { DetailClient } from "@/components/DetailClient";
import profiles from "@/data/dummyProfiles.json";
import { getAlgorithmicMatches } from "@/utils/matchAlgo";
import type { Profile } from "@/utils/types";

const allProfiles = profiles as Profile[];

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = allProfiles.find((profile) => profile.id === id);

  if (!client) {
    notFound();
  }

  const matches = getAlgorithmicMatches(client, allProfiles);

  return <DetailClient client={client} matches={matches} />;
}
