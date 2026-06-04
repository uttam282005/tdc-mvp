import { LoginForm } from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#fff1f2,transparent_34%),linear-gradient(135deg,#fafaf9,#fff7ed)] px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <section className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">Internal Matchmaking Ops</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            TDC Matchmaker Dashboard
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            Manage verified customer profiles, track journey status, evaluate compatibility, and send thoughtful match
            introductions from one focused workspace.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
