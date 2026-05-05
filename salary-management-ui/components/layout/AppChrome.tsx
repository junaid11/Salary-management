import Link from "next/link";
import { Building2, ChartColumnBig, UsersRound } from "lucide-react";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--foreground)] text-white shadow-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Incubyte Assessment</p>
              <h1 className="text-xl font-semibold">Salary Management Tool</h1>
            </div>
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1.5">
            <Link className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/80" href="/">
              <ChartColumnBig className="h-4 w-4" />
              Dashboard
            </Link>
            <Link className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/80" href="/employees">
              <UsersRound className="h-4 w-4" />
              Employees
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
    </div>
  );
}
