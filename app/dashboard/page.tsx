import { DashboardClient } from "@/components/DashboardClient";
import profiles from "@/data/dummyProfiles.json";
import type { Profile } from "@/utils/types";

const allProfiles = profiles as Profile[];

export default function DashboardPage() {
  const clients = allProfiles.filter((profile) => profile.assignedClient).slice(0, 18);

  return <DashboardClient clients={clients} totalProfiles={allProfiles.length} />;
}
