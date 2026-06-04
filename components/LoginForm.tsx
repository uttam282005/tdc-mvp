"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, LockKeyhole, UserRound } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username === "admin" && password === "matchmaker2026") {
      document.cookie = "isLoggedIn=true; path=/; max-age=86400; SameSite=Strict";
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError("Invalid credentials. Use the sample matchmaker login to continue.");
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-lg border border-rose-100 bg-white p-6 shadow-xl shadow-rose-950/10 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/30"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-rose-600 text-white">
          <HeartHandshake className="size-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">The Date Crew</p>
          <h1 className="text-2xl font-semibold text-stone-950 dark:text-stone-50">Matchmaker Login</h1>
        </div>
      </div>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Username</span>
        <span className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 focus-within:border-rose-400 focus-within:bg-white dark:border-stone-700 dark:bg-stone-950 dark:focus-within:bg-stone-900">
          <UserRound className="size-4 text-stone-500" aria-hidden="true" />
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-11 w-full bg-transparent text-sm text-stone-950 outline-none dark:text-stone-50"
            autoComplete="username"
          />
        </span>
      </label>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">Password</span>
        <span className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 focus-within:border-rose-400 focus-within:bg-white dark:border-stone-700 dark:bg-stone-950 dark:focus-within:bg-stone-900">
          <LockKeyhole className="size-4 text-stone-500" aria-hidden="true" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full bg-transparent text-sm text-stone-950 outline-none dark:text-stone-50"
            type="password"
            autoComplete="current-password"
          />
        </span>
      </label>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button className="flex h-11 w-full items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700">
        Sign in
      </button>

      <p className="mt-5 rounded-md bg-stone-50 px-3 py-2 text-xs text-stone-600 dark:bg-stone-950 dark:text-stone-400">
        Sample credentials: <span className="font-semibold">admin</span> /{" "}
        <span className="font-semibold">matchmaker2026</span>
      </p>
    </form>
  );
}
