import { DashboardClient } from "@/components/DashboardClient";
import { db, profiles } from "@/db";
import type { Profile } from "@/utils/types";

export default async function DashboardPage() {
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
  const clients = allProfiles.filter((profile) => profile.assignedClient).slice(0, 18);

  return <DashboardClient clients={clients} totalProfiles={allProfiles.length} />;
}


