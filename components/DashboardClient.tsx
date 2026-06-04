"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, LogOut, MapPin, Search, UsersRound } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Profile } from "@/utils/types";
import { getProfileName } from "@/utils/matchAlgo";

export function DashboardClient({ clients, totalProfiles }: { clients: Profile[]; totalProfiles: number }) {
  const router = useRouter();

  function logout() {
    document.cookie = "isLoggedIn=; path=/; max-age=0; SameSite=Strict";
    router.push("/");
    router.refresh();
  }

  const searching = clients.filter((client) => client.statusTag === "Searching").length;
  const matched = clients.filter((client) => client.statusTag === "Matched").length;

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-rose-600 text-white">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">TDC internal</p>
              <h1 className="text-xl font-semibold text-stone-950">Matchmaker Dashboard</h1>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Kpi icon={<UsersRound className="size-5" />} label="Assigned Clients" value={clients.length} />
          <Kpi icon={<Search className="size-5" />} label="Actively Searching" value={searching} />
          <Kpi icon={<HeartHandshake className="size-5" />} label="Matched" value={matched} sub={`${totalProfiles} profiles in pool`} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="text-base font-semibold text-stone-950">Customer Portfolio</h2>
            <p className="mt-1 text-sm text-stone-500">Click a row to review biodata and suggested matches.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Age</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Marital Status</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-rose-50/60">
                    <td className="px-5 py-4">
                      <Link className="block font-semibold text-stone-950" href={`/dashboard/${client.id}`}>
                        {getProfileName(client)}
                      </Link>
                      <span className="text-xs text-stone-500">{client.designation}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-700">{client.age}</td>
                    <td className="px-5 py-4 text-stone-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-stone-400" aria-hidden="true" />
                        {client.city}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-700">{client.maritalStatus}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={client.statusTag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-rose-50 text-rose-700">
        {icon}
      </div>
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-stone-950">{value}</p>
      {sub ? <p className="mt-1 text-xs text-stone-500">{sub}</p> : null}
    </div>
  );
}
