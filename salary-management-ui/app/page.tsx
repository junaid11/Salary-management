export default function HomePage() {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
      <p className="font-display text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Frontend Scaffold</p>
      <h2 className="mt-2 text-3xl font-semibold">Salary Management UI</h2>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        App shell, styling system, and data infrastructure are in place. Feature screens land in subsequent commits.
      </p>
    </section>
  );
}
