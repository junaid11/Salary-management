"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] backdrop-blur">
      <p className="font-display text-sm uppercase tracking-[0.24em] text-[var(--accent)]">Section Error</p>
      <h2 className="mt-3 text-2xl font-semibold">This view could not be rendered.</h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{error.message}</p>
      <button
        className="mt-5 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
        onClick={reset}
      >
        Retry
      </button>
    </div>
  );
}
