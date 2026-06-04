"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, HeartHandshake, LogOut, MapPin, RotateCcw, Search, UsersRound } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { Profile } from "@/utils/types";
import { getProfileName } from "@/utils/matchAlgo";

export function DashboardClient({ clients, totalProfiles }: { clients: Profile[]; totalProfiles: number }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [maritalFilter, setMaritalFilter] = useState("All");

  function logout() {
    document.cookie = "isLoggedIn=; path=/; max-age=0; SameSite=Strict";
    router.push("/");
    router.refresh();
  }

  const filterOptions = useMemo(
    () => ({
      statuses: Array.from(new Set(clients.map((client) => client.statusTag))).sort(),
      genders: Array.from(new Set(clients.map((client) => client.gender))).sort(),
      cities: Array.from(new Set(clients.map((client) => client.city))).sort(),
      maritalStatuses: Array.from(new Set(clients.map((client) => client.maritalStatus))).sort(),
    }),
    [clients],
  );

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return clients.filter((client) => {
      const searchableText = [
        getProfileName(client),
        client.city,
        client.maritalStatus,
        client.statusTag,
        client.gender,
        client.designation,
        client.currentCompany,
        client.religion,
        client.caste,
        client.languagesKnown.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (statusFilter === "All" || client.statusTag === statusFilter) &&
        (genderFilter === "All" || client.gender === genderFilter) &&
        (cityFilter === "All" || client.city === cityFilter) &&
        (maritalFilter === "All" || client.maritalStatus === maritalFilter)
      );
    });
  }, [cityFilter, clients, genderFilter, maritalFilter, query, statusFilter]);

  function resetFilters() {
    setQuery("");
    setStatusFilter("All");
    setGenderFilter("All");
    setCityFilter("All");
    setMaritalFilter("All");
  }

  const searching = clients.filter((client) => client.statusTag === "Searching").length;
  const matched = clients.filter((client) => client.statusTag === "Matched").length;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-rose-600 text-white">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">TDC internal</p>
              <h1 className="text-xl font-semibold text-stone-950 dark:text-stone-50">Matchmaker Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </div>
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
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="border-b border-stone-200 px-5 py-4 dark:border-stone-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-stone-950 dark:text-stone-50">Customer Portfolio</h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  Showing {filteredClients.length} of {clients.length} assigned customers.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(150px,1fr))]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Search
                </span>
                <span className="flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 focus-within:border-rose-400 focus-within:bg-white dark:border-stone-700 dark:bg-stone-950 dark:focus-within:bg-stone-900">
                  <Search className="size-4 text-stone-400" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full bg-transparent text-sm text-stone-950 outline-none dark:text-stone-50"
                    placeholder="Name, city, company, caste..."
                  />
                </span>
              </label>
              <FilterSelect label="Status" value={statusFilter} options={filterOptions.statuses} onChange={setStatusFilter} />
              <FilterSelect label="Gender" value={genderFilter} options={filterOptions.genders} onChange={setGenderFilter} />
              <FilterSelect label="City" value={cityFilter} options={filterOptions.cities} onChange={setCityFilter} />
              <FilterSelect
                label="Marital Status"
                value={maritalFilter}
                options={filterOptions.maritalStatuses}
                onChange={setMaritalFilter}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <Filter className="size-4" aria-hidden="true" />
              Filters apply instantly to the customer table.
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Age</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Marital Status</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-rose-50/60 dark:hover:bg-rose-950/20">
                    <td className="px-5 py-4">
                      <Link className="block font-semibold text-stone-950 dark:text-stone-50" href={`/dashboard/${client.id}`}>
                        {getProfileName(client)}
                      </Link>
                      <span className="text-xs text-stone-500 dark:text-stone-400">{client.designation}</span>
                    </td>
                    <td className="px-5 py-4 text-stone-700 dark:text-stone-300">{client.age}</td>
                    <td className="px-5 py-4 text-stone-700 dark:text-stone-300">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-stone-400" aria-hidden="true" />
                        {client.city}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-700 dark:text-stone-300">{client.maritalStatus}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={client.statusTag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClients.length === 0 ? (
            <div className="border-t border-stone-100 px-5 py-10 text-center dark:border-stone-800">
              <p className="text-sm font-semibold text-stone-950 dark:text-stone-50">No customers match the current filters.</p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Reset filters or search for a broader term.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-stone-200 bg-stone-50 px-3 text-sm font-medium text-stone-800 outline-none focus:border-rose-400 focus:bg-white dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:bg-stone-900"
      >
        <option value="All">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        {icon}
      </div>
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-stone-950 dark:text-stone-50">{value}</p>
      {sub ? <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{sub}</p> : null}
    </div>
  );
}
